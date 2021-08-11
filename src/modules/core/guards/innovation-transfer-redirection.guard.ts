import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// import { Response } from 'express';
// import { RESPONSE } from '@nguniversal/express-engine/tokens';

// import { AuthenticationStore } from '../../stores';
import { LoggerService, Severity } from '../services/logger.service';
import { InnovationService } from '../services/innovation.service';

@Injectable()
export class InnovationTransferRedirectionGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    // @Optional() @Inject(RESPONSE) private serverResponse: Response,
    // private authentication: AuthenticationStore,
    private innovationService: InnovationService,
    private loggerService: LoggerService
  ) { }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<boolean> {

    return of(true);

    // const transferId = activatedRouteSnapshot.params.id;

    // return this.innovationService.getInnovationTransfer(transferId).pipe(
    //   map(response => {

    //     // se user exists.
    //     localStorage.setItem(`transfer-${transferId}`, response.userExists.toString());

    //     return false;

    //   }),
    //   catchError(() => {

    //     // AQUI já não é valido.
    //     const redirectUrl = '/transactional/signin';

    //     if (isPlatformBrowser(this.platformId)) {
    //       window.location.assign(redirectUrl); // Full reload is needed to hit SSR.
    //       // return of(false);
    //     }

    //     return of(false);

    //   })
    // );

  }

}
