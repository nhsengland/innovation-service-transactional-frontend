import * as appinsights from 'applicationinsights';


const methods: any = {
  trace:  ( message: string, severity: any, properties: any ) => {
    appinsights.defaultClient.trackTrace({
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
  const properties = req.body.properties;

  const instrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATION_KEY;


  appinsights
    .setup(instrumentationKey)
    .start();

  func(message, severity, properties);

  res.send();
};
