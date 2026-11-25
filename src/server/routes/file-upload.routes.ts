import axios from 'axios';
import { Router } from 'express';
import multer from 'multer';
import { extname } from 'path';
import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';

import { getAppInsightsClient } from '../../globals';
import { ENVIRONMENT, REQUEST_TIMEOUT_MS } from '../config/constants.config';
import { UPLOAD_URL_FUNCTION_KEY } from '../config/upload.config';
import { getAccessTokenBySessionId } from './authentication.routes';
import { UrlModel } from '../../modules/core/models/url.model';

const MAX_FILE_SIZE = 20_000_000;
const fileUploadRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  // Busboy emits LIMIT_FILE_SIZE when it reaches this value, not only above it.
  // Read one extra byte so exactly MAX_FILE_SIZE remains valid.
  limits: { fileSize: MAX_FILE_SIZE + 1, files: 1 },
  fileFilter: (_req, file, callback) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    const allowedExtension = /\.(pdf|docx|xlsx|csv)$/i.test(file.originalname);
    callback(null, allowedExtension && allowedMimeTypes.includes(file.mimetype));
  }
});

function logUploadFailure(stage: string, error?: unknown): void {
  // Raw Axios errors can contain signed URLs, credentials and uploaded buffers.
  getAppInsightsClient().trackTrace({
    message: 'FileUpload::failed',
    severity: SeverityLevel.Warning,
    properties: {
      stage,
      ...(axios.isAxiosError(error) && {
        statusCode: error.response?.status,
        code: error.code
      })
    }
  });
}

async function getUploadUrl(
  accessToken: string,
  innovationId: string,
  body: { filename: string }
): Promise<{ id: string; name: string; url: string }> {
  const url = new UrlModel(ENVIRONMENT.API_INNOVATIONS_URL)
    .addPath('v1/:innovationId/files/upload-url')
    .setPathParams({ innovationId })
    .buildUrl();
  const result = await axios.post<{ id: string; name: string; url: string }>(url, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-functions-key': UPLOAD_URL_FUNCTION_KEY
    },
    timeout: REQUEST_TIMEOUT_MS
  });
  return result.data;
}

async function uploadFile(url: string, file: Express.Multer.File): Promise<void> {
  await axios.put(url, file.buffer, {
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-version': '2023-11-03',
      'x-ms-tags': 'ScanStatus=Pending',
      'If-None-Match': '*',
      'Content-Type': file.mimetype,
      'Content-Length': file.size
    },
    maxBodyLength: MAX_FILE_SIZE,
    maxContentLength: MAX_FILE_SIZE,
    timeout: REQUEST_TIMEOUT_MS
  });
}

fileUploadRouter.post(`${ENVIRONMENT.BASE_PATH}/upload-file`, (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  upload.single('file')(req, res, error => {
    if (error) {
      res
        .status(error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE' ? 413 : 400)
        .send({ error: 'INVALID_FILE_UPLOAD' });
      return;
    }

    void (async () => {
      let stage = 'authorization';
      try {
        const accessToken = await getAccessTokenBySessionId(req.session.id);
        if (!accessToken) {
          res.status(401).send();
          return;
        }
        const file = req.file;
        if (!file || file.size === 0 || typeof req.body.innovationId !== 'string') {
          res.status(400).send({ error: 'INVALID_FILE_UPLOAD' });
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          res.status(413).send({ error: 'INVALID_FILE_UPLOAD' });
          return;
        }
        if (!UPLOAD_URL_FUNCTION_KEY) {
          logUploadFailure('missing_function_key');
          res.status(503).send({ error: 'FILE_UPLOAD_UNAVAILABLE' });
          return;
        }

        stage = 'upload_authorization';
        const fileInfo = await getUploadUrl(accessToken, req.body.innovationId, { filename: file.originalname });
        stage = 'blob_upload';
        await uploadFile(fileInfo.url, file);

        // Never send the upload SAS to the browser. Initial tags were included
        // atomically in the successful PUT; status is checked after registration.
        res.status(201).send({
          id: fileInfo.id,
          name: fileInfo.name,
          size: file.size,
          extension: extname(file.originalname).toLowerCase().substring(1),
          scanState: 'scanning',
          canDownload: false
        });
      } catch (error) {
        logUploadFailure(stage, error);
        const upstreamStatus = axios.isAxiosError(error) ? error.response?.status : undefined;
        const status =
          stage === 'upload_authorization' && upstreamStatus && [400, 401, 403, 404].includes(upstreamStatus)
            ? upstreamStatus
            : 503;
        res.status(status).send({ error: 'FILE_UPLOAD_UNAVAILABLE' });
      }
    })();
  });
});

export default fileUploadRouter;
