import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';
import { Request } from 'express';
import { getAppInsightsClient } from 'src/globals';

export async function sendLogToAppAnalytics(eventName: string, data: Record<string, any>, req?: Request) {
  const logData = {
    timestamp: new Date().toISOString(),
    eventName,
    ...data,
    ...(req && {
      request: {
        method: req.method,
        path: req.path,
        headers: req.headers,
        ip: req.ip,
        originalUrl: req.originalUrl
      }
    })
  };

  try {
    getAppInsightsClient().trackTrace({
      severity: SeverityLevel.Warning,
      message: logData.eventName,
      properties: logData
    });
  } catch (error) {
    console.error(`Error sending log "${eventName}" to webhook.site:`, error);
  }
}
