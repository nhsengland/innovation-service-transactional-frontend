# NHS Service Transaccional Frontend
NHS Service Transactional Frontend is a visual gateway to the NHS Innovation Service, in the transactional component. It will be used by the following user profiles:
- Unregistered Innovators
- Registered innovators
- Accessors
- Needs Assessors
- Admins

This project is build in JavaScript + TypeScript, with the **Angular framework** ([angular.io]()), configured as **Server Side Rendering** ([angular.io/guide/universal](Angular Universal)).


## Dependencies
- Node
- NPM

## Installation
### Set environment variables file
| Name                            | Required | Default | Possibilities                             | Description                          |
| ------------------------------- | :------: | :-----: | ----------------------------------------- | ------------------------------------ |
| BASE_URL                        |   Yes    |         |                                           |                                      |
| BASE_PATH                       |          |    /    |                                           |                                      |
| API_URL                         |   Yes    |         |                                           |                                      |
| LOG_LEVEL                       |          |  ERROR  | TRACE DEBUG INFO LOG WARN ERROR FATAL OFF |                                      |
| STATIC_CONTENT_PATH             |   Yes    |         |                                           |                                      |
| VIEWS_PATH                      |   Yes    |         |                                           | Path to browser directory            |
| ENABLE_ANALYTICS                |   No     |  true   |                                           |                                      |
| TAG_MEASUREMENT_ID              |   Yes    |         |                                           | GA4 Measurement Tag                  |
| GTM_ID                          |   Yes    |         |                                           | GA4 Tag Manager ID                   |
| APPINSIGHTS_INSTRUMENTATION_KEY |   Yes    |         |                                           |                                      |
| OAUTH_TENANT_NAME               |   Yes    |         |                                           |                                      |
| OAUTH_CLIENT_ID                 |   Yes    |         |                                           |                                      |
| OAUTH_CLIENT_SECRET             |   Yes    |         |                                           |                                      |
| OAUTH_SIGNUP_POLICY             |   Yes    |         |                                           |                                      |
| OAUTH_SIGNIN_POLICY             |   Yes    |         |                                           |                                      |
| OAUTH_CHANGE_PW_POLICY          |   Yes    |         |                                           |                                      |
| OAUTH_REDIRECT_URL_SIGNUP       |   Yes    |         |                                           |                                      |
| OAUTH_REDIRECT_URL_SIGNIN       |   Yes    |         |                                           |                                      |
| OAUTH_REDIRECT_URL_SIGNOUT      |   Yes    |         |                                           |                                      |
| OAUTH_REDIRECT_URL_CHANGE_PW    |   Yes    |         |                                           |                                      |
| OAUTH_SCOPE                     |   Yes    |         |                                           |                                      |
| OAUTH_ALLOW_HTTP_REDIRECT       |   Yes    |         |                                           |                                      |
| SESSION_SECRET                  |   Yes    |         |                                           |                                      |

Create a new file ".env" file on the root's project with the above variables


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
