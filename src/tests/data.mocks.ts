import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum } from '@modules/stores/authentication/authentication.enums';
import { AuthenticationModel } from '@modules/stores/authentication/authentication.models';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import { InnovationStatusEnum } from '@modules/stores/innovation';


export const USER_INFO_ACCESSOR: Required<AuthenticationModel>['user'] = {
  id: '_id',
  email: 'tqa@email.com',
  displayName: 'Test qualifying Accessor',
  roles: [],
  contactByPhone: false,
  contactByEmail: false,
  contactByPhoneTimeframe: null,
  contactDetails: null,
  phone: '212000000',
  termsOfUseAccepted: true,
  hasInnovationTransfers: false,
  passwordResetAt: '2020-01-01T00:00:00.000Z',
  firstTimeSignInAt: '2020-01-01T00:00:00.000Z',
  organisations: [{
    id: 'org_id', isShadow: false, name: 'organisation_1', size: '', role: AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR,
    organisationUnits: [
      { id: '_unit_id', name: 'ORG_UNIT', acronym: 'ORG' }
    ]
  }],
};


export const USER_INFO_INNOVATOR: Required<AuthenticationModel>['user'] = {
  id: '_id',
  email: 'some@email.com',
  displayName: 'Test innovator',
  roles: [],
  contactByPhone: false,
  contactByEmail: false,
  contactByPhoneTimeframe: null,
  contactDetails: null,
  phone: '212000000',
  termsOfUseAccepted: true,
  hasInnovationTransfers: false,
  passwordResetAt: '2020-01-01T00:00:00.000Z',
  firstTimeSignInAt: '2020-01-01T00:00:00.000Z',
  organisations: [
    { id: 'org_id', isShadow: true, name: '', size: '', role: InnovatorOrganisationRoleEnum.INNOVATOR_OWNER, organisationUnits: [] }]
};

export const USER_INFO_ADMIN: Required<AuthenticationModel>['user'] = {
  id: '_id',
  email: 'a@gmail.com',
  displayName: 'Test admin  ',
  roles: [{
    id: '',
    role: UserRoleEnum.ADMIN,
  }],
  contactByPhone: false,
  contactByEmail: false,
  contactByPhoneTimeframe: null,
  contactDetails: null,
  phone: '212000000',
  termsOfUseAccepted: true,
  hasInnovationTransfers: false,
  passwordResetAt: '2020-01-01T00:00:00.000Z',
  firstTimeSignInAt: '2020-01-01T00:00:00.000Z',
  organisations: []
};


export const CONTEXT_INNOVATION_INFO: ContextInnovationType = {
  id: 'innovationId01',
  name: 'Test innovation',
  status: InnovationStatusEnum.IN_PROGRESS,
  owner: { name: 'User name 01', isActive: true },
  assessment: { id: 'assessment01' }
};
