import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { AuthenticationStore } from '@modules/stores';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable()
export class ManageInnovationGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationStore: AuthenticationStore,
    private innovationsService: InnovationsService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Observable<boolean> {

    return this.innovationsService.getInnovationInfo(route.params.innovationId).pipe(
      map(response => {
        const userContext = this.authenticationStore.getUserContextInfo();
        const loggedUser = { isOwner: response.owner.id === userContext?.id };

        if(loggedUser.isOwner) return true;
        else {
          this.router.navigateByUrl('error/forbidden-manage-innovation-resources');
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
