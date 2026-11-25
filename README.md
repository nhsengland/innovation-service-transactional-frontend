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

## Run locally in WSL

Use Ubuntu in WSL. Put this repo and `innovation-service-backend-api` next to each other in the Linux filesystem (for example, `~/NHS`). The backend uses Unix symbolic links, so install it from WSL.

1. Install Node 20.18 or later within Node 20, npm 10.8 or 10.9, Docker with WSL integration, and Azure Functions Core Tools (`func`).
2. Set up this repo's `.env` as described below. For the local backend, set `LOCAL_API_ADMIN_BASE_URL=http://127.0.0.1:7071`, `LOCAL_API_INNOVATIONS_BASE_URL=http://127.0.0.1:7072`, and `LOCAL_API_USERS_BASE_URL=http://127.0.0.1:7074`. Keep secrets out of Git.
3. Run `npm ci` here. In the sibling backend repo, set up `.env` and `local.settings.json` (see its README), then run `npm ci` there.
4. In the backend repo, start Docker:

```bash
docker compose -f .docker/docker-compose.yml up -d
```

On the first start, wait for SQL Server to be ready, then prepare the database:

```bash
node scripts/create-local-dbs.js
npm run migrations
npm run seeds
```

Open three WSL terminals in the backend repo. Run one command in each:

```bash
npm run app:watch --function-app=admin --port=7071
npm run app:watch --function-app=innovations --port=7072
npm run app:watch --function-app=users --port=7074
```

In a fourth WSL terminal, run `npm run start:dev:ssr` from this repo. Open `http://localhost:4200`. These commands do not start the informational frontend or notifications function. Press Ctrl+C in each terminal to stop an app; run `docker compose -f .docker/docker-compose.yml down` from the backend repo to stop Docker services.

If startup fails, read the error in that terminal. Check Docker in WSL, `func`, dependencies in both repos, and the local settings.

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
