import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRoleEnum } from '@app/base/enums';
import { AuthenticationService, AuthenticationStore } from '@modules/stores';

export function checkRoleGuard(roles: UserRoleEnum[]): CanActivateFn {
  return () => {
    const router: Router = inject(Router);
    const authenticationStore: AuthenticationStore = inject(AuthenticationStore);

    const userType: UserRoleEnum | undefined = authenticationStore.getUserType();

    if (userType !== undefined && roles.includes(userType)) {
      return true;
    } else {
      router.navigateByUrl('error/forbidden-innovation');
      return false;
    }
  };
}
