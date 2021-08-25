import express, { Router } from 'express';
import { IProfile } from 'passport-azure-ad';
import { BASE_PATH } from '../config/constants.config';
import { generatePDF } from '../utils/pdf/parser';
import { getAccessTokenByOid } from './authentication.routes';

const pdfRouter: Router = express.Router();

// Generate PDF endpoint
pdfRouter.get(`${BASE_PATH}/exports/:innovationId/pdf`, (req, res) => {
    const innovationId = req.params.innovationId;
    const user: IProfile = req.user || {};
    const oid: string = user.oid || '';
    const accessToken = getAccessTokenByOid(oid);
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    generatePDF(req.params.innovationId, oid, config)
      .then((response: any) => {
        res
          .writeHead(200, {
            'Content-Length': Buffer.byteLength(response),
            'Content-Type': 'application/pdf',
            'Content-disposition': `attachment;filename=innovation_record_${innovationId}.pdf`
          })
          .end(response);
      })
      .catch((error: any) => {
        console.log(error);
        console.log(`Error when attempting to generate the PDF from innovation ${innovationId}`);
        res.status(500).send();
      });

  });

export default pdfRouter;
