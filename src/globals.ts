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

export const getAppInsightsClient = () => {
  return appinsights.defaultClient;
};
