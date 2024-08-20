import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';

export enum ValidationRuleEnum {
  AssessmentUserIsNotTheOnlyOne = 'AssessmentUserIsNotTheOnlyOne',
  LastQualifyingAccessorUserOnOrganisationUnit = 'LastQualifyingAccessorUserOnOrganisationUnit',
  NoInnovationsSupportedOnlyByThisUser = 'NoInnovationsSupportedOnlyByThisUser',
  UserHasAnyAdminRole = 'UserHasAnyAdminRole',
  UserHasAnyInnovatorRole = 'UserHasAnyInnovatorRole',
  UserHasAnyAssessmentRole = 'UserHasAnyAssessmentRole',
  UserHasAnyAccessorRole = 'UserHasAnyAccessorRole',
  UserHasAnyQualifyingAccessorRole = 'UserHasAnyQualifyingAccessorRole',
  UserHasAnyAccessorRoleInOtherOrganisation = 'UserHasAnyAccessorRoleInOtherOrganisation',
  UserAlreadyHasRoleInUnit = 'UserAlreadyHasRoleInUnit',
  OrganisationUnitIsActive = 'OrganisationUnitIsActive',
  UserIsAccessorInAllUnitsOfOrg = 'UserIsAccessorInAllUnitsOfOrg',
  UserCanHaveAssessmentOrAccessorRole = 'UserCanHaveAssessmentOrAccessorRole'
}

export type GetActivateRoleUserRules =
  | ValidationRuleEnum.UserHasAnyAdminRole
  | ValidationRuleEnum.UserHasAnyInnovatorRole
  | ValidationRuleEnum.UserHasAnyAssessmentRole
  | ValidationRuleEnum.UserHasAnyAccessorRole
  | ValidationRuleEnum.UserHasAnyQualifyingAccessorRole
  | ValidationRuleEnum.UserHasAnyAccessorRoleInOtherOrganisation
  | ValidationRuleEnum.OrganisationUnitIsActive
  | ValidationRuleEnum.UserAlreadyHasRoleInUnit;

export type GetInactivateRoleUserRules =
  | ValidationRuleEnum.AssessmentUserIsNotTheOnlyOne
  | ValidationRuleEnum.LastQualifyingAccessorUserOnOrganisationUnit
  | ValidationRuleEnum.NoInnovationsSupportedOnlyByThisUser;

export type CanAddRoleRules =
  | ValidationRuleEnum.UserHasAnyAdminRole
  | ValidationRuleEnum.UserHasAnyInnovatorRole
  | ValidationRuleEnum.UserHasAnyAssessmentRole
  | ValidationRuleEnum.UserHasAnyAccessorRole
  | ValidationRuleEnum.UserHasAnyQualifyingAccessorRole
  | ValidationRuleEnum.UserHasAnyAccessorRoleInOtherOrganisation
  | ValidationRuleEnum.UserAlreadyHasRoleInUnit;

export type CanAddAnyRoleRules =
  | ValidationRuleEnum.UserHasAnyAdminRole
  | ValidationRuleEnum.UserHasAnyInnovatorRole
  | ValidationRuleEnum.UserCanHaveAssessmentOrAccessorRole;

export type ValidationResult<T> = {
  rule: T;
  valid: boolean;
};
export type Validations<T> = { validations: ValidationResult<T>[] };

//#region Deprecated Payloads
export type AdminValidationResponseDTO = {
  validations: {
    rule:
      | 'AssessmentUserIsNotTheOnlyOne'
      | 'LastQualifyingAccessorUserOnOrganisationUnit'
      | 'LastUserOnOrganisationUnit'
      | 'NoInnovationsSupportedOnlyByThisUser';
    valid: boolean;
    data?: {
      supports?: { count: number; innovations: { id: string; name: string }[] };
    };
  }[];
};
export type getLockUserRulesInDTO = {
  validations: {
    operation: string;
    valid: boolean;
    meta?:
      | {
          supports: {
            count: number;
            innovations: { innovationId: string; innovationName: string; unitId: string; unitName: string }[];
          };
        }
      | { organisation: { id: string; name: string } }
      | {};
  }[];
};
export type getLockUserRulesOutDTO = {
  key: string;
  valid: boolean;
  meta: { [key: string]: any };
};
export type getOrganisationRoleRulesOutDTO = {
  key: keyof getOrgnisationRoleRulesInDTO;
  valid: boolean;
  meta: { [key: string]: any };
};
export type getOrgnisationRoleRulesInDTO = {
  lastAccessorUserOnOrganisationUnit: {
    valid: boolean;
    meta?: {
      supports: {
        count: number;
        innovations: { innovationId: string; innovationName: string; unitId: string; unitName: string }[];
      };
    };
  };
};
//#endregion

@Injectable()
export class UsersValidationRulesService extends CoreService {
  constructor() {
    super();
  }

  // TODO: This payloads are not updated with new validations changes
  getAdminOperationUserRules(
    userId: string,
    operation: 'LOCK_USER' | 'DELETE_USER'
  ): Observable<AdminValidationResponseDTO> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/users/:userId/validate')
      .setPathParams({ userId })
      .setQueryParams({ operation });
    return this.http.get<AdminValidationResponseDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  // TODO: This payloads are not updated with new validations changes
  getUserRoleRules(userId: string): Observable<getOrganisationRoleRulesOutDTO[]> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/users/:userId/validate')
      .setPathParams({ userId })
      .setQueryParams({ operation: 'UPDATE_USER_ROLE' });
    return this.http.get<getOrgnisationRoleRulesInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response =>
        Object.entries(response).map(([key, item]) => ({
          key: key as keyof getOrgnisationRoleRulesInDTO,
          valid: item.valid,
          meta: item.meta || {}
        }))
      )
    );
  }

  getActivateRoleUserRules(userId: string, userRoleId: string): Observable<Validations<GetActivateRoleUserRules>> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/users/:userId/validate')
      .setPathParams({ userId })
      .setQueryParams({ operation: 'ACTIVATE_USER_ROLE', roleId: userRoleId });
    return this.http.get<Validations<GetActivateRoleUserRules>>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getInactivateRoleUserRules(userId: string, userRoleId: string): Observable<Validations<GetInactivateRoleUserRules>> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/users/:userId/validate')
      .setPathParams({ userId })
      .setQueryParams({ operation: 'INACTIVATE_USER_ROLE', roleId: userRoleId });
    return this.http.get<Validations<GetInactivateRoleUserRules>>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  canAddRole(
    userId: string,
    params: { role: UserRoleEnum; organisationUnitIds?: string[] }
  ): Observable<Validations<CanAddRoleRules>['validations']> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/users/:userId/validate')
      .setPathParams({ userId })
      .setQueryParams({ operation: 'ADD_USER_ROLE', ...params });
    return this.http.get<Validations<CanAddRoleRules>>(url.buildUrl()).pipe(
      take(1),
      map(response => response.validations)
    );
  }

  canAddAnyRole(userId: string): Observable<Validations<CanAddAnyRoleRules>['validations']> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/users/:userId/validate')
      .setPathParams({ userId })
      .setQueryParams({ operation: 'ADD_ANY_USER_ROLE' });
    return this.http.get<Validations<CanAddAnyRoleRules>>(url.buildUrl()).pipe(
      take(1),
      map(response => response.validations)
    );
  }
}
