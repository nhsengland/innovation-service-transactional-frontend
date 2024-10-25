import { InnovationCollaboratorStatusEnum } from '@modules/stores/innovation/innovation.enums';
import axios, { AxiosInstance } from 'axios';
import * as express from 'express';
import * as https from 'https';

import { ENVIRONMENT } from '../config/constants.config';

import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';
import { getAppInsightsClient } from 'src/globals';
import { getAccessTokenBySessionId } from './authentication.routes';

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
apiRouter.all(`${ENVIRONMENT.BASE_PATH}/api/*`, async (req, res) => {
  const requestHandler = getRequestHandler();
  const oid = req.session.id;
  const accessToken = await getAccessTokenBySessionId(oid);

  if (oid && accessToken) {
    const url = parseAPIUrl(req.url);
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(req.headers['x-is-role'] && { 'x-is-role': req.headers['x-is-role'] }),
        ...(req.headers['request-id'] && { 'request-id': req.headers['request-id'] })
        //...(req.headers['traceparent'] && { traceparent: req.headers['traceparent'] })
      }
    };

    const success = (response: any) => {
      // console.info('API CALL: ', req.url, response.data);
      res.status(response.status).send(response.data);
    };

    const fail = (error: any) => {
      getAppInsightsClient().trackTrace({
        message: `Error calling API URL: ${url}`,
        severity: SeverityLevel.Warning,
        properties: {
          params: req.params,
          query: req.query,
          path: req.path,
          route: req.route,
          authenticatedUser: (req.session as any).oid,
          apiStatusCode: error.response && error.response.status,
          apiData: error.response && error.response.data
        }
      });

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
  } else {
    res.status(401).send();
  }
});

// Unauthenticated endpoint: Innovation transfer check endpoint.
apiRouter.get(`${ENVIRONMENT.BASE_PATH}/innovators/innovation-transfers/:id/check`, (req, res) => {
  const requestHandler = getRequestHandler();

  requestHandler
    .get<{ userExists: boolean }>(`${ENVIRONMENT.API_INNOVATIONS_URL}/v1/transfers/${req.params.id}/check`)
    .then(response => {
      res.status(response.status).send(response.data);
    })
    .catch((error: any) => {
      getAppInsightsClient().trackException({
        exception: error,
        severity: SeverityLevel.Warning,
        properties: {
          params: req.params,
          query: req.query,
          path: req.path,
          route: req.route,
          authenticatedUser: (req.session as any).oid
        }
      });
      res.status(500).send();
    });
});

apiRouter.get(`${ENVIRONMENT.BASE_PATH}/innovators/innovation-collaborations/:id/check`, (req, res) => {
  const requestHandler = getRequestHandler();

  requestHandler
    .get<{ userExists: boolean; collaboratorStatus: InnovationCollaboratorStatusEnum }>(
      `${ENVIRONMENT.API_INNOVATIONS_URL}/v1/collaborators/${req.params.id}/check`
    )
    .then(response => {
      res.status(response.status).send(response.data);
    })
    .catch((error: any) => {
      getAppInsightsClient().trackException({
        exception: error,
        severity: SeverityLevel.Warning,
        properties: {
          params: req.params,
          query: req.query,
          path: req.path,
          route: req.route,
          authenticatedUser: (req.session as any).oid
        }
      });
      res.status(error.response.status).send();
    });
});

export default apiRouter;
