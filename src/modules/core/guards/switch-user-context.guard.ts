import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { LocalStorageHelper } from '@app/base/helpers';


@Injectable()
export class SwitchUserContextGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationStore: AuthenticationStore
  ) { }


  canActivate(_activatedRouteSnapshot: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {    
    const userContext = this.authenticationStore.getUserContextInfo();   
    const currentOrgUnitId = LocalStorageHelper.getObjectItem("orgUnitId");

    if (userContext.type === '' && !!!currentOrgUnitId) {
      this.router.navigate(['/switch-user-context']);
      return of(false);
    }

    if (userContext.type === '' && !!currentOrgUnitId) {
      this.authenticationStore.findAndPopulateUserContextFromLocastorage(currentOrgUnitId.id);
      return of(true);
    }
    
    return of(true);
  }
}
