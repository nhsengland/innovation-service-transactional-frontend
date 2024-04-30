import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { ContextStore } from '@modules/stores/context/context.store';
import { InnovationsService } from '../services/innovations.service';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { InnovationGroupedStatusEnum, InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';

/**
 * Note: With the creation of the context store, this can be changed to a guard in the future,
 * as it is also assuming that responsibility now (verifying access to the innovation).
 */

export const innovationDataResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
): Observable<null | { id: string; name: string }> => {
  const router: Router = inject(Router);
  const logger: NGXLogger = inject(NGXLogger);
  const authenticationStore: AuthenticationStore = inject(AuthenticationStore);
  const contextStore: ContextStore = inject(ContextStore);

  return contextStore.getOrLoadInnovation(route.params.innovationId, authenticationStore.getUserContextInfo()).pipe(
    map(response => {
      return { id: response.id, name: response.name };
    }),
    catchError(error => {
      contextStore.clearInnovation();
      router.navigateByUrl('error/forbidden-innovation');

      logger.error('Error fetching data innovation data', error);
      return of(null);
    })
  );
};
