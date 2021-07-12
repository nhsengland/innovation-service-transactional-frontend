import * as appinsights from 'applicationinsights';

let insights: appinsights.Configuration;
export const initAppInsights = () => {
  if (!insights) {
    insights = appinsights
    .setup(process.env.APPINSIGHTS_INSTRUMENTATION_KEY)
    .setDistributedTracingMode(appinsights.DistributedTracingModes.AI_AND_W3C)
    .start();
  }
  return appinsights;
};

export const getAppInsightsClient = (req: any) => {
  appinsights.defaultClient.context.tags[appinsights.defaultClient.context.keys.userAuthUserId] = req.user?.oid;
  appinsights.defaultClient.context.tags[appinsights.defaultClient.context.keys.sessionId] = req.session.id;
  appinsights.defaultClient.context.tags[appinsights.defaultClient.context.keys.userId] = req.user?.oid;
  return appinsights.defaultClient;
};
