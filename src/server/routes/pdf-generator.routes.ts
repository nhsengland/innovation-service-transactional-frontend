import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';
import * as express from 'express';
import { getAppInsightsClient } from '../../globals';
import { ENVIRONMENT } from '../config/constants.config';
import { PDFGeneratorSectionsNotFoundError } from '../utils/errors';
import { generatePDF } from '../utils/pdf/parser';
import { getAccessTokenBySessionId } from './authentication.routes';

const pdfRouter = express.Router();

// Generate PDF endpoint
pdfRouter.get(`${ENVIRONMENT.BASE_PATH}/exports/:innovationId/pdf`, async (req, res) => {
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

    generatePDF(req.params.innovationId, config, version)
      .then((response: any) => {
        const client = getAppInsightsClient();

        client.trackTrace({
          message: 'PDFGenerator Success',
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
            'Content-Type': 'application/pdf',
            'Content-disposition': `attachment;filename=innovation_record_${innovationId}.pdf`
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
        // console.log(error);
        // console.log(`Error when attempting to generate the PDF from innovation ${innovationId}`);
        const status = error instanceof PDFGeneratorSectionsNotFoundError ? 404 : 500;
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

export default pdfRouter;
