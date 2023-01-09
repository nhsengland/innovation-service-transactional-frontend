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

  const match = url.match(/\/api(?:\/(innovations|users|admins))?(?:(\/.*))?$/);
  let apiUrl: string;

  if (match === null) {
    return url;
  }

  const [functionApp, urlEndingSegments] = [match[1], match[2]];

  switch (functionApp) {
    case 'admins':
      apiUrl = ENVIRONMENT.API_ADMINS_URL;
      break;
    case 'innovations':
      apiUrl = ENVIRONMENT.API_INNOVATIONS_URL;
      break;
    case 'users':
      apiUrl = ENVIRONMENT.API_USERS_URL;
      break;
    default:
      // This is probably disappear in the future (legacy)
      apiUrl = ENVIRONMENT.API_URL + '/api';
  }

  // console.log('Calling API: ', new URL(apiUrl + urlEndingSegments).href);

  return new URL(apiUrl + urlEndingSegments).href;
}

// Authenticated API proxy endpoints.
apiRouter.all(`${ENVIRONMENT.BASE_PATH}/api/*`, (req, res) => {

  const requestHandler = getRequestHandler();
  const user: IProfile = req.user || {};
  const accessToken = getAccessTokenByOid(user.oid || '');

  if (req.isAuthenticated() && accessToken) {

    const url = parseAPIUrl(req.url);
    const config = { headers: { Authorization: `Bearer ${accessToken}`, 'x-is-domain-context': req.headers['x-is-domain-context'] } };

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

  requestHandler.post<{ id: string }>(`${ENVIRONMENT.API_USERS_URL}/v1/survey`, body)
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

  requestHandler.get<{ userExists: boolean }>(`${ENVIRONMENT.API_INNOVATIONS_URL}/v1/transfers/${req.params.id}/check`)
    .then(response => { res.status(response.status).send(response.data); })
    .catch((error: any) => {
      console.error(`Error: ${ENVIRONMENT.API_INNOVATIONS_URL}/v1/transfers/:id/check`, error);
      res.status(500).send();
    });

});

export default apiRouter;
