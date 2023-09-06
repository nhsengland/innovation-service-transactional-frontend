import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { SupportLogType } from '@modules/shared/services/innovations.dtos';
@Injectable()
export class AccessorService extends CoreService {

  constructor() { super(); }

  saveSupportStatus(
    innovationId: string,
    body: { status: InnovationSupportStatusEnum, message: string, accessors?: { id: string, userRoleId: string }[] },
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

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/support-logs').setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  requestSupportStatusChage(innovationId: string, supportId: string, body: { status: InnovationSupportStatusEnum, message: string }): Observable<{success: boolean}> {
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/supports/:supportId/change-request').setPathParams({ innovationId, supportId });
    return this.http.post<{ success: boolean }>(url.buildUrl(), body).pipe(take(1), map(response => response));
  }

}
