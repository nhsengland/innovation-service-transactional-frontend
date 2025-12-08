import * as maxmind from 'maxmind';
import * as fs from 'fs';
import * as path from 'path';

// Blacklist: ISO 3166-1 alpha-2 codes (e.g., from https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
const BANNED_COUNTRIES = ['VN']; // Vietnam

export class GeoIpService {
  private static instance: GeoIpService;
  private countryLookup: maxmind.Reader<maxmind.CountryResponse> | undefined;

  private constructor() {}

  public static getInstance(): GeoIpService {
    if (!GeoIpService.instance) {
      GeoIpService.instance = new GeoIpService();
    }
    return GeoIpService.instance;
  }

  private async initLookup(): Promise<void> {
    if (!this.countryLookup) {
      try {
        const dbPath = path.resolve(__dirname, 'geoip/GeoLite2-Country.mmdb');
        const dbBuffer = fs.readFileSync(dbPath);
        this.countryLookup = new maxmind.Reader(dbBuffer);
        console.log('GeoIP DB loaded successfully.');
      } catch (err) {
        console.error('Failed to load GeoIP DB:', err);
        // In a production environment, you might want to handle this more gracefully
        // For now, we'll allow the app to run, but geo-blocking will be disabled.
      }
    }
  }

  public async getCountryCode(ip: string): Promise<string> {
    await this.initLookup();
    if (!this.countryLookup) {
      console.warn('GeoIP lookup service not initialized. Returning "ZZ" (unknown).');
      return 'ZZ'; // Unknown
    }

    const result = this.countryLookup.get(ip);
    return result?.country?.iso_code || 'ZZ';
  }

  public async isCountryBanned(ip: string): Promise<boolean> {
    const countryCode = await this.getCountryCode(ip);
    return BANNED_COUNTRIES.includes(countryCode);
  }
}
