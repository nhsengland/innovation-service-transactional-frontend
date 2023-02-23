import { isPlatformServer } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationStore } from '@modules/stores';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';

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
          ...userContext && { 
            'x-is-role': userContext.roleId,
            'x-is-domain-context': JSON.stringify({user: {
              role: userContext.type,
              organisationId: userContext.organisation?.id,
              organisationUnitId: userContext.organisation?.organisationUnit?.id
            }})
          },
        }
      });
    } else {
      request = request.clone({
        setHeaders: {
          ...userContext && { 
            'x-is-role': userContext.roleId,
            'x-is-domain-context': JSON.stringify({user: {
              role: userContext.type,
              organisationId: userContext.organisation?.id,
              organisationUnitId: userContext.organisation?.organisationUnit?.id
            }})
          },
        }
      });
    }

    return next.handle(request);

  }

}
