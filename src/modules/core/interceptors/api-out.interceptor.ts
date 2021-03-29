import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Request, Response } from 'express';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

@Injectable()
export class ApiOutInterceptor implements HttpInterceptor {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(REQUEST) private serverRequest: Request,
    // @Optional() @Inject(RESPONSE) private serverResponse: Response,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // request = request.clone({ withCredentials: true });



    if (!isPlatformBrowser(this.platformId)) {

      // const requestCookie = this.serverRequest?.headers.cookie || '';
      // const sessionToken = requestCookie.split(' ').find((x) => (x.startsWith('connect.sid')))?.substr(16, 32) || '';

      // this.requestNew = this.serverRequest.clone({ withCredentials: true });
      // this.requestNew.url = request.url;

      // console.log('INTERCEPTOR', sessionToken);
      // const requestCookie = this.serverRequest?.headers.cookie || '';

      request = request.clone(
        {
          withCredentials: true,
          //   setHeaders: {
          //     'x-session-id': requestCookie
          //  }
          // headers: request.headers.set('sessionToken', sessionToken)
        });
      // }
      // request.headers.set('Cookie', requestCookie);
      // request.headers.append('Cookie', requestCookie)
    }

    return next.handle(request);

  }

}
