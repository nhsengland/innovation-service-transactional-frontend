import { inject } from '@angular/core';
import { AuthenticationStore, ContextService } from '@modules/stores';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { InnovationStatusEnum } from '@modules/stores/innovation';
// import { InnovationDataResolver } from '@modules/shared/resolvers/innovation-data.resolver';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export function checkStatusGuard(statusList: InnovationStatusEnum[], allowList: boolean = true): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const router: Router = inject(Router);
    const contextService: ContextService = inject(ContextService);
    const authenticationStore: AuthenticationStore = inject(AuthenticationStore);

    return contextService
      .getInnovationContextInfo(route.params.innovationId, authenticationStore.getUserContextInfo())
      .pipe(
        map(contextInfo => {
          const allowStatusCheck = allowList
            ? statusList.includes(contextInfo.status)
            : !statusList.includes(contextInfo.status);

          if (allowStatusCheck) {
            return true;
          } else {
            router.navigateByUrl('error/forbidden-innovation');
            return false;
          }
        }),
        catchError(() => {
          router.navigateByUrl('error/generic');
          return of(false);
        })
      );
  };
}
