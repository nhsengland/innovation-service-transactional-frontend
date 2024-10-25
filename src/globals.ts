import * as appinsights from 'applicationinsights';

let insights: appinsights.Configuration;

export const initAppInsights = () => {
  if (!insights) {
    insights = appinsights
      .setup(process.env['APPLICATIONINSIGHTS_CONNECTION_STRING'])
      .setDistributedTracingMode(appinsights.DistributedTracingModes.AI_AND_W3C)
      .start();

    appinsights.defaultClient.trackTrace({ message: 'App Insights started mjs' });

    // appinsights.defaultClient.addTelemetryProcessor((envelope, context) => {
    //   if (envelope.data?.baseData) {
    //     const oid = context?.['http.ServerRequest']?.session?.oid;
    //     if (oid) {
    //       envelope.data.baseData.properties['authenticatedUser'] = oid;
    //       envelope.data.baseData.properties['session'] = context?.['http.ServerRequest']?.sessionID;
    //     }
    //   }

    //   // 401 if (envelope.data.baseData) //
    //   return true;
    // });
  }

  return appinsights;
};

export const getAppInsightsClient = () => {
  return appinsights.defaultClient;
};
