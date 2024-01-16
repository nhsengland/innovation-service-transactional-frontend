import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';
import { getAppInsightsClient } from '../../globals';

export const appLoggingMiddleware = (req: any, res: any, next: any) => {
  if (req.path.includes(process.env.BASE_PATH)) {
    const client = getAppInsightsClient();

    client.trackTrace({
      message: `[${req.method}] ${req.url} requested by ${req.session.oid ?? 'anonymous'}`,
      severity: SeverityLevel.Verbose,
      properties: {
        params: req.params,
        query: req.query,
        path: req.path,
        route: req.route,
        authenticatedUser: req.session.oid,
        method: req.method
      }
    });
  }

  next();
};
