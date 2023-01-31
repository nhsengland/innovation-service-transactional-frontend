import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { ContextStore } from '@modules/stores/context/context.store';
import { InnovationsService } from '../services/innovations.service';

import { UserRoleEnum } from '@app/base/enums';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';


/**
 * Note: With the creation of the environment store, this can be changed to a guard in the future,
 * as it is also assuming that responsability now (verifying access to the innovation).
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

        if (userContext.type === UserRoleEnum.ACCESSOR) {
          support = (response.supports || []).find(item => item.organisationUnitId === userContext.organisation?.organisationUnit.id);
          if (!support) {
            console.error('Accessor user type without unit id');
          }
        }

        this.contextStore.setInnovation({
          id: response.id,
          name: response.name,
          status: response.status,
          owner: { isActive: response.owner.isActive, name: response.owner.name },
          ...(response.assessment ? { assessment: { id: response.assessment.id } } : {}),
          ...(response.assessment?.assignedTo ? { assignedTo: { id: response.assessment.assignedTo?.id } } : {}),
          ...(support ? { support: { id: support.id, status: support.status } } : {}),
          export: response.export,
        });

        return {
          id: response.id,
          name: response.name
        };

      }),
      catchError(error => {

        this.contextStore.clearInnovation();
        this.router.navigateByUrl('error/forbidden-innovation');

        /* istanbul ignore next */
        this.logger.error('Error fetching data innovation data', error);
        /* istanbul ignore next */
        return of(null);

      })

    );

  }

}
