import { Request } from 'express';
import useragent from 'useragent';
import geoip from 'geoip-lite';

export interface DeviceInfo {
  device: string;
  os: string;
  browser: string;
}

export interface LocationInfo {
  location: string;
}

/**
 * Get client IP address from request
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0])
    : req.socket.remoteAddress || req.ip || 'unknown';
  
  // Remove IPv6 prefix if present
  return ip.replace(/^::ffff:/, '');
}

/**
 * Get device, OS, and browser from User-Agent header
 */
export function getDeviceInfo(req: Request): DeviceInfo {
  const userAgent = req.headers['user-agent'] || '';
  const agent = useragent.parse(userAgent);

  return {
    device: agent.device.toString() || 'Unknown Device',
    os: agent.os.toString() || 'Unknown OS',
    browser: agent.toAgent() || 'Unknown Browser',
  };
}

/**
 * Get location from IP address
 */
export function getLocationFromIp(ip: string): LocationInfo {
  try {
    // Skip localhost and private IPs
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return { location: 'Local Network' };
    }

    const geo = geoip.lookup(ip);
    if (geo) {
      const locationParts = [];
      if (geo.city) locationParts.push(geo.city);
      if (geo.region) locationParts.push(geo.region);
      if (geo.country) locationParts.push(geo.country);
      
      return {
        location: locationParts.length > 0 ? locationParts.join(', ') : 'Unknown Location',
      };
    }
  } catch (error) {
    console.error('Error getting location from IP:', error);
  }

  return { location: 'Unknown Location' };
}

