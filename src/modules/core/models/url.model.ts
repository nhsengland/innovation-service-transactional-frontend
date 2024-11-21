export class UrlModel {
  private protocol: 'http' | 'https';
  private host: string;
  private port: number | null;
  private path: string;
  private pathParams: Record<string, string | number>;
  private queryParams: Record<string, any>;
  private pathParams: Record<string, string | number>;
  private queryParams: Record<string, any>;

  constructor(url?: string) {
    this.protocol = 'http';
    this.host = '';
    this.port = null;
    this.path = '';
    this.pathParams = {};
    this.queryParams = {};

    if (url) {
      this.parseUrl(url);
    }

    return this;
  }

  private clearStartAndEndSlashes(s: string): string {
    return !s ? s : s.replace(/(^\/+|\/+$)/g, '');
  }

  private parseUrl(s: string): void {
    try {
      const url = new URL(s);
      this.setProtocol(url.protocol);
      this.setHost(url.hostname);
      this.port = parseInt(url.port, 10) || null; // if parseInt = NaN, keeps null.
      this.path = decodeURI(this.clearStartAndEndSlashes(url.pathname));

      // Try to parse QueryParams and find each ones type, defaulting mainly to string.
      this.queryParams = url.search
        ? JSON.parse(
            '{"' +
              decodeURIComponent(url.search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"')
                .replace('?', '') +
              '"}'
          )
        : {};
      Object.entries(this.queryParams).forEach(([key, value]) => {
        if ((value as string).charAt(0) === '{') {
          // If it is possibly an object
          try {
            this.queryParams[key] = JSON.parse(value) as Record<string, any>;
          } catch {
            console.error(`Error parsing queryParam ${key} with value ${value}`);
          }
        } else {
          this.queryParams[key] = value;
        }
      });
    } catch {
      console.error(`Error parsing URL: ${s}`);
    }
  }

  setProtocol(protocol: string): UrlModel {
    protocol = protocol.replace(/[^a-zA-Z]+/g, '').toLowerCase(); // Removes /: chars, keeping only letters.

    if (['http', 'https'].includes(protocol)) {
      this.protocol = protocol as 'http' | 'https';
    }

    return this;
  }

  setHost(host: string): UrlModel {
    this.host = this.clearStartAndEndSlashes(host);
    return this;
  }

  setPort(port: number): UrlModel {
    this.port = port;
    return this;
  }

  setPath(path: string): UrlModel {
    this.path = this.clearStartAndEndSlashes(path);
    return this;
  }
  addPath(path: string): UrlModel {
    this.path = `${this.path ? this.path + '/' : ''}${this.clearStartAndEndSlashes(path)}`;
    return this;
  }

  setPathParams(params: Record<string, string | number>): UrlModel {
    this.pathParams = params;
    return this;
  }

  setQueryParams(queryParams: Record<string, any>): UrlModel {
    this.queryParams = queryParams;
    return this;
  }

  buildUrl(): string {
    // Replace pathParams.
    for (const [key, value] of Object.entries(this.pathParams)) {
      this.path = this.path.replace(`:${key}`, value as string);
    }

    // Apply queryParams.
    let queryParams = '';
    queryParams = Object.keys(this.queryParams)
      .filter(key => this.queryParams[key] !== undefined)
      .map(key => {
        let value: string;

        if (Array.isArray(this.queryParams[key])) {
          // When queryParam is an array.
          value = (this.queryParams[key] as any[])
            .map(qp => (typeof qp === 'object' ? JSON.stringify(qp) : qp))
            .join(',');
        } else if (typeof this.queryParams[key] === 'object') {
          value = JSON.stringify(this.queryParams[key]);
        } // When queryParam is an object.
        else {
          value = encodeURIComponent(this.queryParams[key]);
        }

        return `${key}=${value}`;
      })
      .join('&');
    queryParams = (queryParams ? '?' : '') + queryParams;

    return encodeURI(
      this.protocol +
        '://' +
        this.host +
        (this.port ? ':' + this.port : '') +
        (this.path ? '/' + this.path : '') +
        queryParams
    );
  }
}
