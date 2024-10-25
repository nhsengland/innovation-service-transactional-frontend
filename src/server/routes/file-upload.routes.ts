import axios, { Method } from 'axios';
import * as express from 'express';
import { Router } from 'express';
import * as multer from 'multer';
import { extname } from 'path';

import { UrlModel } from '@app/base/models';
import { KnownSeverityLevel } from 'applicationinsights';
import { getAppInsightsClient } from 'src/globals';
import { ENVIRONMENT } from '../config/constants.config';
import { getAccessTokenBySessionId } from './authentication.routes';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});
const fileUploadRouter: Router = express.Router();

const filetypes = /docx|pdf|csv|xlsx/; // Allowed extensions.

// Allowed mimetypes.
const whitelist = [
  'application/pdf',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const checkFileType = (file: any, cb: (...args: any[]) => void) => {
  const allowedExtension = filetypes.test(extname(file.originalname).toLowerCase());
  const mimetype = whitelist.includes(file.mimetype);

  if (mimetype && allowedExtension) {
    return cb(null, true);
  } else {
    cb('Error: Invalid Format!');
  }
};

async function getUploadUrl(
  accessToken: string,
  innovationId: string,
  body: { filename: string }
): Promise<{ id: string; name: string; url: string }> {
  const url = new UrlModel(ENVIRONMENT.API_INNOVATIONS_URL)
    .addPath('v1/:innovationId/files/upload-url')
    .setPathParams({ innovationId })
    .buildUrl();

  try {
    const result = await axios.post<{ id: string; name: string; url: string }>(url, body, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function uploadFile(url: string, file: any): Promise<void> {
  try {
    const config = {
      method: 'PUT' as Method,
      params: { fileName: file.originalname },
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'content-length': file.size
      },
      maxBodyLength: 20000000,
      maxContentLength: 20000000,
      data: file.buffer
    };
    await axios(url, config);
  } catch (error) {
    console.error('uploadFile', error);
    throw error;
  }
}

fileUploadRouter.post(`${ENVIRONMENT.BASE_PATH}/upload-file`, upload.single('file'), (req, res) => {
  (async () => {
    const accessToken = await getAccessTokenBySessionId(req.session.id);
    const requestFile = req.file;

    if (!accessToken) {
      res.status(401).send();
      return;
    }

    if (!requestFile) {
      res.status(400).send();
      return;
    }

    try {
      const fileInfo = await getUploadUrl(accessToken, req.body.innovationId, { filename: requestFile.originalname });
      await uploadFile(fileInfo.url, requestFile);

      res.status(201).send({
        id: fileInfo.id,
        name: fileInfo.name,
        size: req.file?.size,
        extension: req.file ? extname(req.file?.originalname).toLowerCase().substring(1) : '',
        url: fileInfo.url
      });
    } catch (error: any) {
      getAppInsightsClient().trackException({
        exception: error,
        severity: KnownSeverityLevel.Warning,
        properties: {
          params: req.params,
          query: req.query,
          path: req.path,
          route: req.route,
          authenticatedUser: (req.session as any).oid
        }
      });

      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send();
      }
    }
  })();
});

export default fileUploadRouter;
