import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';
import * as express from 'express';
import { getAppInsightsClient } from '../../globals';
import { ENVIRONMENT } from '../config/constants.config';
import { generateCSV } from '../utils/csv/parser';
import { CSVGeneratorSectionsNotFoundError } from '../utils/errors';
import { getAccessTokenBySessionId } from './authentication.routes';

const csvRouter = express.Router();

// Generate PDF endpoint
csvRouter.get(`${ENVIRONMENT.BASE_PATH}/exports/:innovationId/csv`, async (req, res) => {
  try {
    const innovationId = req.params.innovationId;
    const accessToken = await getAccessTokenBySessionId(req.session.id);
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(req.query.role && { 'x-is-role': req.query.role })
      }
    };

    const version = req.query.version && typeof req.query.version === 'string' ? req.query.version : undefined;
    const uniqueId = 'uniqueId' in req.query && req.query.uniqueId;

    generateCSV(req.params.innovationId, config, version)
      .then((response: any) => {
        const client = getAppInsightsClient();

        client.trackTrace({
          message: 'CSVGenerator Success',
          severity: SeverityLevel.Information,
          properties: {
            params: req.params,
            query: req.query,
            path: req.path,
            route: req.route,
            authenticatedUser: (req.session as any).oid
          }
        });

        res
          .writeHead(200, {
            'Content-Length': Buffer.byteLength(response),
            'Content-Type': 'text/csv',
            'Content-disposition': `attachment;filename=innovation_record_${uniqueId ?? innovationId}.csv`
          })
          .end(response);
      })
      .catch((error: any) => {
        const client = getAppInsightsClient();
        client.trackException({
          exception: error,
          severity: SeverityLevel.Error,
          properties: {
            params: req.params,
            query: req.query,
            path: req.path,
            route: req.route,
            authenticatedUser: (req.session as any).oid,
            stack: error.stack
          }
        });

        const status = error instanceof CSVGeneratorSectionsNotFoundError ? 404 : 500;
        res.status(status).send();
      });
  } catch (error: any) {
    const client = getAppInsightsClient();
    client.trackException({
      exception: error,
      severity: SeverityLevel.Error,
      properties: {
        params: req.params,
        query: req.query,
        path: req.path,
        route: req.route,
        authenticatedUser: (req.session as any).oid,
        stack: error.stack
      }
    });
  }
});

export default csvRouter;
