import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { MappedObject, UrlModel } from '@modules/core';
import { InnovationSectionsIds, INNOVATION_SECTION_ACTION_STATUS, INNOVATION_STATUS, INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';


type getInnovationActionsListEndpointInDTO = {
  id: string;
  displayId: string;
  status: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
  section: InnovationSectionsIds;
  createdAt: string; // '2021-04-16T09:23:49.396Z',
};

export type getInnovationInfoEndpointDTO = {
  summary: {
    id: string;
    name: string;
    status: keyof typeof INNOVATION_STATUS;
    description: string;
    company: string;
    countryName: string;
    postCode: string;
    categories: string[];
    otherCategoryDescription: null | string;
  };
  contact: {
    name: string;
  };
  assessment?: {
    id: string;
  };
  support?: {
    id: string;
    status: keyof typeof INNOVATION_SUPPORT_STATUS;
  }
};

export type getInnovationActionInfoInDTO = {
  id: string;
  displayId: string;
  status: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
  description: string;
  section: InnovationSectionsIds;
  createdAt: string; // '2021-04-16T09:23:49.396Z',
  createdBy: { id: string; name: string; };
};
export type getInnovationActionInfoOutDTO = Omit<getInnovationActionInfoInDTO, 'createdBy'> & { name: string, createdBy: string };

export type getInnovationActionsListEndpointOutDTO = {
  openedActions: (getInnovationActionsListEndpointInDTO & { name: string })[];
  closedActions: (getInnovationActionsListEndpointInDTO & { name: string })[];
};

@Injectable()
export class InnovatorService extends CoreService {

  constructor() { super(); }

  submitFirstTimeSigninInfo(data: { [key: string]: any }): Observable<string> {

    const body = {
      actionType: 'first_time_signin',
      user: {
        displayName: data.innovatorName
      },
      innovation: {
        name: data.innovationName,
        description: data.innovationDescription,
        countryName: data.locationCountryName || data.location,
        postcode: data.englandPostCode || '',
        organisationShares: data.organisationShares || []
      },
      organisation: data.isCompanyOrOrganisation === 'yes' ? { name: data.organisationName, size: data.organisationSize } : undefined
    };

    const url = new UrlModel(this.API_URL).addPath('innovators');
    return this.http.post<{}>(url.buildUrl(), body).pipe(take(1), map(() => ''));

  }

  getInnovationActionsList(innovationId: string): Observable<getInnovationActionsListEndpointOutDTO> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/actions').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });

    return this.http.get<getInnovationActionsListEndpointInDTO[]>(url.buildUrl()).pipe(
      take(1),
      map( response => {
        return {
          openedActions: response.filter(item => ['REQUESTED', 'STARTED', 'CONTINUE', 'IN_REVIEW'].includes(item.status)).map(item => ({ ...item, ...{ name: `Submit ${this.stores.innovation.getSectionTitle(item.section)}` } })),
          closedActions: response.filter(item => ['DELETED', 'DECLINED', 'COMPLETED'].includes(item.status)).map(item => ({ ...item, ...{ name: `Submit ${this.stores.innovation.getSectionTitle(item.section)}` } })),
        };
      })
    );

  }

  getInnovationActionInfo(innovationId: string, actionId: string): Observable<getInnovationActionInfoOutDTO> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/actions/:actionId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, actionId });
    return this.http.get<getInnovationActionInfoInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        id: response.id,
        displayId: response.displayId,
        status: response.status,
        name: `Submit ${this.stores.innovation.getSectionTitle(response.section)}`,
        description: response.description,
        section: response.section,
        createdAt: response.createdAt,
        createdBy: response.createdBy.name
      }))
    );

  }

  declineAction(innovationId: string, actionId: string, body: MappedObject): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/actions/:actionId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, actionId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  getOrganisations(innovationId: string): Observable<{id: string, status: string}[]> {

    return of([
      {id: '73201F47-37A8-EB11-B566-0003FFD6549F', status: 'ENGAGING'},
      {id: '71201F47-37A8-EB11-B566-0003FFD6549F', status: 'NOT_YET'}
    ]);

    // const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/shares')
    //   .setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });

    // return this.http.get<{id: string, status: string}[]>(url.buildUrl()).pipe(
    //   take(1),
    //   map(response => response)
    // );

  }

  submitOrganisationSharing(innovationId: string, body: MappedObject): Observable<{id: string} > {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/share')
      .setPathParams({userId: this.stores.authentication.getUserId(), innovationId});

    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }


}
