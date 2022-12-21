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

  let urlEndingSegments = url.substring(url.indexOf('api')); // Includes api/...
  let apiUrl = ENVIRONMENT.API_URL;

  if (ENVIRONMENT.LOCAL_MODE) {
    if (ENVIRONMENT.LOCAL_API_ADMIN_ACTIVE && url.includes('api/admins')) {
      apiUrl = ENVIRONMENT.LOCAL_API_ADMIN_BASE_URL;
      urlEndingSegments = urlEndingSegments.replace('/admins', '');
    } else if (ENVIRONMENT.LOCAL_API_INNOVATIONS_ACTIVE && url.includes('api/innovations')) {
      apiUrl = ENVIRONMENT.LOCAL_API_INNOVATIONS_BASE_URL;
      urlEndingSegments = urlEndingSegments.replace('/innovations', '');
    } else if (ENVIRONMENT.LOCAL_API_USERS_ACTIVE && url.includes('api/users')) {
      apiUrl = ENVIRONMENT.LOCAL_API_USERS_BASE_URL;
      urlEndingSegments = urlEndingSegments.replace('/users', '');
    }
  }

  // console.log('Calling API: ', new URL(urlEndingSegments, apiUrl).href);

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
      // console.info('API CALL: ', req.url, response.data);
      res.status(response.status).send(response.data);
    };

    const fail = (error: any) => {

      console.error(`Error calling API URL: ${url}`);
      console.error(`StatusCode: ${error.response.status}`, `Data: ${JSON.stringify(error.response.data)}`);

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

  const requestHandler = getRequestHandler();
  const body = req.body;

  requestHandler.post<{ id: string }>(`${ENVIRONMENT.API_URL}/api/users/v1/survey`, body)
    // requestHandler.post<{ id: string }>(`${ENVIRONMENT.LOCAL_API_USERS_BASE_URL}/api/v1/survey`, body)
    .then(response => {
      res.cookie('surveyId', response.data.id);
      res.send(response.data);
    })
    .catch((error: any) => {
      console.error(`Error when attempting to submit survey with url: ${ENVIRONMENT.API_URL}/api/survey. ${error}`);
      res.status(500).send();
    });
});

// Unauthenticated endpoint: Innovation transfer check endpoint.
apiRouter.get(`${ENVIRONMENT.BASE_PATH}/innovators/innovation-transfers/:id/check`, (req, res) => {

  const requestHandler = getRequestHandler();

  requestHandler.get<{ userExists: boolean }>(`${ENVIRONMENT.API_URL}/api/innovations/v1/transfers/${req.params.id}/check`)
    // requestHandler.get<{ userExists: boolean }>(`${ENVIRONMENT.LOCAL_API_INNOVATIONS_BASE_URL}/api/v1/transfers/${req.params.id}/check`)
    .then(response => { res.status(response.status).send(response.data); })
    .catch((error: any) => {
      console.error(`Error: ${ENVIRONMENT.API_URL}/api/innovations/v1/transfers/:id/check`, error);
      res.status(500).send();
    });

});

export default apiRouter;
