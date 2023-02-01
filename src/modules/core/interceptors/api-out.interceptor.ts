import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { AuthenticationStore } from '@modules/stores';
import { UserRoleEnum } from '@app/base/enums';

@Injectable()
export class ApiOutInterceptor implements HttpInterceptor {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(REQUEST) private serverRequest: Request,    
    private authentication: AuthenticationStore
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userContext = this.authentication.getUserContextInfo();

    if (isPlatformServer(this.platformId)) {
      request = request.clone({
        withCredentials: true,
        setHeaders: { 
          Cookie: this.serverRequest.headers.cookie || '',  
          'x-is-domain-context': JSON.stringify({
            user: {
              type: userContext.type,
              organisationId: userContext.organisation?.id,
              organisationUnitId: userContext.organisation?.organisationUnit.id
            }
          }),
        }
      });
    } else {
      request = request.clone({
        setHeaders: {
          'x-is-domain-context': JSON.stringify({
            user: {
              type: userContext.type,
              organisationId: userContext.organisation?.id,
              organisationUnitId: userContext.organisation?.organisationUnit.id
            }
          }),
        }
      });
    }

    return next.handle(request);

  }

}
