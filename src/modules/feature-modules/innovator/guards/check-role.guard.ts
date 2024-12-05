import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRoleEnum } from '@app/base/enums';
import { CtxStore } from '@modules/stores';

export function checkRoleGuard(roles: UserRoleEnum[]): CanActivateFn {
  return () => {
    const router: Router = inject(Router);
    const ctx: CtxStore = inject(CtxStore);

    const userType: UserRoleEnum | undefined = ctx.user.getUserType();

    if (userType !== undefined && roles.includes(userType)) {
      return true;
    } else {
      router.navigateByUrl('error/forbidden-innovation');
      return false;
    }
  };
}
