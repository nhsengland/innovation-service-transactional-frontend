import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';

import { InnovationSectionEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { SupportLogType } from '@modules/shared/services/innovations.dtos';
@Injectable()
export class AccessorService extends CoreService {

  constructor() { super(); }


  createAction(innovationId: string, body: { section: InnovationSectionEnum, description: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/actions').setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  saveSupportStatus(
    innovationId: string,
    body: { status: InnovationSupportStatusEnum, message: string, accessors?: { id: string, organisationUnitUserId: string }[] },
    supportId?: string
  ): Observable<{ id: string }> {

    // If NOT enganging, the endpoint won't accept an accessors key.
    if (body.status !== InnovationSupportStatusEnum.ENGAGING) {
      delete body.accessors;
    }

    if (!supportId) {

      const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/supports').setPathParams({ innovationId });
      return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

    } else {

      const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/supports/:supportId').setPathParams({ innovationId, supportId });
      return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

    }

  }

  suggestNewOrganisations(innovationId: string, body: { organisationUnits: string[], type: SupportLogType, description: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/support-logs').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  createExportRequest(innovationId: string, body: { requestReason: string }) {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/export-requests').setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

}
