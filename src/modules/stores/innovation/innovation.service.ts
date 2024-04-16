import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { UrlModel } from '@modules/core/models/url.model';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';

import {
  GetInnovationEvidenceDTO,
  INNOVATION_STATUS,
  InnovationAllSectionsInfoDTO,
  InnovationQASuggestionType,
  InnovationSectionInfoDTO,
  InnovationSectionsListDTO,
  OrganisationSuggestionModel
} from './innovation.models';

@Injectable()
export class InnovationService {
  private API_INNOVATIONS_URL = this.envVariablesStore.API_INNOVATIONS_URL;

  constructor(
    private http: HttpClient,
    private authenticationStore: AuthenticationStore,
    private envVariablesStore: EnvironmentVariablesStore
  ) {}

  submitInnovation(innovationId: string): Observable<{ id: string; status: keyof typeof INNOVATION_STATUS }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/submit')
      .setPathParams({ innovationId });
    return this.http.patch<{ id: string; status: keyof typeof INNOVATION_STATUS }>(url.buildUrl(), {}).pipe(
      take(1),
      map(response => response)
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
      .setPathParams({ userId: this.authenticationStore.getUserId(), innovationId, sectionKey });
    return this.http.put<MappedObjectType>(url.buildUrl(), data).pipe(
      take(1),
      map(response => response)
    );
  }

  submitSections(innovationId: string, sectionKey: string): Observable<any> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/sections/:sectionKey/submit')
      .setPathParams({ userId: this.authenticationStore.getUserId(), innovationId, sectionKey });
    return this.http.patch<any>(url.buildUrl(), { sectionKey }).pipe(
      take(1),
      map(response => response)
    );
  }

  getSectionEvidenceInfo(innovationId: string, evidenceId: string): Observable<GetInnovationEvidenceDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/evidences/:evidenceId')
      .setPathParams({ innovationId, evidenceId });
    return this.http.get<GetInnovationEvidenceDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
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
      return this.http.post<{ id: string }>(url.buildUrl(), data).pipe(
        take(1),
        map(response => response)
      );
    }
  }

  deleteEvidence(innovationId: string, evidenceId: string): Observable<void> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/evidence/:evidenceId')
      .setPathParams({ innovationId, evidenceId });
    return this.http.delete<void>(url.buildUrl()).pipe(take(1));
  }

  getInnovationOrganisationSuggestions(innovationId: string): Observable<OrganisationSuggestionModel> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/suggestions')
      .setPathParams({ innovationId });
    return this.http.get<OrganisationSuggestionModel>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationQASuggestions(innovationId: string): Observable<InnovationQASuggestionType> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/qa-suggestions-info')
      .setPathParams({ innovationId });
    return this.http.get<InnovationQASuggestionType>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }
}
