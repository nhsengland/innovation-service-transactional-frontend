import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { CtxStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

@Injectable()
export class ShareInnovationRecordGuard {
  constructor(
    private router: Router,
    private innovationsService: InnovationsService,
    private ctx: CtxStore
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const innovationId = route.params.innovationId;

    return forkJoin([
      this.innovationsService.getInnovationInfo(innovationId),
      this.ctx.innovation.getSectionsSummary$(innovationId)
    ]).pipe(
      map(([innovation, sections]) => {
        const allSectionsSubmitted = sections.reduce(
          (acc: boolean, item) => acc && item.sections.every(section => section.status === 'SUBMITTED'),
          true
        );

        if (
          allSectionsSubmitted &&
          (innovation.status === InnovationStatusEnum.CREATED ||
            (innovation.status === InnovationStatusEnum.ARCHIVED && !innovation.assessment))
        ) {
          return true;
        } else {
          this.router.navigateByUrl(`innovator/innovations/${innovationId}/record`);
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
