import { getAppInsightsClient } from '../globals';
import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';

export const appLoggingMiddleware = (req: any, res: any, next: any) => {

  if (req.path.contains(process.env.BASE_PATH)) {

    const client = getAppInsightsClient();

    client.trackTrace({
      message: `${req.url} requested by ${req.user ? req.user.oid : 'anonymous'}`,
      severity: SeverityLevel.Verbose,
      properties: {
        params: req.params,
        query: req.query,
        path: req.path,
        route: req.route,
        authenticatedUser: req.user?.oid,
      }
    });
  }
  next();
};
