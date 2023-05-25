import {
  AuthenticationResult,
  AuthorizationUrlRequest,
  ConfidentialClientApplication,
  Configuration,
  LogLevel
} from '@azure/msal-node';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Response, Router } from 'express';
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
    //    redirectUri: process.env.REDIRECT_URI,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Verbose,
    },
  },
};

// Session
type UserSession = { oid: string, accessToken: string, expiresAt: number };
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

export function getAccessTokenBySessionId(sessionId: string): string {
  const sessionToken = userSessions.get(sessionId);
  return sessionToken && sessionToken.expiresAt > +new Date()/1000 ? sessionToken.accessToken : '';
}


//#region Routes
authenticationRouter.head(`${ENVIRONMENT.BASE_PATH}/session`, (req, res) => {
  const authenticated = req.session.id && getAccessTokenBySessionId(req.session.id);
  if (authenticated) {
    console.log('user is authenticated')
    // client.trackTrace({
    //   severity: SeverityLevel.Information,
    //   message: '/session called and user is authenticated',
    //   properties: {
    //     params: req.params,
    //     query: req.query,
    //     path: req.path,
    //     route: req.route,
    //     authenticatedUser: (req.user as any)?.oid,
    //     session: req.session,
    //     sessionId: req.sessionID
    //   }
    // });
    res.send('OK');
  } else {
    console.log('user is not authenticated')
    // client.trackTrace({
    //   severity: SeverityLevel.Information,
    //   message: '/session called and user is NOT authenticated',
    //   properties: {
    //     params: req.params,
    //     query: req.query,
    //     path: req.path,
    //     route: req.route,
    //     authenticatedUser: (req.user as any)?.oid,
    //   }
    // });
    res.status(401).send();

    //res.redirect(`${ENVIRONMENT.BASE_PATH}/signin`);
  }
});


authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/signin`, (req, res) => {
  // Using state to pass the back URL as per https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-js-pass-custom-state-authentication-request
  getAuthCode(authorities.signin, [], 'LOGIN', res, req.query.back?.toString() ?? undefined);
});

authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/signin/callback`, (req, res) => {
  if(!req.query.code) {
    // TODO
    console.log('no code');
    res.status(500).send();
  }

  const [state, backUrl] = (req.query.state as string).split(';');

  switch (state) {
    case 'LOGIN':
      console.log('LOGIN');
      confidentialClientApplication.acquireTokenByCode({
        redirectUri: redirects.LOGIN,
        scopes: [],
        code: req.query.code as string,
      }).then((response)=>{

        console.log(`response: ${JSON.stringify(response)}`);

        setAccessTokenBySessionId(req.session.id, response);
        (req.session as any).oid = response.uniqueId;

        res.redirect(backUrl ? backUrl : `${ENVIRONMENT.BASE_PATH}/dashboard`);
        }).catch((error)=>{
            console.log("\nErrorAtLogin: \n" + error);
            res.status(500).send();
        });
      break;
    case 'SIGNUP':
      console.log('SIGNUP');
      break;
    default:
      // TODO
      console.log('default');
  }

  // TODO res.redirect(`${ENVIRONMENT.BASE_PATH}/dashboard`);
  // res.redirect(`${ENVIRONMENT.BASE_PATH}/home`);
});


authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/signout`, (req, res) => {
  const redirectUrl = req.query.redirectUrl as string || OAUTH_CONFIG.signoutRedirectUrl;
  const azLogoutUri = `https://${OAUTH_CONFIG.tenantName}.b2clogin.com/${OAUTH_CONFIG.tenantName}.onmicrosoft.com/oauth2/v2.0/logout`
    + `?p=${OAUTH_CONFIG.signinPolicy}` // add policy information
    + `&post_logout_redirect_uri=${encodeURIComponent(redirectUrl)}`; // add post logout redirect uri

  const oid = req.session.id;
  req.session.destroy(() => {
    console.log(`redirecting to ${azLogoutUri}`)
    deleteAccessTokenBySessionId(oid);
    res.redirect(azLogoutUri);
  })
});

authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/signup`, (_req, res) => {
  getAuthCode(authorities.signup, [], 'SIGNUP', res);
});

authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/signup/callback`, (req, res) => {
  if(!req.query.code) {
    // TODO
    console.log('no code');
    res.status(500).send();
  }

  confidentialClientApplication.acquireTokenByCode({
    authority: authorities.signup,
    redirectUri: redirects.SIGNUP,
    scopes: [],
    code: req.query.code as string,
  }).then((response)=>{
    axios.post(`${ENVIRONMENT.API_USERS_URL}/v1/me`, { token: response.idToken })
    .then(() => { res.redirect(`${ENVIRONMENT.BASE_PATH}/auth/signup/confirmation`); })
    .catch((error: any) => {
      console.error(`Error when attempting to save the user: ${ENVIRONMENT.API_USERS_URL}/v1/me. Error: ${error}`);
      res.redirect(`${ENVIRONMENT.BASE_PATH}/error/generic`);
    });
  }).catch((error)=>{
    console.log
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

  // console.log('AUTH CODE REQUEST:', authCodeRequest)

  // Cenas extra para o code request como parâmetros adicionais
  // authCodeRequest.extraQueryParameters = {"campaignId" : "germany-promotion"}

  //Each time you fetch Authorization code, update the relevant authority in the tokenRequest configuration
  // TODO tokenRequest.authority = authority;

  // request an authorization code to exchange for a token
  return confidentialClientApplication
    .getAuthCodeUrl(authCodeRequest)
    .then((response) => {
      console.log('RESPONSE:', response)
      //redirect to the auth code URL/send code to
      res.redirect(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

function setAccessTokenBySessionId(sessionId: string, response: AuthenticationResult): void {
  userSessions.set(sessionId, { oid: response.uniqueId, accessToken: response.idToken, expiresAt: (response.idTokenClaims as any).exp ?? Math.floor(+new Date()/1000) + 3600 });
}

function deleteAccessTokenBySessionId(sessionId: string): void {
  userSessions.delete(sessionId);
}
//#endregion

export default authenticationRouter;

// TODO keep current url
// TODO restart server and keep session
// TODO logs
// TODO send errors "nice"



// Didn't create from previous
// authenticationRouter.get(`${ENVIRONMENT.BASE_PATH}/auth/user`, (req, res) => {
