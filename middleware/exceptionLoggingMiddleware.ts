import * as appinsights from 'applicationinsights';
import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';

export const exceptionLoggingMiddleware = (err: any, req: any, res: any, next: any) => {
  const instrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATION_KEY;

  appinsights
    .setup(instrumentationKey)
    .start();

  appinsights.defaultClient.trackException({
    exception: err,
    severity: SeverityLevel.Error,
    properties: {
      params: req.params,
      query: req.query,
      path: req.path,
      route: req.route,
      authenticatedUser: req.user?.oid,
      stack: err.stack,
    }
  });

  next();
};
