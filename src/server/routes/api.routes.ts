import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import * as express from 'express';
import { IProfile } from 'passport-azure-ad';

import { ENVIRONMENT } from '../config/constants.config';

import { getAccessTokenByOid } from './authentication.routes';


const apiRouter = express.Router();
let axiosInstance: AxiosInstance;


function getRequestHandler(): AxiosInstance {
  if (!axiosInstance) {
    axiosInstance = axios.create({ timeout: 60000, httpsAgent: new https.Agent({ keepAlive: true }) });
  }
  return axiosInstance;
}

function parseAPIUrl(url: string): string {

  const urlEndingSegments = url.substring(url.indexOf('api')); // Includes api/...
  let apiUrl = ENVIRONMENT.API_URL;

  if (ENVIRONMENT.LOCAL_MODE) {
    switch (true) {
      case url.includes('api/users'):
        apiUrl = ENVIRONMENT.LOCAL_API_USERS_BASE_URL;
        break;
      case url.includes('api/innovations'):
        apiUrl = ENVIRONMENT.LOCAL_API_INNOVATIONS_BASE_URL;
        break;
      case url.includes('api/configuration'):
        apiUrl = ENVIRONMENT.LOCAL_API_ADMIN_BASE_URL;
        break;
      default:
        apiUrl = ENVIRONMENT.API_URL;
        break;
    }
  }

  return new URL(urlEndingSegments, apiUrl).href;

}

// Authenticated API proxy endpoints.
apiRouter.all(`${ENVIRONMENT.BASE_PATH}/api/*`, (req, res) => {

  const requestHandler = getRequestHandler();
  const user: IProfile = req.user || {};
  const accessToken = getAccessTokenByOid(user.oid || '');

  if (req.isAuthenticated() && accessToken) {

    const url = parseAPIUrl(req.url);
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    const success = (response: any) => {
      // console.info('RESPONSE', response.data);
      res.status(response.status).send(response.data);
    };

    const fail = (error: any) => {

      console.error(`Error calling api url: ${url}. Error: ${error}`);

      if (error.response && error.response.status) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send();
      }

    };

    switch (req.method.toUpperCase()) {
      case 'GET':
        requestHandler.get(url, config).then(success).catch(fail);
        break;
      case 'POST':
        requestHandler.post(url, req.body, config).then(success).catch(fail);
        break;
      case 'PATCH':
        requestHandler.patch(url, req.body, config).then(success).catch(fail);
        break;
      case 'PUT':
        requestHandler.put(url, req.body, config).then(success).catch(fail);
        break;
      case 'HEAD':
        requestHandler.head(url, config).then(success).catch(fail);
        break;
      case 'DELETE':
        requestHandler.delete(url, config).then(success).catch(fail);
        break;
      default:
        res.status(405).send();
    }

  }
  else {
    res.status(401).send();
  }

});

// Unauthenticated endpoint: Survey endpoint.
apiRouter.post(`${ENVIRONMENT.BASE_PATH}/survey`, (req, res) => {
  const requestHandler: AxiosInstance = getRequestHandler();
  const body = req.body;

  requestHandler.post(`${ENVIRONMENT.API_URL}/api/survey`, body)
    .then((response: any) => {
      res.cookie('surveyId', response.data.id);
      res.send(response.data);
    })
    .catch((error: any) => {
      console.error(`Error when attempting to submit survey with url: ${ENVIRONMENT.API_URL}/api/survey. Error: ${error}`);
      res.status(500).send();
    });
});

// Unauthenticated endpoint: Innovation transfer check endpoint.
apiRouter.get(`${ENVIRONMENT.BASE_PATH}/innovators/innovation-transfers/:id/check`, (req, res) => {
  const requestHandler: AxiosInstance = getRequestHandler();

  requestHandler.get(`${ENVIRONMENT.API_URL}/api/innovators/innovation-transfers/${req.params.id}/check`)
    .then((response) => {
      res.status(response.status).send(response.data);
    })
    .catch((error: any) => {
      console.error(`Error: ${ENVIRONMENT.API_URL}/api/innovators/innovation-transfers/:id/check : ${error}`);
      res.status(500).send();
    });

});


export default apiRouter;
