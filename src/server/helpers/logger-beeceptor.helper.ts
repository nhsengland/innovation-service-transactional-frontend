// src/server/helpers/logger-beeceptor.helper.ts
import { Request } from 'express';

const WEBHOOK_URL = process.env.WEBHOOK_LOGGING_URL || 'https://webhook.site/250f4e67-def8-426c-8cbb-8b50260830fa'; // Replace with your webhook.site endpoint

export async function sendLogToWebhook(eventName: string, data: Record<string, any>, req?: Request) {
  if (!WEBHOOK_URL) {
    console.warn('WEBHOOK_LOGGING_URL is not set or is a placeholder. Skipping webhook.site logging.');
    return;
  }

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
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to send log to webhook.site (${eventName}): HTTP error! status: ${response.status}, message: ${errorText}`
      );
    } else {
      console.log(`Log "${eventName}" sent to webhook.site successfully.`);
    }
  } catch (error) {
    console.error(`Error sending log "${eventName}" to webhook.site:`, error);
  }
}
