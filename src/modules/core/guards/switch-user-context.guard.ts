import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, Observable, of } from 'rxjs';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { LocalStorageHelper } from '@app/base/helpers';
import { isPlatformBrowser } from '@angular/common';


@Injectable()
export class SwitchUserContextGuard implements CanActivate, CanActivateChild {
  notActivate: boolean = false;

  constructor(    
    @Inject(PLATFORM_ID) private platformId: object,
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
    if (isPlatformBrowser(this.platformId)) {
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
