import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';


@Injectable()
export class SwitchUserContextGuard implements CanActivateChild {

  constructor(
    private router: Router,
    private authenticationStore: AuthenticationStore
  ) { }

  canActivateChild(_activatedRouteSnapshot: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {    
    const userContext = this.authenticationStore.getUserContextInfo();   

    if (!userContext) {
      this.router.navigate(['/switch-user-context']);
    }

    return of(true);
  }

}
