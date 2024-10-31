import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UrlModel } from '@modules/core/models/url.model';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';

import { AuthenticationModel } from '../../authentication/authentication.models';
import { UserRoleEnum } from '@app/base/enums';
import { InnovationInfoDTO } from '@modules/shared/services/innovations.dtos';
import {
  InnovationGroupedStatusEnum,
  InnovationStatusEnum,
  InnovationSupportStatusEnum
} from '../../innovation/innovation.enums';
import { ContextInnovationType } from './innovation-context.types';
import {
  GetInnovationEvidenceDTO,
  INNOVATION_STATUS,
  InnovationAllSectionsInfoDTO,
  InnovationSectionInfoDTO,
  InnovationSectionsListDTO,
  InnovationUnitSuggestionsType,
  OrganisationSuggestionModel
} from '../../innovation/innovation.models';
import { MappedObjectType } from '@app/base/types';

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

  submitInnovation(innovationId: string): Observable<{ id: string; status: keyof typeof INNOVATION_STATUS }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/submit')
      .setPathParams({ innovationId });
    return this.http.patch<{ id: string; status: keyof typeof INNOVATION_STATUS }>(url.buildUrl(), {}).pipe(
      take(1)
      // finalize(() => this.ctx.innovation.clear()) // TODO: Check this.
    );
  }

  getInnovationSections(innovationId: string): Observable<InnovationSectionsListDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/sections')
      .setPathParams({ innovationId });
    return this.http.get<InnovationSectionsListDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getSectionInfo(
    innovationId: string,
    sectionId: string,
    filters: { fields?: 'tasks'[] }
  ): Observable<InnovationSectionInfoDTO> {
    const qp = {
      ...(filters.fields ? { fields: filters.fields } : {})
    };

    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/sections/:sectionId')
      .setPathParams({ innovationId, sectionId })
      .setQueryParams(qp);
    return this.http.get<InnovationSectionInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getAllSectionsInfo(innovationId: string): Observable<InnovationAllSectionsInfoDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/all-sections')
      .setPathParams({ innovationId });
    return this.http.get<InnovationAllSectionsInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  updateSectionInfo(innovationId: string, sectionKey: string, data: MappedObjectType): Observable<MappedObjectType> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/sections/:sectionKey')
      .setPathParams({ innovationId, sectionKey });
    return this.http.put<MappedObjectType>(url.buildUrl(), data).pipe(take(1));
  }

  submitSections(innovationId: string, sectionKey: string): Observable<any> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/sections/:sectionKey/submit')
      .setPathParams({ innovationId, sectionKey });
    return this.http.patch<any>(url.buildUrl(), { sectionKey }).pipe(take(1));
  }

  getSectionEvidenceInfo(innovationId: string, evidenceId: string): Observable<GetInnovationEvidenceDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/evidences/:evidenceId')
      .setPathParams({ innovationId, evidenceId });
    return this.http.get<GetInnovationEvidenceDTO>(url.buildUrl()).pipe(take(1));
  }

  upsertSectionEvidenceInfo(
    innovationId: string,
    data: MappedObjectType,
    evidenceId?: string
  ): Observable<{ id: string }> {
    if (evidenceId) {
      const url = new UrlModel(this.API_INNOVATIONS_URL)
        .addPath('v1/:innovationId/evidence/:evidenceId')
        .setPathParams({ innovationId, evidenceId });
      return this.http.put<void>(url.buildUrl(), { ...data }).pipe(
        take(1),
        map(() => ({ id: evidenceId }))
      );
    } else {
      const url = new UrlModel(this.API_INNOVATIONS_URL)
        .addPath('v1/:innovationId/evidence')
        .setPathParams({ innovationId });
      return this.http.post<{ id: string }>(url.buildUrl(), data).pipe(take(1));
    }
  }

  deleteEvidence(innovationId: string, evidenceId: string): Observable<void> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/evidence/:evidenceId')
      .setPathParams({ innovationId, evidenceId });
    return this.http.delete<void>(url.buildUrl()).pipe(take(1));
  }

  getInnovationOrganisationSuggestions(
    innovationId: string,
    filters: { majorAssessmentId?: string }
  ): Observable<OrganisationSuggestionModel> {
    const qp = {
      ...(filters.majorAssessmentId ? { majorAssessmentId: filters.majorAssessmentId } : {})
    };

    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/suggestions')
      .setPathParams({ innovationId })
      .setQueryParams(qp);

    return this.http.get<OrganisationSuggestionModel>(url.buildUrl()).pipe(take(1));
  }

  getInnovationQASuggestions(innovationId: string): Observable<InnovationUnitSuggestionsType> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/units-suggestions')
      .setPathParams({ innovationId });
    return this.http.get<InnovationUnitSuggestionsType>(url.buildUrl()).pipe(take(1));
  }
}
