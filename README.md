# NHS Service Transaccional Frontend
NHS Service Transactional Frontend is a visual gateway to the NHS Innovation Service, in the transactional component. It will be used by the following user profiles:
Unregistered Innovators
Registered innovators
Accessors

This project is build in JavaScript + TypeScript, with the **Angular framework** ([angular.io]()), configured as **Server Side Rendering** ([angular.io/guide/universal](Angular Universal)).


## Dependencies
- Node
- NPM

## Installation
### Set environment variables file
| Name                        | Required | Default | Possibilities                             | Description                          |
| --------------------------- | :------: | :-----: | ----------------------------------------- | ------------------------------------ |
| BASE_HREF                   |          |    /    |                                           |                                      |
| API_URL                     |   Yes    |         |                                           |                                      |
| BASE_PATH                   |   Yes    |         |                                           |                                      |
| STATIC_CONTENT_PATH         |   Yes    |         |                                           |                                      |
| VIEWS_PATH                  |   Yes    |         |                                           | Path to browser directory            |
| LOG_LEVEL                   |          |  ERROR  | TRACE DEBUG INFO LOG WARN ERROR FATAL OFF |                                      |
| OAUTH_TENANT_NAME           |   Yes    |         |                                           |                                      |
| OAUTH_CLIENT_ID             |   Yes    |         |                                           |                                      |
| OAUTH_CLIENT_SECRET         |   Yes    |         |                                           |                                      |
| OAUTH_SIGNUP_POLICY         |   Yes    |         |                                           |                                      |
| OAUTH_SIGNIN_POLICY         |   Yes    |         |                                           |                                      |
| OAUTH_REDIRECT_URL_SIGNUP   |   Yes    |         |                                           |                                      |
| OAUTH_REDIRECT_URL_SIGNIN   |   Yes    |         |                                           |                                      |
| OAUTH_REDIRECT_URL_SIGNOUT  |   Yes    |         |                                           |                                      |
| OAUTH_SCOPE                 |   Yes    |         |                                           |                                      |
| OAUTH_ALLOW_HTTP_REDIRECT   |   Yes    |         |                                           |                                      |

Create a new file "environment.js" file in "src" directory with the content below. Atention: this is a JS file, not TS!
```
window.__env = {
  API_URL: 'https://to-be-determined.com',
  LOG_LEVEL: 'TRACE'
};
```

Run the following commands:
```bash
npm install
```

## Running the app
### Development mode
```bash
npm run start:dev:spa # Run like a Single Page Application (client side)
npm run start:dev:ssr # Run like a Server Side Rendering
```

## Building
```bash
npm run build:spa # Build like a Single Page Application (client side)
npm run build:ssr # Build like a Server Side Rendering
```
Output file will be on `dist` folder
