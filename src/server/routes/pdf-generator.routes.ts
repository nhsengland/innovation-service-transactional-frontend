import * as express from 'express';
import { IProfile } from 'passport-azure-ad';
import { ENVIRONMENT } from '../config/constants.config';
import { generatePDF } from '../utils/pdf/parser';
import { getAccessTokenByOid } from './authentication.routes';
import { getAppInsightsClient } from '../../globals';

const pdfRouter = express.Router();

// Generate PDF endpoint
pdfRouter.get(`${ENVIRONMENT.BASE_PATH}/exports/:innovationId/pdf`, (req, res) => {

  try {

    const innovationId = req.params.innovationId;
    const user: IProfile = req.user || {};
    const oid: string = user.oid || '';
    const accessToken = getAccessTokenByOid(oid);
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    generatePDF(req.params.innovationId, config)
      .then((response: any) => {

        const client = getAppInsightsClient(req);

        client.trackTrace({
          message: 'PDFGenerator Success',
          severity: 0,
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
        const client = getAppInsightsClient(req);
        client.trackTrace({
          message: 'PDFGenerator Error',
          severity: 3,
          properties: error,
        });
        console.log(error);
        console.log(`Error when attempting to generate the PDF from innovation ${innovationId}`);
        res.status(500).send();
      });

  } catch (error) {

    const client = getAppInsightsClient(req);
    client.trackTrace({
      message: 'PDFGenerator Unhandled Error',
      severity: 3,
      properties: error as any
    });

  }

});

export default pdfRouter;
