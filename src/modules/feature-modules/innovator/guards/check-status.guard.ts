import { inject } from '@angular/core';
import { ContextService, ContextStore } from '@modules/stores';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { InnovationStatusEnum } from '@modules/stores/innovation';
// import { InnovationDataResolver } from '@modules/shared/resolvers/innovation-data.resolver';
import { map } from 'rxjs/operators';

export function checkStatusGuard(statusList: InnovationStatusEnum[], allowList: boolean = true): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const context: ContextStore = inject(ContextStore);
    const router: Router = inject(Router);
    const contextService: ContextService = inject(ContextService);

    return contextService.setInnovationContext(route.params.innovationId, context).pipe(
      map(() => {
        const allowStatusCheck = allowList
          ? statusList.includes(context.getInnovation().status)
          : !statusList.includes(context.getInnovation().status);

        if (allowStatusCheck) {
          return true;
        } else {
          router.navigateByUrl('error/forbidden-innovation');
          return false;
        }
      })
    );

    // const innovationDataResolver: InnovationDataResolver = inject(InnovationDataResolver);

    // return innovationDataResolver.resolve(route).pipe(
    //   map(() => {
    //     if (allowStatus) {
    //       return true;
    //     } else {
    //       router.navigateByUrl('error/forbidden-innovation');
    //       return false;
    //     }
    //   })
    // );
  };
}
