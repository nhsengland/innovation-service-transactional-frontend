import {
  AuthenticationResult,
  AuthorizationCodeRequest,
  ConfidentialClientApplication,
  Configuration,
  LogLevel,
} from '@azure/msal-node';
import * as dotenv from 'dotenv';
import { Router } from 'express';
import { ENVIRONMENT } from '../config/constants.config';

dotenv.config();

const X = {
  tenantName: process.env.OAUTH_TENANT_NAME || '',
  signinPolicy: process.env.OAUTH_SIGNIN_POLICY || '',
  signupPolicy: process.env.OAUTH_SIGNUP_POLICY || '',

  signoutRedirectUrl: process.env.OAUTH_REDIRECT_URL_SIGNOUT || '',
};

// https://learn.microsoft.com/en-us/azure/active-directory-b2c/enable-authentication-in-node-web-app

const authorities = {
  signIn: `https://${X.tenantName}.b2clogin.com/${X.tenantName}.onmicrosoft.com/${X.signinPolicy}`,
};

const confidentialClientConfig: Configuration = {
  auth: {
    clientId: process.env.OAUTH_CLIENT_ID || '',
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    authority: authorities.signIn,
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

const APP_STATES = ['LOGIN', 'SIGNUP', 'SIGNOUT', 'PASSWORD_RESET'] as const;
type APP_STATES = (typeof APP_STATES)[number];

const redirects = {
  LOGIN: process.env.OAUTH_REDIRECT_URL_SIGNIN!,
  SIGNUP: process.env.OAUTH_REDIRECT_URL_SIGNUP!,
  SIGNOUT: process.env.OAUTH_REDIRECT_URL_SIGNOUT!,
  PASSWORD_RESET: process.env.OAUTH_REDIRECT_URL_CHANGE_PW!,
};

/**
 * This method is used to generate an auth code request
 * @param {string} authority: the authority to request the auth code from
 * @param {array} scopes: scopes to request the auth code for
 * @param {string} state: state of the application
 * @param {Object} res: express middleware response object
 */
const getAuthCode = (
  authority: string,
  scopes: string[],
  state: APP_STATES,
  res: any
) => {
  const authCodeRequest: AuthorizationCodeRequest = {
    authority: authority,
    scopes: scopes,
    state: state,
    redirectUri: redirects[state],
    code: 'TODO', // ver como sacar isto fora, acho que era suposto
  };

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

const authenticationRouter: Router = Router();

// Route methods
authenticationRouter.head(`${ENVIRONMENT.BASE_PATH}/session`, (req, res) => {
  const authenticated = req.session.id && getAccessTokenByOid(req.session.id);
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


authenticationRouter.get(
  `${ENVIRONMENT.BASE_PATH}/signin`,
  (req, res, next) => {
    getAuthCode(authorities.signIn, [], 'LOGIN', res);
  }
);

authenticationRouter.get(
  `${ENVIRONMENT.BASE_PATH}/signin/callback`,
  (req, res) => {
    if(!req.query.code) {
      // TODO
      console.log('no code');
      return;
    }

    switch (req.query.state) {
      case 'LOGIN':
        console.log('LOGIN');
        confidentialClientApplication.acquireTokenByCode({
          redirectUri: redirects.LOGIN,
          scopes: [],
          code: req.query.code as string,
        }).then((response)=>{

          console.log(`response: ${JSON.stringify(response)}`);

          setAccessTokenByOid(req.session.id, response);
          (req.session as any).sessionParams = { test: 'todo'};
          res.redirect(`${ENVIRONMENT.BASE_PATH}/dashboard`);
          //res.render('signin',{showSignInButton: false, givenName: response.account.idTokenClaims.given_name});
          }).catch((error)=>{
              console.log("\nErrorAtLogin: \n" + error);
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
  }
);


authenticationRouter.get(
  `${ENVIRONMENT.BASE_PATH}/signout`,
  (req, res, next) => {
    console.log(`SIGNOUT: ${JSON.stringify(req.body)}`);
    res.redirect(`${ENVIRONMENT.BASE_PATH}/home`);

    const redirectUrl = req.query.redirectUrl as string || X.signoutRedirectUrl;
    const azLogoutUri = `https://${X.tenantName}.b2clogin.com/${X.tenantName}.onmicrosoft.com/oauth2/v2.0/logout`
      + `?p=${X.signinPolicy}` // add policy information
      + `&post_logout_redirect_uri=${encodeURIComponent(redirectUrl)}`; // add post logout redirect uri

    console.log(`destroying session`)
    const oid = req.session.id;
    req.session.destroy(() => {
      console.log(`redirecting to ${azLogoutUri}`)
      deleteAccessTokenByOid(oid);
      // TOOD this breaks ... server side ??? 
      // res.redirect(azLogoutUri);
    })
    // TODO remove this after
    res.redirect(redirectUrl);
  }
);


export function getAccessTokenByOid(oid: string): string {
  const session = userSessions.get(oid);
  return session && session.expiresAt > +new Date()/1000 ? session.accessToken : '';
}

function setAccessTokenByOid(oid: string, response: AuthenticationResult): void {
  userSessions.set(oid, { oid, accessToken: response.idToken, expiresAt: (response.idTokenClaims as any).exp ?? Math.floor(+new Date()/1000) + 3600 });
}

function deleteAccessTokenByOid(oid: string): void {
  userSessions.delete(oid);
}

function refreshAccessTokenByOid(oid: string): void {
  // TODO
}

export default authenticationRouter;
