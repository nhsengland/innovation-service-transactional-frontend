import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';

import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as session from 'express-session';
import * as fs from 'fs';
import * as helmet from 'helmet';
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

import csvRouter from 'src/server/routes/csv-generator.routes';
import { AppServerModule } from './src/main.server';

import { REQUEST, RESPONSE } from './src/express.tokens';

dotenv.config();

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  initAppInsights();

  const server = express();
  const staticContentPath = `${ENVIRONMENT.BASE_PATH}${ENVIRONMENT.STATIC_CONTENT_PATH}`;
  const distFolder = join(process.cwd(), ENVIRONMENT.VIEWS_PATH);
  const indexHtml = fs.existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const commonEngine = new CommonEngine();
  server.set('trust proxy', 1); // trust first proxy

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser());
  server.use(
    session({
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: 'auto',
        sameSite: 'strict'
      }
    })
  );

  // Helmet configuration.
  server.use(
    helmet.hidePoweredBy(),
    helmet.hsts({ includeSubDomains: true, preload: true }),
    // helmet.noSniff(),
    helmet.ieNoOpen(),
    helmet.frameguard({ action: 'deny' })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.use(staticContentPath, express.static(distFolder));

  // CSRF protection.
  server.use((req, res, next) => {
    if (!(req.method === 'OPTIONS' || req.method === 'GET' || req.method === 'HEAD')) {
      if (!req.cookies['XSRF-TOKEN'] && req.cookies['XSRF-TOKEN'] !== (req.session as any).xsrfToken) {
        res.send(403);
      }
    }
    next();
  });

  // Routes
  server.use(authenticationRouter);
  server.use(pdfRouter);
  server.use(csvRouter);
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
  server.post('/*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          {
            provide: 'APP_SERVER_ENVIRONMENT_VARIABLES',
            useValue: {
              BASE_URL: ENVIRONMENT.BASE_URL,
              BASE_PATH: ENVIRONMENT.BASE_PATH,
              LOG_LEVEL: ENVIRONMENT.LOG_LEVEL,
              ENABLE_ANALYTICS: ENVIRONMENT.ENABLE_ANALYTICS,
              TAG_MEASUREMENT_ID: ENVIRONMENT.TAG_MEASUREMENT_ID,
              GTM_ID: ENVIRONMENT.GTM_ID
            }
          },
          { provide: RESPONSE, useValue: res },
          { provide: REQUEST, useValue: req }
        ]
      })
      .then(html => res.send(html))
      .catch(err => next(err));
  });

  // Serve environment variables file.
  server.get('*/environment.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    res.send(`(function (window) {
      window.__env = window.__env || {};
      window.__env.BASE_URL = '${ENVIRONMENT.BASE_URL}';
      window.__env.BASE_PATH = '${ENVIRONMENT.BASE_PATH}';
      window.__env.LOG_LEVEL = '${ENVIRONMENT.LOG_LEVEL}';
      window.__env.ENABLE_ANALYTICS = ${ENVIRONMENT.ENABLE_ANALYTICS};
      window.__env.TAG_MEASUREMENT_ID = '${ENVIRONMENT.TAG_MEASUREMENT_ID}';
      window.__env.GTM_ID = '${ENVIRONMENT.GTM_ID}';
    }(this));`);
  });

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          {
            provide: 'APP_SERVER_ENVIRONMENT_VARIABLES',
            useValue: {
              BASE_URL: ENVIRONMENT.BASE_URL,
              BASE_PATH: ENVIRONMENT.BASE_PATH,
              LOG_LEVEL: ENVIRONMENT.LOG_LEVEL,
              ENABLE_ANALYTICS: ENVIRONMENT.ENABLE_ANALYTICS
            }
          },
          { provide: RESPONSE, useValue: res },
          { provide: REQUEST, useValue: req }
        ]
      })
      .then(html => res.send(html))
      .catch(err => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
