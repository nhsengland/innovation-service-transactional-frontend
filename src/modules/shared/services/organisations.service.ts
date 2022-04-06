import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { AlertType, MappedObject, UrlModel } from '@modules/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';


export type getAccessorsOrganisationsDTO = {
  id: string;
  name: string;
};

export type getOrganisationUnitsDTO = {
  id: string;
  name: string;
  acronym: string;
  organisationUnits: {
    id: string;
    name: string;
    acronym: string;
  }[];
};

export type getOrganisationDTO = {
  id: string;
  name: string;
  acronym: string;
  organisationUnits: {
    id: string;
    name: string;
    acronym: string;
  }[];
};

export type updateOrganisationDTO = {
  id: string;
  status: string;
  error?: string;
};

export type organisationUsersInDTO = {
  id: string;
  name: string;
  role: 'ACCESSOR' | 'QUALIFYING_ACCESSOR';
};

export type organisationUsersOutDTO = Omit<organisationUsersInDTO, 'role'> & {
  id: string;
  name: string;
  role: 'ACCESSOR' | 'QUALIFYING_ACCESSOR';
  roleDescription: string;
};

// export type getOrganisationUnitsInDTO = {
//   id: string;
//   name: string;
//   acronym: string;
//   organisationUnits: {
//     id: string;
//     name: string;
//     acronym: string;
//     unitUsers: {
//       displayName: string;
//       id: string;
//       role: 'ADMIN' | 'INNOVATOR_OWNER' | 'ASSESSMENT' | 'INNOVATOR' | 'ACCESSOR' | 'QUALIFYING_ACCESSOR';
//     }[];
//   }[];
// };
// export type getOrganisationUnitsOutDTO = Omit<getOrganisationUnitsInDTO, 'organisationUnits'> & {
//   id: string;
//   name: string;
//   acronym: string;
//   organisationUnits: {
//     id: string;
//     name: string;
//     acronym: string;
//     unitUsers: {
//       displayName: string;
//       id: string;
//       role: 'ADMIN' | 'INNOVATOR_OWNER' | 'ASSESSMENT' | 'INNOVATOR' | 'ACCESSOR' | 'QUALIFYING_ACCESSOR';
//       roleDescription: string;
//     }[];
//   }[]
// };


@Injectable()
export class OrganisationsService extends CoreService {

  constructor() { super(); }

  getAccessorsOrganisations(): Observable<getAccessorsOrganisationsDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisations').setQueryParams({ type: 'ACCESSOR' });
    return this.http.get<getAccessorsOrganisationsDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getOrganisationUnits(): Observable<getOrganisationUnitsDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisation-units');
    return this.http.get<getOrganisationUnitsDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getOrganisation(orgId: string): Observable<getOrganisationDTO> {

    const url = new UrlModel(this.API_URL).addPath('organisations/:orgId').setPathParams({ orgId });
    return this.http.get<getOrganisationDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  updateOrganisation(body: MappedObject, orgId: string): Observable<updateOrganisationDTO> {

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisation/:orgId').setPathParams({ orgId });
    return this.http.patch<updateOrganisationDTO>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  updateUnit(body: MappedObject, organisationUnitId: string): Observable<updateOrganisationDTO> {

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisation-units/:organisationUnitId').setPathParams({ organisationUnitId });
    return this.http.patch<updateOrganisationDTO>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  getUsersByUnitId(organisationUnitId: string): Observable<organisationUsersOutDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisations/:organisationUnitId/users').setPathParams({ organisationUnitId });
    return this.http.get<organisationUsersInDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(user => ({ ...user, roleDescription: this.stores.authentication.getRoleDescription(user.role) })))
    );

  }

  // Validators.
  orgnisationAcronymValidator(organisationId: string): AsyncValidatorFn {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      const url = new UrlModel(this.API_URL).addPath('user-admin/organisation-acronym').setQueryParams({ organisationId, acronym: control.value });
      return this.http.head(url.buildUrl()).pipe(
        take(1),
        map(() => ({ customError: true, message: 'Acronym already exist' })),
        catchError(() => of(null))
      );

    };
  }

}
