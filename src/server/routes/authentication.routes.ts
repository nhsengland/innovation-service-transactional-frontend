import {
  AccountInfo,
  AuthenticationResult,
  AuthorizationUrlRequest,
  ConfidentialClientApplication,
  Configuration,
  LogLevel
} from '@azure/msal-node';
import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Response, Router } from 'express';
import { getAppInsightsClient } from 'src/globals';
import { ENVIRONMENT } from '../config/constants.config';

dotenv.config();

const OAUTH_CONFIG = {
  tenantName: process.env.OAUTH_TENANT_NAME || '',
  signinPolicy: process.env.OAUTH_SIGNIN_POLICY || '',
  signupPolicy: process.env.OAUTH_SIGNUP_POLICY || '',
  changePasswordPolicy: process.env.OAUTH_CHANGE_PW_POLICY || '',
  signoutRedirectUrl: process.env.OAUTH_REDIRECT_URL_SIGNOUT || '',
};

const authorities = {
  signin: `https://${OAUTH_CONFIG.tenantName}.b2clogin.com/${OAUTH_CONFIG.tenantName}.onmicrosoft.com/${OAUTH_CONFIG.signinPolicy}`,
  signup: `https://${OAUTH_CONFIG.tenantName}.b2clogin.com/${OAUTH_CONFIG.tenantName}.onmicrosoft.com/${OAUTH_CONFIG.signupPolicy}`,
  changePassword: `https://${OAUTH_CONFIG.tenantName}.b2clogin.com/${OAUTH_CONFIG.tenantName}.onmicrosoft.com/${OAUTH_CONFIG.changePasswordPolicy}`,
};

const confidentialClientConfig: Configuration = {
  auth: {
    clientId: process.env.OAUTH_CLIENT_ID || '',
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    authority: authorities.signin,
    knownAuthorities: Object.values(authorities),
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message) {
        try {
          getAppInsightsClient().trackTrace({
            severity: 4-logLevel as SeverityLevel ?? SeverityLevel.Information,  // logLevel is reverse of SeverityLevel
            message: message,
          });
        } catch (error) {
          // Ignore error
        }
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Warning,
    },
  }
};

// Session
type UserSession = { oid: string, account: AccountInfo };
const userSessions = new Map<string, UserSession>();

// Initialize MSAL Node
const confidentialClientApplication = new ConfidentialClientApplication(
  confidentialClientConfig
);

const APP_STATES = ['LOGIN', 'SIGNUP', 'SIGNOUT', 'CHANGE_PASSWORD'] as const;
type APP_STATES = (typeof APP_STATES)[number];

const redirects = {
  LOGIN: process.env.OAUTH_REDIRECT_URL_SIGNIN!,
  SIGNUP: process.env.OAUTH_REDIRECT_URL_SIGNUP!,
  SIGNOUT: process.env.OAUTH_REDIRECT_URL_SIGNOUT!,
  CHANGE_PASSWORD: process.env.OAUTH_REDIRECT_URL_CHANGE_PW!,
};



const authenticationRouter: Router = Router();

export async function getAccessTokenBySessionId(sessionId: string): Promise<string> {
  const sessionToken = userSessions.get(sessionId);
  if(sessionToken) {
    try {
      return (await confidentialClientApplication.acquireTokenSilent({
        account: sessionToken.account,
        scopes: [],
      }))?.idToken ?? '';
    } catch (error: any) {
      // This will fail if we don't have the token cached but there will be a 401 and a redirect to b2c
      getAppInsightsClient().trackException({
        severity: SeverityLevel.Information,
        exception: error
      });
    }
  }
  return '';
}


//#region Routes
authenticationRouter.head(`${ENVIRONMENT.BASE_PATH}/session`, async (req, res) => {
  const authenticated = req.session.id && await getAccessTokenBySessionId(req.session.id);
  if (authenticated) {
    getAppInsightsClient().trackTrace({
      severity: SeverityLevel.Information,
      message: '/session called and user is authenticated',
      properties: {
        params: req.params,
        query: req.query,
        path: req.path,
        route: req.route,
        authenticatedUser: (req.session as any).oid,
        session: req.session,
        sessionId: req.sessionID
      }
    });
    res.send('OK');
  } else {
    getAppInsightsClient().trackTrace({
      severity: SeverityLevel.Information,
      message: '/session called and user is NOT authenticated',
      properties: {
        params: req.params,
        query: req.query,
        path: req.path,
        route: req.route,
        authenticatedUser: (req.session as any).oid,
      }
    });
    res.status(401).send();
  }
});


authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/signin`, (req, res) => {
  // Using state to pass the back URL as per https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-js-pass-custom-state-authentication-request
  getAuthCode(authorities.signin, [], 'LOGIN', res, req.query.back?.toString() ?? undefined);
});

authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/signin/callback`, (req, res) => {
  if(!req.query.code) {
    // If the user canceled the request, the error_description will contain AADB2C90091
    if(req.query.error && req.query.error_description && req.query.error_description.toString().includes('AADB2C90091')) {
      getAppInsightsClient().trackTrace({
        message: `[${req.method}] ${req.url} requested by ${(req.session as any).oid ?? 'anonymous'} canceled request`,
        severity: SeverityLevel.Error,
        properties: {
          authenticatedUser: (req.session as any).oid,
        }
      });
      res.redirect(`${ENVIRONMENT.BASE_PATH}/signout`);
    } else {
      getAppInsightsClient().trackTrace({
        message: `[${req.method}] ${req.url} requested by ${(req.session as any).oid ?? 'anonymous'} failed because no code was provided`,
        severity: SeverityLevel.Error,
        properties: {
          params: req.params,
          query: req.query,
          path: req.path,
          route: req.route,
          authenticatedUser: (req.session as any).oid,
          method: req.method,
        }
      });
      res.redirect(`${ENVIRONMENT.BASE_PATH}/error/generic`);
    }
    return;
  }

  const [state, backUrl] = (req.query.state as string).split(';');

  switch (state) {
    case 'LOGIN':
      confidentialClientApplication.acquireTokenByCode({
        redirectUri: redirects.LOGIN,
        scopes: [],
        code: req.query.code as string,
      }).then((response)=>{
        setAccessTokenBySessionId(req.session.id, response);
        (req.session as any).oid = response.uniqueId;

        res.redirect(backUrl ? backUrl : `${ENVIRONMENT.BASE_PATH}/dashboard`);
        }).catch((error)=>{
          getAppInsightsClient().trackException({
            exception: error,
            severity: SeverityLevel.Error,
            properties: {
              params: req.params,
              query: req.query,
              path: req.path,
              route: req.route,
              authenticatedUser: (req.session as any).oid,
              stack: error.stack,
            }
          });
          res.redirect(`${ENVIRONMENT.BASE_PATH}/error/generic`);
        });
      break;
    default:
      // We only have login callback for now
      getAppInsightsClient().trackTrace({
        message: `[${req.method}] ${req.url} requested by ${(req.session as any).oid ?? 'anonymous'} failed because the state ${state} was not recognized`,
        severity: SeverityLevel.Warning,
        properties: {
          params: req.params,
          query: req.query,
          path: req.path,
          route: req.route,
          authenticatedUser: (req.session as any).oid,
          method: req.method,
        }
      });
      res.redirect(OAUTH_CONFIG.signoutRedirectUrl);
  }
});


authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/signout`, (req, res) => {
  const redirectUrl = req.query.redirectUrl as string || OAUTH_CONFIG.signoutRedirectUrl;
  const azLogoutUri = `https://${OAUTH_CONFIG.tenantName}.b2clogin.com/${OAUTH_CONFIG.tenantName}.onmicrosoft.com/oauth2/v2.0/logout`
    + `?p=${OAUTH_CONFIG.signinPolicy}` // add policy information
    + `&post_logout_redirect_uri=${encodeURIComponent(redirectUrl)}`; // add post logout redirect uri

  const oid = req.session.id;
  req.session.destroy(() => {
    deleteAccessTokenBySessionId(oid);
    res.redirect(azLogoutUri);
  })
});

authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/signup`, (_req, res) => {
  getAuthCode(authorities.signup, [], 'SIGNUP', res);
});

authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/signup/callback`, (req, res) => {
  if(!req.query.code) {
    // If the user canceled the request, the error_description will contain AADB2C90091
    if(req.query.error && req.query.error_description && req.query.error_description.toString().includes('AADB2C90091')) {
      getAppInsightsClient().trackTrace({
        message: `[${req.method}] ${req.url} requested by ${(req.session as any).oid ?? 'anonymous'} canceled request`,
        severity: SeverityLevel.Error,
        properties: {
          authenticatedUser: (req.session as any).oid,
        }
      });
      res.redirect(OAUTH_CONFIG.signoutRedirectUrl);
    } else {
      getAppInsightsClient().trackTrace({
        message: `[${req.method}] ${req.url} requested by ${(req.session as any).oid ?? 'anonymous'} failed because no code was provided`,
        severity: SeverityLevel.Error,
        properties: {
          params: req.params,
          query: req.query,
          path: req.path,
          route: req.route,
          authenticatedUser: (req.session as any).oid,
          method: req.method,
        }
      });
      res.redirect(`${ENVIRONMENT.BASE_PATH}/error/generic`);
    }
    return;
  }

  confidentialClientApplication.acquireTokenByCode({
    authority: authorities.signup,
    redirectUri: redirects.SIGNUP,
    scopes: [],
    code: req.query.code as string,
  }).then((response)=>{
    axios.post(`${ENVIRONMENT.API_USERS_URL}/v1/me`, {}, {
      headers: {
        'Authorization': `Bearer ${response.idToken}`,
      }
    })
    .then(() => { res.redirect(`${ENVIRONMENT.BASE_PATH}/auth/signup/confirmation`); })
    .catch((error: any) => {
      getAppInsightsClient().trackException({
        exception: error,
        severity: SeverityLevel.Error,
        properties: {
          params: req.params,
          query: req.query,
          path: req.path,
          route: req.route,
          authenticatedUser: (req.session as any).oid,
          stack: error.stack,
          message: `Error when attempting to save the user: ${ENVIRONMENT.API_USERS_URL}/v1/me. Error: ${error}`
        }
      });
      res.redirect(`${ENVIRONMENT.BASE_PATH}/error/generic`);
    });
  }).catch((error)=>{
    getAppInsightsClient().trackException({
      exception: error,
      severity: SeverityLevel.Error,
      properties: {
        params: req.params,
        query: req.query,
        path: req.path,
        route: req.route,
        authenticatedUser: (req.session as any).oid,
        stack: error.stack,
      }
    });
    res.redirect(`${ENVIRONMENT.BASE_PATH}/error/generic`);
  });

  
});

authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/change-password`, (_req, res) => {
  getAuthCode(authorities.changePassword, [], 'CHANGE_PASSWORD', res);
});
//#endregion

//#region Auxiliary functions
function getAuthCode(
  authority: string,
  scopes: string[],
  state: APP_STATES,
  res: Response,
  backUrl?: string
) {
  const authCodeRequest: AuthorizationUrlRequest = {
    authority: authority,
    scopes: scopes,
    state: backUrl ? `${state};${backUrl}` : state,
    redirectUri: redirects[state]
  };

  // request an authorization code to exchange for a token
  return confidentialClientApplication
    .getAuthCodeUrl(authCodeRequest)
    .then((response) => {
      //redirect to the auth code URL/send code to
      res.redirect(response);
    })
    .catch(() => {
      res.redirect(`${ENVIRONMENT.BASE_PATH}/error/generic`);
    });
};

function setAccessTokenBySessionId(sessionId: string, response: AuthenticationResult): void {
  if(response.account) {
    userSessions.set(sessionId, { oid: response.uniqueId, account: response.account });
  }
}

function deleteAccessTokenBySessionId(sessionId: string): void {
  userSessions.delete(sessionId);
}
//#endregion

export default authenticationRouter;

// Didn't create from previous seems it wasn't used
// authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/auth/user`, (req, res) => {
