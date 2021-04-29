import 'zone.js/dist/zone-node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';

import * as dotenv from 'dotenv';
import * as express from 'express';
import * as coockieParser from 'cookie-parser';
import * as passport from 'passport';
import * as session from 'express-session';
import axios from 'axios';
import { join } from 'path';
import { IOIDCStrategyOptionWithoutRequest, IProfile, OIDCStrategy, VerifyCallback } from 'passport-azure-ad';
import { existsSync } from 'fs';
// import { Deserializer } from 'jsonapi-serializer';

import { AppServerModule } from './src/main.server';

dotenv.config();

// Types definitions.
type UserSession = { oid: string, accessToken: string };

// Initial variables.
const BASE_URL = process.env.BASE_URL || '';
const BASE_PATH = ['', '/'].includes(process.env.BASE_PATH || '') ? '' : `${process.env.BASE_PATH?.startsWith('/') ? '' : '/'}${process.env.BASE_PATH}`;
const API_URL = process.env.API_URL || '';
const LOG_LEVEL = process.env.LOG_LEVEL || 'ERROR';
const VIEWS_PATH = process.env.VIEWS_PATH || '';
const STATIC_CONTENT_PATH = process.env.STATIC_CONTENT_PATH || '';
const OAUTH_CONFIGURATION: {
  tenantName: string;
  clientID: string;
  clientSecret: string;
  signinRedirectUrl: string;
  signupRedirectUrl: string;
  signoutRedirectUrl: string;
  signinPolicy: string;
  signupPolicy: string;
  allowHttpForRedirectUrl: boolean;
  scope: string[];
  responseType: 'code' | 'code id_token' | 'id_token code' | 'id_token',
  responseMode: 'query' | 'form_post';
  passReqToCallback: false;
} = {
  tenantName: process.env.OAUTH_TENANT_NAME || '',
  clientID: process.env.OAUTH_CLIENT_ID || '',
  clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
  signinRedirectUrl: process.env.OAUTH_REDIRECT_URL_SIGNIN || '',
  signupRedirectUrl: process.env.OAUTH_REDIRECT_URL_SIGNUP || '',
  signoutRedirectUrl: process.env.OAUTH_REDIRECT_URL_SIGNOUT || '',
  signinPolicy: process.env.OAUTH_SIGNIN_POLICY || '',
  signupPolicy: process.env.OAUTH_SIGNUP_POLICY || '',
  allowHttpForRedirectUrl: !!process.env.OAUTH_ALLOW_HTTP_REDIRECT,
  scope: process.env.OAUTH_SCOPE?.split(' ') || [],
  responseType: 'code id_token',
  responseMode: 'form_post',
  passReqToCallback: false
};

// TODO NHSAAC-134
const signInOptions: IOIDCStrategyOptionWithoutRequest = {
  identityMetadata: `https://${OAUTH_CONFIGURATION.tenantName}.b2clogin.com/${OAUTH_CONFIGURATION.tenantName}.onmicrosoft.com/${OAUTH_CONFIGURATION.signinPolicy}/v2.0/.well-known/openid-configuration`,
  clientID: OAUTH_CONFIGURATION.clientID,
  clientSecret: OAUTH_CONFIGURATION.clientSecret,
  responseType: OAUTH_CONFIGURATION.responseType,
  responseMode: OAUTH_CONFIGURATION.responseMode,
  redirectUrl: OAUTH_CONFIGURATION.signinRedirectUrl,
  allowHttpForRedirectUrl: OAUTH_CONFIGURATION.allowHttpForRedirectUrl,
  passReqToCallback: OAUTH_CONFIGURATION.passReqToCallback,
  scope: OAUTH_CONFIGURATION.scope
};

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {

  const server = express();
  const staticContentPath = `${BASE_PATH}${STATIC_CONTENT_PATH}`;
  const distFolder = join(process.cwd(), VIEWS_PATH);
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  const userSessions: UserSession[] = [];

  server.engine('html', ngExpressEngine({ bootstrap: AppServerModule })); // Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(coockieParser());
  server.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true
  }));

  // Passport configuration.
  server.use(passport.initialize());
  server.use(passport.session());

  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.use(staticContentPath, express.static(distFolder));

  passport.serializeUser((user, next) => { next(null, user); });
  passport.deserializeUser((obj: any, next) => { next(null, obj); });

  function findUserSessionByOid(oid: string, fn: ((...args: any[]) => void)): void {
    for (let i = 0, len = userSessions.length; i < len; i++) {
      const user = userSessions[i];
      if (user.oid === oid) { return fn(null, user); }
    }
    return fn(null, null);
  }
  function removeUserSessionByOid(oid: string): void {
    const userSessionIdx = userSessions.findIndex((u) => u.oid === oid);
    if (userSessionIdx !== -1) { userSessions.splice(userSessionIdx, 1); }
  }
  function getAccessTokenByOid(oid: string): string {
    const userSessionIdx = userSessions.findIndex((u) => u.oid === oid);
    return (userSessionIdx !== -1) ? userSessions[userSessionIdx].accessToken : '';
  }

  const signInStrategy: OIDCStrategy = new OIDCStrategy(
    signInOptions,
    (iss: string, sub: string, profile: IProfile, accessToken: string, refreshToken: string, done: VerifyCallback) => {

      const oid = profile.oid || '';

      if (!oid) { return done(new Error('No oid found'), null); }

      // console.log('TOKEN: ', accessToken);

      findUserSessionByOid(oid, (err: string, userSession: UserSession): void => {

        if (err) { return done(err); }

        if (!userSession) {
          const newUserSession: UserSession = { oid, accessToken };
          userSessions.push(newUserSession);
          return done(null, profile);
        }

        userSession.accessToken = accessToken;
        return done(null, profile);

      });
    }
  );
  signInStrategy.name = 'signInStrategy';

  passport.use(signInStrategy);


  // Authentication routes.
  server.head(`${BASE_PATH}/session`, (req, res) => {
    if (req.isAuthenticated()) {
      res.send('OK');
    } else {
      res.status(401).send();
    }
  });

  server.get(`${BASE_PATH}/auth/user`, (req, res) => {
    const user: IProfile = req.user || {};

    if (req.isAuthenticated() && user.oid) {
      const userInfo = { data: { id: user.oid, type: 'user', attributes: { displayName: user.displayName } } };
      res.send(userInfo);
    } else {
      res.status(401).send();
    }
  });


  // MS Azure OpenId Connect strategy (passport) and callbacks handling.
  server.get(`${BASE_PATH}/signup`, (req, res) => {
    const azSignupUri = `https://${OAUTH_CONFIGURATION.tenantName}.b2clogin.com/${OAUTH_CONFIGURATION.tenantName}.onmicrosoft.com/oauth2/v2.0/authorize?scope=openid&response_type=id_token&prompt=login`
      + `&p=${OAUTH_CONFIGURATION.signupPolicy}` // add policy information
      + `&client_id=${OAUTH_CONFIGURATION.clientID}` // add client id
      + `&redirect_uri=${encodeURIComponent(OAUTH_CONFIGURATION.signupRedirectUrl)}` // add redirect uri
      + `&survey_id=${req.query.surveyId || ''}`; // add survey id
    res.redirect(azSignupUri);
  });
  server.get(`${BASE_PATH}/signup/callback`, (req, res) => {
    res.redirect(`${BASE_PATH}/auth/signup/confirmation`);
  });

  // Login endpoint - AD OpenIdConnect
  server.use(`${BASE_PATH}/signin`,
    passport.authenticate('signInStrategy', { successRedirect: `${BASE_PATH}/dashboard`, failureRedirect: `${BASE_PATH}/` })
  );
  server.post(`${BASE_PATH}/signin/callback`, (req, res) => {
    res.redirect(`${BASE_PATH}/dashboard`);
  });

  server.get(`${BASE_PATH}/signout`, (req, res) => {

    const user: IProfile = req.user || {};
    const oid: string = user.oid || '';

    req.session.destroy(() => {

      const azLogoutUri = `https://${OAUTH_CONFIGURATION.tenantName}.b2clogin.com/${OAUTH_CONFIGURATION.tenantName}.onmicrosoft.com/oauth2/v2.0/logout`
        + `?p=${OAUTH_CONFIGURATION.signinPolicy}` // add policy information
        + `&post_logout_redirect_uri=${encodeURIComponent(OAUTH_CONFIGURATION.signoutRedirectUrl)}`; // add post logout redirect uri

      removeUserSessionByOid(oid);
      req.logout();
      res.redirect(azLogoutUri);

    });

  });

  // create survey endpoint
  server.post(`${BASE_PATH}/survey`, (req, res) => {
    const body = req.body;

    axios.post(`${API_URL}/api/survey`, body)
      .then((response: any) => {
        res.cookie('surveyId', response.data.id);
        res.send(response.data);
      })
      .catch((error: any) => {
        res.status(500).send();
      });
  });


  server.all(`${BASE_PATH}/api/*`, (req, res) => {
    const user: IProfile = req.user || {};
    const oid: string = user.oid || '';
    const accessToken = getAccessTokenByOid(oid);

    if (req.isAuthenticated() && accessToken) {
      const method = req.method;
      const basePath = req.url.replace(BASE_PATH, '');
      const body = req.body;
      const url = `${API_URL}${basePath}`;
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };

      const success = (response: any) => {

        // console.log('ORIG: ', url, response.data);
        // if (!response.data) {
        //   res.status(response.status).send(response.data);
        // }
        // new Deserializer({}).deserialize(response).then(data => {
        //   // response.data = data;
        //   console.log('DATA', data);
        res.status(response.status).send(response.data);
        // });

      };

      const fail = (error: any) => {
        if (error.response && error.response.status) {
          res.status(error.response.status).send(error.message);
        } else {
          res.status(500).send();
        }
      };

      switch (method.toUpperCase()) {
        case 'GET':
          axios.get(url, config).then(success).catch(fail);
          break;
        case 'POST':
          axios.post(url, body, config).then(success).catch(fail);
          break;
        case 'PUT':
          axios.put(url, body, config).then(success).catch(fail);
          break;
        case 'HEAD':
          axios.head(url, config).then(success).catch(fail);
          break;
        default:
          res.status(405).send();
      }
    }
    else {
      res.status(401).send();
    }
  });


  // Angular routing.
  // // Serve static files.
  server.get('*.*', express.static(distFolder, { maxAge: '1y' }));
  // // "Data requests". For submited POST form informations.
  server.post('/*', (req, res) => {
    res.render(indexHtml, { req, res, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });
  // Serve environment variables file.
  server.get('*/environment.js', (req, res) => {
    res.send(`(function (window) {
      window.__env = window.__env || {};
      window.__env.BASE_URL = '${BASE_URL}';
      window.__env.BASE_PATH = '${BASE_PATH}';
      window.__env.API_URL = '${BASE_URL}${BASE_PATH}/api';
      window.__env.LOG_LEVEL = '${LOG_LEVEL}';
    }(this));`);
  });
  // // All regular routes using the Universal engine.
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req, res,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: { BASE_URL, BASE_PATH, API_URL: `${BASE_URL}${BASE_PATH}/api`, LOG_LEVEL } }
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
