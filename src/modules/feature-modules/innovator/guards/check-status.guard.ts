import { inject } from '@angular/core';
import { AuthenticationStore, InnovationContextStore } from '@modules/stores';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { InnovationStatusEnum } from '@modules/stores/innovation';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export function checkStatusGuard(statusList: InnovationStatusEnum[], blockList: boolean = false): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const router: Router = inject(Router);
    const innovationCtxStore: InnovationContextStore = inject(InnovationContextStore);
    const authenticationStore: AuthenticationStore = inject(AuthenticationStore);

    return innovationCtxStore
      .getOrLoadInnovation(route.params.innovationId, authenticationStore.getUserContextInfo())
      .pipe(
        map(contextInfo => {
          const allowStatusCheck = blockList
            ? !statusList.includes(contextInfo.status)
            : statusList.includes(contextInfo.status);

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
