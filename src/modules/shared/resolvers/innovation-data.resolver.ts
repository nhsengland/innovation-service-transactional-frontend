import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { ContextStore } from '@modules/stores/context/context.store';
import { InnovationsService } from '../services/innovations.service';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { InnovationGroupedStatusEnum, InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';


/**
 * Note: With the creation of the context store, this can be changed to a guard in the future,
 * as it is also assuming that responsibility now (verifying access to the innovation).
 */
@Injectable()
export class InnovationDataResolver implements Resolve<null | { id: string, name: string }> {

  constructor(
    private router: Router,
    private logger: NGXLogger,
    private authenticationStore: AuthenticationStore,
    private contextStore: ContextStore,
    private innovationsService: InnovationsService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<null | { id: string, name: string }> {

    return this.innovationsService.getInnovationInfo(route.params.innovationId).pipe(
      map(response => {

        const userContext = this.authenticationStore.getUserContextInfo();

        let support: undefined | { id: string, status: InnovationSupportStatusEnum, organisationUnitId: string };

        if (this.authenticationStore.isAccessorType()) {
          support = (response.supports || []).find(item => item.organisationUnitId === userContext?.organisationUnit?.id);
        }

        this.contextStore.setInnovation({
          id: response.id,
          name: response.name,
          status: response.groupedStatus === InnovationGroupedStatusEnum.AWAITING_NEEDS_REASSESSMENT ? InnovationStatusEnum.AWAITING_NEEDS_REASSESSMENT : response.status,
          statusUpdatedAt: response.statusUpdatedAt,
          ...(response.owner ? {owner: { isActive: response.owner.isActive, name: response.owner.name}} : {}),
          loggedUser: { isOwner: response.owner ? response.owner?.id === userContext?.id : false },
          ...(response.assessment ? { assessment: { id: response.assessment.id } } : {}),
          ...(response.assessment?.assignedTo ? { assignedTo: { id: response.assessment.assignedTo?.id } } : {}),
          ...(support ? { support: { id: support.id, status: support.status } } : {}),
          export: response.export,
          collaboratorId: response.collaboratorId ? response.collaboratorId : undefined
        });

        return {
          id: response.id,
          name: response.name
        };

      }),
      catchError(error => {

        this.contextStore.clearInnovation();
        this.router.navigateByUrl('error/forbidden-innovation');

        this.logger.error('Error fetching data innovation data', error);
        return of(null);

      })

    );

  }

}
