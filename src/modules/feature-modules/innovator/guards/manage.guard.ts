import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';

import { AuthenticationStore } from '@modules/stores';
import { InnovationsService } from '@modules/shared/services/innovations.service';


@Injectable()
export class ManageGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationStore: AuthenticationStore,
    private innovationsService: InnovationsService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    // TODO: To be able to access innovation info on contextStore, it could make sense to change
    // all resolvers to guards, as they store information on stores, and do not need to return data to routing.
    // For now, it must be like this as guards run always before resolvers on refresh (even if on children like this one)
    return this.innovationsService.getInnovationInfo(route.params.innovationId).pipe(
      map(response => {

        const userContext = this.authenticationStore.getUserContextInfo();
        const loggedUser = { isOwner: response.owner ? response.owner.id === userContext?.id : false };

        if (state.url.includes("manage/innovation")) {
          if (loggedUser.isOwner) {
            return true;
          }
          else {
            this.router.navigateByUrl('error/forbidden-manage-innovation-resources');
            return false;
          }
        }
        else if (state.url.includes("manage/access")) {
          if (!loggedUser.isOwner) {
            return true;
          }
          else {
            this.router.navigateByUrl('error/forbidden-manage-access');
            return false;
          }
        }
        else {
          return false;
        }
      }),
      catchError(() => {
        this.router.navigateByUrl('error/generic');
        return of(false);
      })
    );

  }
}
