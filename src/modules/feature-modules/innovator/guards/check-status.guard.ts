import { inject } from '@angular/core';
import { CtxStore, InnovationStatusEnum } from '@modules/stores';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export function checkStatusGuard(statusList: InnovationStatusEnum[], blockList = false): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const router: Router = inject(Router);
    const ctx: CtxStore = inject(CtxStore);

    return ctx.innovation.getOrLoadInnovation$(route.params.innovationId, ctx.user.getUserContext()).pipe(
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
