import { Request, Response, NextFunction } from 'express';
import { GeoIpService } from '../services/GeoIpService';
import { getClientIp } from '../helpers/client-ip.helper';
import { sendLogToWebhook } from '../helpers/logger-beeceptor.helper';

export const geoIpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  await sendLogToWebhook('GeoIpMiddleware: Start', {}, req);
  const geoIpEnabled = process.env.GEO_IP_ENABLED === 'false' ? false : true;

  if (!geoIpEnabled) {
    await sendLogToWebhook('GeoIpMiddleware: Disabled', { geoIpEnabled }, req);
    return next();
  }

  // Allow access to the error page to prevent infinite redirect loops
  if (req.path.includes('/error/generic')) {
    await sendLogToWebhook('GeoIpMiddleware: Error Page Access', { path: req.path }, req);
    return next();
  }

  const clientIp = getClientIp(req);
  await sendLogToWebhook('GeoIpMiddleware: Client IP Determined', { clientIp }, req);
  console.log(`GeoIP Middleware: Client IP is ${clientIp}`);
  const geoIpService = GeoIpService.getInstance();
  await sendLogToWebhook('GeoIpMiddleware: Checking Country Ban', { clientIp }, req);

  try {
    const isBanned = await geoIpService.isCountryBanned(clientIp);

    if (isBanned) {
      await sendLogToWebhook('GeoIpMiddleware: Country Banned - Redirecting', { clientIp, isBanned }, req);
      // The user's country is banned.
      // You can redirect them to an error page or simply send a forbidden status.
      // We will redirect to a generic error page to avoid giving too much information.
      return res.redirect(`${process.env.BASE_PATH}/error/generic`);
    }

    // If not banned, proceed to the next middleware or route handler.
    await sendLogToWebhook('GeoIpMiddleware: Country Not Banned - Proceeding', { clientIp, isBanned }, req);
    return next();
  } catch (error: any) {
    await sendLogToWebhook(
      'GeoIpMiddleware: Error during GeoIP check',
      { errorMessage: error.message, stack: error.stack },
      req
    );
    console.error('Error during GeoIP check:', error);
    // In case of an error with the GeoIP service,
    // you might want to decide whether to block the request or allow it.
    // For this implementation, we will allow it to avoid blocking legitimate users
    // if the service fails.
    return next();
  }
};
