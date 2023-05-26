import axios, { Method } from 'axios';
import * as express from 'express';
import { Router } from 'express';
import * as multer from 'multer';
import * as path from 'path';

import { UrlModel } from '@app/base/models';
import { ENVIRONMENT } from '../config/constants.config';
import { getAccessTokenBySessionId } from './authentication.routes';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});

// Allowed ext
const filetypes = /docx|pdf|csv|xlsx/;

// Allowed mimetypes
const whitelist = [
  'application/pdf',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const checkFileType = (file: any, cb: ((...args: any[]) => void)) => {
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // Check mime
  const mimetype = whitelist.includes(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Invalid Format!');
  }
};

const fileUploadRouter: Router = express.Router();

async function getUploadUrl(url: string, body: any, accessToken: string): Promise<any> {
  let res;
  try {
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    res = await axios.post(url, body, config);
  } catch (error) {
    console.error(error);
    throw error;
  }

  return res.data;
}

async function uploadFile(url: string, file: any): Promise<void> {
  try {
    const config = {
      method: 'PUT' as Method,
      params: {
        fileName: file.originalname
      },
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

fileUploadRouter.post(`${ENVIRONMENT.BASE_PATH}/upload`, upload.single('file'), async (req, res) => {
  const accessToken = getAccessTokenBySessionId(req.session.id);
  const file = req.file;
  const reqBody = req.body;

  const url = new UrlModel(ENVIRONMENT.API_INNOVATIONS_URL).addPath('v1/:innovationId/upload').setPathParams({ innovationId: reqBody.innovationId }).buildUrl();

  if (!accessToken) {
    res.status(401).send();
    return;
  }

  if (!file) {
    res.status(400).send();
    return;
  }

  try {

    const body = {
      context: reqBody.context,
      fileName: file.originalname
    };

    const fileInfo = await getUploadUrl(url, body, accessToken);
    await uploadFile(fileInfo.url, file);
    res.status(201).send(fileInfo);

  } catch (error) {
    console.error(`Error when attempting to upload data. Error: ${error}`);
    res.status(500).send();
  }

});

export default fileUploadRouter;
