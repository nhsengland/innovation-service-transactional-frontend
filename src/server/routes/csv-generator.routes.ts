import * as express from 'express';
import { getAppInsightsClient } from '../../globals';
import { ENVIRONMENT } from '../config/constants.config';
import { CSVGeneratorSectionsNotFoundError, PDFGeneratorSectionsNotFoundError } from '../utils/errors';
import { generatePDF } from '../utils/pdf/parser';
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
        ...req.query.role && { 'x-is-role': req.query.role }
      }
    };
    const version = req.query.version && typeof req.query.version === 'string' ? req.query.version : undefined;

    generatePDF(req.params.innovationId, config, version)
      .then((response: any) => {

        const client = getAppInsightsClient();

        client.trackTrace({
          message: 'CSVGenerator Success',
          severity: 0,
          properties: {
            params: req.params,
            query: req.query,
            path: req.path,
            route: req.route,
            authenticatedUser: (req.session as any).oid,
          }
        });

        res
          .writeHead(200, {
            'Content-Length': Buffer.byteLength(response),
            'Content-Type': 'text/csv',
            'Content-disposition': `attachment;filename=innovation_record_${innovationId}.csv`
          })
          .end(response);

      })
      .catch((error: any) => {
        const client = getAppInsightsClient();
        client.trackException({
          exception: error,
          severity: 3,
          properties: {
            params: req.params,
            query: req.query,
            path: req.path,
            route: req.route,
            authenticatedUser: (req.session as any).oid,
            stack: error.stack,
          }
        })
        // console.log(error);
        // console.log(`Error when attempting to generate the PDF from innovation ${innovationId}`);
        const status = error instanceof CSVGeneratorSectionsNotFoundError ? 404 : 500;
        res.status(status).send();
      });

  } catch (error: any) {

    const client = getAppInsightsClient();
    client.trackException({
      exception: error,
      severity: 3,
      properties: {
        params: req.params,
        query: req.query,
        path: req.path,
        route: req.route,
        authenticatedUser: (req.session as any).oid,
        stack: error.stack,
      }
    });

  }

});

export default csvRouter;
