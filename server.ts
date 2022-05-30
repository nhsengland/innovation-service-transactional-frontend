import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';

import coockieParser from 'cookie-parser';
import csurf from 'csurf';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import fs from 'fs';
import helmet from 'helmet';
import { join } from 'path';

import { initAppInsights } from 'src/globals';
import { ENVIRONMENT } from 'src/server/config/constants.config';
import { handler } from 'src/server/handlers/logger.handler';
import { appLoggingMiddleware } from 'src/server/middlewares/app-logging.middleware';
import { exceptionLoggingMiddleware } from 'src/server/middlewares/exception-logging.middleware';

import apiRouter from 'src/server/routes/api.routes';
import authenticationRouter from 'src/server/routes/authentication.routes';
import fileUploadRouter from 'src/server/routes/file-upload.routes';
import pdfRouter from 'src/server/routes/pdf-generator.routes';

import { AppServerModule } from './src/main.server';

import 'zone.js/dist/zone-node';

dotenv.config();

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {

  initAppInsights();

  const server = express();
  const staticContentPath = `${ENVIRONMENT.BASE_PATH}${ENVIRONMENT.STATIC_CONTENT_PATH}`;
  const distFolder = join(process.cwd(), ENVIRONMENT.VIEWS_PATH);
  const indexHtml = fs.existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  server.engine('html', ngExpressEngine({ bootstrap: AppServerModule })); // Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(coockieParser());
  server.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true
    }
  }));

  // Helmet configuration.
  server.use(
    helmet.hidePoweredBy(),
    helmet.hsts({
      includeSubDomains: true,
      preload: true,
    }),
    // helmet.noSniff(),
    helmet.ieNoOpen(),
    helmet.frameguard({
      action: 'deny',
    }),
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.use(staticContentPath, express.static(distFolder));

  // Routes
  server.use(authenticationRouter);
  server.use(pdfRouter);
  server.use(fileUploadRouter);
  server.use(apiRouter);

  // Middleware
  server.use(appLoggingMiddleware);
  server.use(exceptionLoggingMiddleware);

  // PING Endpoint
  server.get(`${ENVIRONMENT.BASE_PATH}/ping`, (req, res) => {
    const response = {
      state: 'Running'
    };

    res.status(200).send(response);
  });

  // Angular routing.
  // // Serve static files.
  server.get('*.*', express.static(distFolder, { maxAge: '1y' }));

  // // "Data requests". For submited POST form informations.
  server.post(`${ENVIRONMENT.BASE_PATH}/insights`, handler);
  server.post('/*', (req, res) => {
    res.render(indexHtml, {
      req, res,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        {
          provide: 'APP_SERVER_ENVIRONMENT_VARIABLES',
          useValue: {
            BASE_URL: ENVIRONMENT.BASE_URL,
            BASE_PATH: ENVIRONMENT.BASE_PATH,
            LOG_LEVEL: ENVIRONMENT.LOG_LEVEL,
            ENABLE_ANALYTICS: ENVIRONMENT.ENABLE_ANALYTICS
          }
        }
      ]
    });
  });

  // Serve environment variables file.
  server.get('*/environment.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    res.send(`(function (window) {
      window.__env = window.__env || {};
      window.__env.BASE_URL = '${ENVIRONMENT.BASE_URL}';
      window.__env.BASE_PATH = '${ENVIRONMENT.BASE_PATH}';
      window.__env.LOG_LEVEL = '${ENVIRONMENT.LOG_LEVEL}';
      window.__env.ENABLE_ANALYTICS = '${ENVIRONMENT.ENABLE_ANALYTICS}';
    }(this));`);
  });

  // // All regular routes using the Universal engine.
  server.get('*',
    csurf({ cookie: true }),
    (req, res) => {
      res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false });
      res.render(indexHtml, {
        req, res,
        providers: [
          { provide: APP_BASE_HREF, useValue: req.baseUrl },
          {
            provide: 'APP_SERVER_ENVIRONMENT_VARIABLES',
            useValue: {
              BASE_URL: ENVIRONMENT.BASE_URL,
              BASE_PATH: ENVIRONMENT.BASE_PATH,
              LOG_LEVEL: ENVIRONMENT.LOG_LEVEL,
              ENABLE_ANALYTICS: ENVIRONMENT.ENABLE_ANALYTICS
            }
          }
        ]
      });
    });

  return server;
}

function run(): void {

  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => { console.log(`Node Express server listening on http://localhost:${port}`); });
}
/* tslint:enable:no-string-literal */
// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
