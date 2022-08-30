import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum, UserTypeEnum } from '@modules/stores/authentication/authentication.enums';
import { AuthenticationModel } from '@modules/stores/authentication/authentication.models';
import { EnvironmentInnovationType } from '@modules/stores/environment/environment.types';
import { InnovationStatusEnum } from '@modules/stores/innovation';


export const USER_INFO_ACCESSOR: Required<AuthenticationModel>['user'] = {
  id: '_id',
  email: 'tqa@email.com',
  displayName: 'Test qualifying Accessor',
  type: UserTypeEnum.ACCESSOR,
  roles: [],
  organisations: [{
    id: 'org_id', isShadow: false, name: 'organisation_1', size: '', role: AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR,
    organisationUnits: [
      { id: '_unit_id', name: 'ORG_UNIT' }
    ]
  }],
  passwordResetOn: '2020-01-01T00:00:00.000Z',
  phone: '212000000'
};


export const USER_INFO_INNOVATOR: Required<AuthenticationModel>['user'] = {
  id: '_id',
  email: 'some@email.com',
  displayName: 'Test innovator',
  type: UserTypeEnum.INNOVATOR,
  phone: '212000000',
  passwordResetOn: '2020-01-01T00:00:00.000Z',
  roles: [],
  organisations: [{ id: 'org_id', isShadow: true, name: '', size: '', role: InnovatorOrganisationRoleEnum.INNOVATOR_OWNER }]
};

export const USER_INFO_ADMIN: Required<AuthenticationModel>['user'] = {
  id: '_id',
  email: 'a@gmail.com',
  displayName: 'Test admin  ',
  type: UserTypeEnum.ADMIN,
  roles: [UserRoleEnum.ADMIN, UserRoleEnum.SERVICE_TEAM],
  organisations: [],
  passwordResetOn: '2022-03-10T07:42:24.0571567Z',
  phone: '23422134'
};


export const CONTEXT_INNOVATION_INFO: EnvironmentInnovationType = {
  id: 'innovationId01',
  name: 'Test innovation',
  status: InnovationStatusEnum.IN_PROGRESS,
  owner: { name: 'User name 01', isActive: true }
};
