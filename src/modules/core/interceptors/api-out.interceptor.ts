import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';

@Injectable()
export class ApiOutInterceptor implements HttpInterceptor {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(REQUEST) private serverRequest: Request
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (isPlatformServer(this.platformId)) {

      request = request.clone({
        withCredentials: true,
        setHeaders: { Cookie: this.serverRequest.headers.cookie || '' }
      });

    } else {

      request = request.clone();

    }

    return next.handle(request);

  }

}
