import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UrlModel } from '@modules/core/models/url.model';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';

import { AuthenticationModel } from '@modules/stores/authentication/authentication.models';
import { UserRoleEnum } from '@app/base/enums';
import { InnovationInfoDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { InnovationGroupedStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { ContextInnovationType } from './innovation-context.types';

@Injectable()
export class InnovationContextService {
  private API_INNOVATIONS_URL = this.envVariablesStore.API_INNOVATIONS_URL;

  constructor(
    private http: HttpClient,
    private envVariablesStore: EnvironmentVariablesStore
  ) {}

  // TODO: Think about having an endpoint on BE that contains this logic.
  getContextInfo(
    innovationId: string,
    userContext: AuthenticationModel['userContext']
  ): Observable<ContextInnovationType> {
    const qp: { fields: ('assessment' | 'supports')[] } = { fields: [] };

    switch (userContext?.type) {
      case UserRoleEnum.ASSESSMENT:
        qp.fields = ['assessment'];
        break;
      case UserRoleEnum.INNOVATOR:
      case UserRoleEnum.ACCESSOR:
      case UserRoleEnum.QUALIFYING_ACCESSOR:
      case UserRoleEnum.ADMIN:
        qp.fields = ['assessment', 'supports'];
        break;
      default:
        break;
    }

    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId')
      .setPathParams({ innovationId })
      .setQueryParams(qp);
    return this.http.get<InnovationInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => {
        let support: undefined | { id: string; status: InnovationSupportStatusEnum; organisationUnitId: string };

        if (userContext?.type === UserRoleEnum.ACCESSOR || userContext?.type === UserRoleEnum.QUALIFYING_ACCESSOR) {
          support = (response.supports ?? []).find(
            item => item.organisationUnitId === userContext?.organisationUnit?.id
          );
        }

        return {
          id: response.id,
          name: response.name,
          status:
            response.groupedStatus === InnovationGroupedStatusEnum.AWAITING_NEEDS_REASSESSMENT
              ? InnovationStatusEnum.AWAITING_NEEDS_REASSESSMENT
              : response.status,
          statusUpdatedAt: response.statusUpdatedAt,
          hasBeenAssessed: response.hasBeenAssessed,
          archivedStatus: response.archivedStatus,
          ...(response.owner
            ? {
                owner: {
                  isActive: response.owner.isActive,
                  name: response.owner.name,
                  organisation: response.owner.organisation
                }
              }
            : {}),
          loggedUser: { isOwner: response.owner ? response.owner?.id === userContext?.id : false },
          ...(response.assessment
            ? {
                assessment: {
                  id: response.assessment.id,
                  currentMajorAssessmentId: response.assessment.currentMajorAssessmentId,
                  majorVersion: response.assessment.majorVersion,
                  minorVersion: response.assessment.minorVersion,
                  createdAt: response.assessment.createdAt,
                  finishedAt: response.assessment.finishedAt
                }
              }
            : {}),
          ...(response.assessment?.assignedTo
            ? {
                assignedTo: {
                  id: response.assessment.assignedTo.id,
                  userRoleId: response.assessment.assignedTo.userRoleId,
                  name: response.assessment.assignedTo.name
                }
              }
            : {}),
          ...(support ? { support: { id: support.id, status: support.status } } : {}),
          collaboratorId: response.collaboratorId ? response.collaboratorId : undefined,
          createdAt: response.createdAt,
          categories: response.categories,
          otherCategoryDescription: response.otherCategoryDescription,
          countryName: response.countryName,
          description: response.description,
          postCode: response.postCode,
          expiryAt: Date.now() + 10000
        };
      })
    );
  }
}
