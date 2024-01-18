import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable()
export class NewInnovationForbiddenPageGuard {
  constructor(
    private router: Router,
    private innovationsService: InnovationsService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const innovationId = route.params.innovationId;

    return this.innovationsService.getInnovationInfo(innovationId).pipe(
      map((innovation: { status: string }) => {
        if (innovation.status !== 'CREATED') {
          return true;
        } else {
          this.router.navigateByUrl('error/forbidden-innovation');
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
