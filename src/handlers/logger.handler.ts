import { getAppInsightsClient } from '../globals';

const methods: any = {
  trace:  ( message: string, severity: any, properties: any, req: any ) => {
    const client = getAppInsightsClient(req);
    client.trackTrace({
      message,
      severity,
      properties,
    });
  },
};

export const handler = (req: any, res: any) => {

  const type = req.body.type as string;
  const func = methods[type];
  const message = req.body.message;
  const severity = req.body.severity;
  const authenticatedUser = req.user?.oid || null;
  const properties = {
    ...req.body.properties,
    authenticatedUser,
  };

  func(message, severity, properties, req);

  res.send();
};
