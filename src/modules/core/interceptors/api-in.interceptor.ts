import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable()
export class ApiInInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      // retry(1),
      catchError((error: HttpErrorResponse) => {

        // console.log('APIin', error);

        if (error.status === 401) {
          return next.handle(request.clone());
        } else {

          // If error is handled on the subscription itself, this error will be ignored!
          return throwError(() => error);

        }

      })
    );

  }

}
