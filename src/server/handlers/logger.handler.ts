import { getAppInsightsClient } from '../../globals';

const methods: any = {
  trace: (message: string, severity: any, properties: any, req: any) => {
    const client = getAppInsightsClient();
    client.trackTrace({
      message,
      severity,
      properties: {
        ...properties,
        ...(req.session.oid && { authenticatedUser: req.session.oid })
      }
    });
  }
};

export const handler = (req: any, res: any) => {
  const type = req.body.type as string;
  const func = methods[type];
  const message = req.body.message;
  const severity = req.body.severity;
  const authenticatedUser = req.session.oid || null;
  const properties = {
    ...req.body.properties,
    authenticatedUser
  };

  func(message, severity, properties, req);

  res.send();
};
