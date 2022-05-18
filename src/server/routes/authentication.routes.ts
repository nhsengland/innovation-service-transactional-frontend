import axios from 'axios';
import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { Router } from 'express';
import * as passport from 'passport';
import { IOIDCStrategyOptionWithoutRequest, IProfile, OIDCStrategy, VerifyCallback } from 'passport-azure-ad';
import { getAppInsightsClient } from 'src/globals';
import { API_URL, BASE_PATH } from '../config/constants.config';

dotenv.config();

// Types definitions.
type UserSession = { oid: string, accessToken: string };

const OAUTH_CONFIGURATION: {
  tenantName: string;
  clientID: string;
  clientSecret: string;
  signinRedirectUrl: string;
  signupRedirectUrl: string;
  signoutRedirectUrl: string;
  changePwRedirectUrl: string,
  signinPolicy: string;
  signupPolicy: string;
  changePwPolicy: string;
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
  changePwRedirectUrl: process.env.OAUTH_REDIRECT_URL_CHANGE_PW || '',
  signinPolicy: process.env.OAUTH_SIGNIN_POLICY || '',
  signupPolicy: process.env.OAUTH_SIGNUP_POLICY || '',
  changePwPolicy: process.env.OAUTH_CHANGE_PW_POLICY || '',
  allowHttpForRedirectUrl: !!process.env.OAUTH_ALLOW_HTTP_REDIRECT,
  scope: process.env.OAUTH_SCOPE?.split(' ') || [],
  responseType: 'code id_token',
  responseMode: 'form_post',
  passReqToCallback: false
};

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
const userSessions: UserSession[] = [];

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

const authenticationRouter: Router = express.Router();

// Passport configuration.
authenticationRouter.use(passport.initialize());
authenticationRouter.use(passport.session());
passport.use(signInStrategy);

passport.serializeUser((user, next) => { next(null, user); });
passport.deserializeUser((obj: any, next) => { next(null, obj); });

// Authentication routes.
authenticationRouter.head(`${BASE_PATH}/session`, (req, res) => {
  const client = getAppInsightsClient(req);
  client.trackTrace({
    message: '/session called',
    severity: SeverityLevel.Information,
  });

  if (req.isAuthenticated()) {
    client.trackTrace({
      message: '/session called and user is authenticated',
      severity: SeverityLevel.Information,
      properties: {
        data: req.user,
      }
    });
    res.send('OK');
  } else {
    client.trackTrace({
      message: '/session called and user is NOT authenticated',
      severity: SeverityLevel.Information,
      properties: {
        data: { session: req.session, sessionId: req.sessionID, headers: req.headers, path: req.path },
      }
    });
    res.status(401).send();
  }
});

authenticationRouter.get(`${BASE_PATH}/auth/user`, (req, res) => {
  const user: IProfile = req.user || {};

  if (req.isAuthenticated() && user.oid) {
    const userInfo = { data: { id: user.oid, type: 'user', attributes: { displayName: user.displayName } } };
    res.send(userInfo);
  } else {
    res.status(401).send();
  }
});

// MS Azure OpenId Connect strategy (passport) and callbacks handling.
authenticationRouter.get(`${BASE_PATH}/signup`, (req, res) => {
  const azSignupUri = `https://${OAUTH_CONFIGURATION.tenantName}.b2clogin.com/${OAUTH_CONFIGURATION.tenantName}.onmicrosoft.com/oauth2/v2.0/authorize?scope=openid&response_type=id_token&response_mode=query&prompt=login`
    + `&p=${OAUTH_CONFIGURATION.signupPolicy}` // add policy information
    + `&client_id=${OAUTH_CONFIGURATION.clientID}` // add client id
    + `&redirect_uri=${encodeURIComponent(OAUTH_CONFIGURATION.signupRedirectUrl)}` // add redirect uri
    + `&state=${req.query.surveyId || ''}` // add survey id to state
    + `&survey_id=${req.query.surveyId || ''}`; // add survey id

  res.redirect(azSignupUri);
});

authenticationRouter.get(`${BASE_PATH}/signup/callback`, (req, res) => {
  const query = req.query;
  const state = query.state || '';
  const idToken = query.id_token || '';

  if (state && idToken) {
    const body = {
      surveyId: state,
      idToken
    };

    axios.post(`${API_URL}/api/me`, body)
      .then((response: any) => {
        res.redirect(`${BASE_PATH}/auth/signup/confirmation`);
      })
      .catch((error: any) => {
        console.error(`Error when attempting to save the user: ${API_URL}/api/me. Error: ${error}`);
        // TODO : error handling if we stop using AZ AD B2C
        res.redirect(`${BASE_PATH}/auth/signup/confirmation`);
      });
  }
});

// Login endpoint - AD OpenIdConnect
authenticationRouter.use(`${BASE_PATH}/signin`, (req, res, next) => {
  const client = getAppInsightsClient(req);

  passport.authenticate('signInStrategy', (err, user, info) => {
    if (err) {
      client.trackTrace({
        message: '/signin - autenticate error',
        severity: SeverityLevel.Error,
        properties: {
          data: { session: req.session, sessionId: req.sessionID, headers: req.headers, path: req.path },
        }
      });

      // will generate a 500 error
      return next(err);
    }

    if (!user) {
      client.trackTrace({
        message: '/signin - user profile undefined',
        severity: SeverityLevel.Information,
        properties: {
          data: { session: req.session, sessionId: req.sessionID, headers: req.headers, path: req.path },
        }
      });

      return res.redirect(`${BASE_PATH}/signin`);
    }

    req.login(user, (err) => {
      if (err) {
        client.trackTrace({
          message: '/signin - login error',
          severity: SeverityLevel.Error,
          properties: {
            data: { session: req.session, sessionId: req.sessionID, headers: req.headers, path: req.path },
          }
        });

        // will generate a 500 error
        return next(err);
      }

      return res.redirect(`${BASE_PATH}/dashboard`);
    });
  })(req, res, next);
});

authenticationRouter.post(`${BASE_PATH}/signin/callback`, (req, res) => {
  res.redirect(`${BASE_PATH}/dashboard`);
});

authenticationRouter.get(`${BASE_PATH}/signout`, (req, res) => {

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

// Change password endpoint - AD OpenIdConnect
authenticationRouter.get(`${BASE_PATH}/change-password`, (req, res) => {
  const azChangePwUri = `https://${OAUTH_CONFIGURATION.tenantName}.b2clogin.com/${OAUTH_CONFIGURATION.tenantName}.onmicrosoft.com/oauth2/v2.0/authorize?scope=openid&response_type=id_token&prompt=login`
    + `&p=${OAUTH_CONFIGURATION.changePwPolicy}` // add policy information
    + `&client_id=${OAUTH_CONFIGURATION.clientID}` // add client id
    + `&redirect_uri=${encodeURIComponent(OAUTH_CONFIGURATION.changePwRedirectUrl)}`; // add redirect uri
  res.redirect(azChangePwUri);
});

export function getAccessTokenByOid(oid: string): string {
  const userSessionIdx = userSessions.findIndex((u) => u.oid === oid);
  return (userSessionIdx !== -1) ? userSessions[userSessionIdx].accessToken : '';
}

export default authenticationRouter;
