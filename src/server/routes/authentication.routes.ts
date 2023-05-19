import {
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

// Initialize MSAL Node
const confidentialClientApplication = new ConfidentialClientApplication(
  confidentialClientConfig
);

const APP_STATES = ['LOGIN', 'SIGNUP', 'SIGNOUT', 'PASSWORD_RESET'] as const;
type APP_STATES = (typeof APP_STATES)[number];

const redirects = {
  LOGIN: process.env.OAUTH_REDIRECT_URL_SIGNIN,
  SIGNUP: process.env.OAUTH_REDIRECT_URL_SIGNUP,
  SIGNOUT: process.env.OAUTH_REDIRECT_URL_SIGNOUT,
  PASSWORD_RESET: process.env.OAUTH_REDIRECT_URL_CHANGE_PW,
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
    redirectUri: redirects[state] ?? '',
    code: 'TODO',
    maxAge: 3600000, // validate this is correct
  };

  // Cenas extra para o code request como pârametros adicionais

  //Each time you fetch Authorization code, update the relevant authority in the tokenRequest configuration
  // TODO tokenRequest.authority = authority;

  // request an authorization code to exchange for a token
  return confidentialClientApplication
    .getAuthCodeUrl(authCodeRequest)
    .then((response) => {
      console.log('\nAuthCodeURL: \n' + response);
      //redirect to the auth code URL/send code to
      res.redirect(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

const authenticationRouter: Router = Router();

authenticationRouter.get(
  `${ENVIRONMENT.BASE_PATH}/signin`,
  (req, res, next) => {
    getAuthCode(authorities.signIn, [], 'LOGIN', res);
  }
);

authenticationRouter.get(
  `${ENVIRONMENT.BASE_PATH}/signin/callback`,
  (req, res) => {
    res.redirect(`${ENVIRONMENT.BASE_PATH}/dashboard`);
  }
);

export function getAccessTokenByOid(oid: string): string {
  throw new Error('Not implemented');
}

export default authenticationRouter;
