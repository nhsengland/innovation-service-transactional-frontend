import { KnownSeverityLevel } from 'applicationinsights';
import { getAppInsightsClient } from '../../globals';

export const exceptionLoggingMiddleware = (err: any, req: any, res: any, next: any) => {
  const client = getAppInsightsClient();

  client.trackException({
    exception: err,
    severity: KnownSeverityLevel.Error,
    properties: {
      params: req.params,
      query: req.query,
      path: req.path,
      route: req.route,
      authenticatedUser: req.session.oid,
      stack: err.stack
    }
  });

  next();
};
