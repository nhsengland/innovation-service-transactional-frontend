import { Request, Response, NextFunction } from 'express';
import { GeoIpService } from '../services/GeoIpService';
import { getClientIp } from '../helpers/client-ip.helper';

export const geoIpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const geoIpEnabled = process.env.GEO_IP_ENABLED === 'false' ? false : true;

  console.log(`GeoIP Middleware: GEO_IP_ENABLED is set to ${geoIpEnabled}`);

  if (!geoIpEnabled) {
    return next();
  }

  const clientIp = getClientIp(req);
  console.log(`GeoIP Middleware: Client IP is ${clientIp}`);
  const geoIpService = GeoIpService.getInstance();
  console.log('GeoIP Middleware: Obtained GeoIpService instance');

  try {
    const isBanned = await geoIpService.isCountryBanned(clientIp);

    if (isBanned) {
      // The user's country is banned.
      // You can redirect them to an error page or simply send a forbidden status.
      // We will redirect to a generic error page to avoid giving too much information.
      return res.redirect(`${process.env.BASE_PATH}/error/generic`);
    }

    // If not banned, proceed to the next middleware or route handler.
    return next();
  } catch (error) {
    console.error('Error during GeoIP check:', error);
    // In case of an error with the GeoIP service,
    // you might want to decide whether to block the request or allow it.
    // For this implementation, we will allow it to avoid blocking legitimate users
    // if the service fails.
    return next();
  }
};
