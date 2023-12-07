import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class ApiInInterceptor implements HttpInterceptor {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // retry(1),
      catchError((error: HttpErrorResponse) => {
        // console.log('APIin', error);

        if (error.status === 401) {
          // If 401 and browser reload the page to fetch a new token from the identity provider.
          if (isPlatformBrowser(this.platformId)) {
            location.reload();
            return EMPTY;
          } else {
            return next.handle(request.clone());
          }
        } else {
          // If error is handled on the subscription itself, this error will be ignored!
          return throwError(() => error);
        }
      })
    );
  }
}
