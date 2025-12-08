import { Request } from 'express';

export function getClientIp(req: Request): string {
  let clientIp = '8.8.8.8'; // Default fallback IP

  console.log('Extracting client IP from request', JSON.stringify({ ip: req.ip, h: req.headers }));
  // In Express, req.ip is usually sufficient if 'trust proxy' is set correctly.
  // However, to mirror the backend logic, we'll inspect 'x-forwarded-for'.
  const xffHeader = req.headers['x-forwarded-for'];

  if (xffHeader) {
    const addresses = Array.isArray(xffHeader) ? xffHeader : xffHeader.split(',');
    const firstIp = addresses[0]?.trim();
    if (firstIp) {
      clientIp = firstIp;
    }
  } else if (req.ip) {
    clientIp = req.ip;
  }

  // Handle local testing IPs
  if (clientIp === '::1' || clientIp === '127.0.0.1') {
    clientIp = '8.8.8.8';
  }

  return clientIp;
}
