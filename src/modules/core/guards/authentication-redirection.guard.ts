import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { AuthenticationStore } from '../../stores';

@Injectable()
export class AuthenticationRedirectionGuard implements CanActivate {

  constructor(
    private router: Router,
    private authentication: AuthenticationStore
  ) { }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean {

    switch (`${activatedRouteSnapshot.routeConfig?.path} | ${this.authentication.getUserType() || 'NOT_DEFINED'}`) {

      case 'dashboard | NOT_DEFINED':
      case 'accessor | NOT_DEFINED':
      case 'dashboard | INNOVATOR':
      case 'accessor | INNOVATOR':
        this.router.navigateByUrl('innovator');
        return false;

      case 'dashboard | ACCESSOR':
      case 'dashboard | QUALIFYING_ACCESSOR':
      case 'innovator | ACCESSOR':
      case 'innovator | QUALIFYING_ACCESSOR':
        this.router.navigateByUrl('accessor');
        return false;

      default:
        return true;

    }

  }

}
