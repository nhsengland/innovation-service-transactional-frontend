import { isPlatformServer } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { AuthenticationStore } from '@modules/stores';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { REQUEST } from '../../../express.tokens';

import { EnvironmentVariablesStore } from '../stores/environment-variables.store';

@Injectable()
export class ApiOutInterceptor implements HttpInterceptor {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(REQUEST) private serverRequest: Request,
    private authentication: AuthenticationStore,
    private envVariablesStore: EnvironmentVariablesStore,
    private tokenExtractor: HttpXsrfTokenExtractor
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userContext = this.authentication.getUserContextInfo();

    if (isPlatformServer(this.platformId)) {
      request = request.clone({
        withCredentials: true,
        setHeaders: {
          Cookie: this.serverRequest.headers.cookie || '',
          ...(userContext && {
            'x-is-role': userContext.roleId
          })
        }
      });
    } else {
      // We only intercept requests to our API.
      if (request.url.startsWith(this.envVariablesStore.BASE_URL)) {
        const token =
          request.method !== 'GET' &&
          request.method !== 'HEAD' &&
          request.method !== 'OPTIONS' &&
          this.tokenExtractor.getToken();
        request = request.clone({
          setHeaders: {
            ...(userContext && {
              'x-is-role': userContext.roleId
            }),
            ...(token && {
              'X-XSRF-TOKEN': token
            })
          }
        });
      }
    }

    return next.handle(request);
  }
}
