import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, Observable, of } from 'rxjs';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { LocalStorageHelper } from '@app/base/helpers';


@Injectable()
export class SwitchUserContextGuard implements CanActivate, CanActivateChild {
  notActivate: boolean = false;

  constructor(
    private router: Router,
    private authenticationStore: AuthenticationStore
  ) { 
    router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event) => {
      const navigate = (event as NavigationEnd);
      this.notActivate = navigate.url === navigate.urlAfterRedirects;
    });

  }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    if (window) {
      const url = window.location.pathname;
      return !url.includes('switch-user-context');
    }

    return this.notActivate;
  }

  canActivateChild(_activatedRouteSnapshot: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {    
    const userContext = this.authenticationStore.getUserContextInfo();   
    const currentOrgUnitId = LocalStorageHelper.getObjectItem("orgUnitId");

    if (userContext.type === '' && !currentOrgUnitId) {
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
