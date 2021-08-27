import axios, { Method } from 'axios';
import * as express from 'express';
import { Router } from 'express';
import * as multer from 'multer';
import { IProfile } from 'passport-azure-ad';
import * as path from 'path';
import { API_URL, BASE_PATH } from '../config/constants.config';
import { getAccessTokenByOid } from './authentication.routes';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});

const checkFileType = (file: any, cb: ((...args: any[]) => void)) => {
  // Allowed ext
  const filetypes = /|docx|pdf|csv|xlsx|/;

  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // Check mime
  const mimetype = filetypes.test(file.mimetype);

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
      data: file.buffer
    };

    await axios(url, config);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

fileUploadRouter.post(`${BASE_PATH}/upload`, upload.single('file'), async (req, res) => {

  const user: IProfile = req.user || {};
  const oid: string = user.oid || '';
  const accessToken = getAccessTokenByOid(oid);
  const file = req.file;
  const reqBody = req.body;
  const url = `${API_URL}/api/innovators/${reqBody.innovatorId}/innovations/${reqBody.innovationId}/upload`;

  if (!req.isAuthenticated() || !accessToken) {
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
