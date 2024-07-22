import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { ContextStore } from '@modules/stores/context/context.store';

/**
 * Note: With the creation of the context store, this can be changed to a guard in the future,
 * as it is also assuming that responsibility now (verifying access to the innovation).
 */
@Injectable()
export class InnovationDataResolver {
  constructor(
    private router: Router,
    private logger: NGXLogger,
    private authenticationStore: AuthenticationStore,
    private contextStore: ContextStore
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<null | { id: string; name: string }> {
    return this.contextStore
      .getOrLoadInnovation(route.params.innovationId, this.authenticationStore.getUserContextInfo())
      .pipe(
        map(response => {
          return { id: response.id, name: response.name };
        }),
        catchError(error => {
          this.contextStore.clearInnovation();
          this.router.navigateByUrl('error/forbidden-innovation');

          this.logger.error('Error fetching data innovation data', error);
          return of(null);
        })
      );
  }
}
