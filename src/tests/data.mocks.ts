import { InnovationStatusEnum } from '@modules/shared/enums';
import { AuthenticationModel, ContextModel } from '@modules/stores';
import { ContextInnovationType } from '@modules/stores/context/context.models';


export const USER_INFO_ACCESSOR: Required<AuthenticationModel>['user'] = {
  id: '_id',
  email: 'tqa@email.com',
  displayName: 'Test qualifying Accessor',
  type: 'ACCESSOR',
  roles: [],
  organisations: [{
    id: 'org_id', isShadow: false, name: 'organisation_1', size: '', role: 'QUALIFYING_ACCESSOR',
    organisationUnits: [
      { id: '_unit_id', name: 'ORG_UNIT' }
    ]
  }],
  passwordResetOn: '2020-01-01T00:00:00.000Z',
  phone: '212000000'
};


export const USER_INFO_INNOVATOR: Required<AuthenticationModel>['user'] = {
  id: '_id',
  email: 'i@email.com',
  displayName: 'Test innovator',
  type: 'INNOVATOR',
  roles: [],
  organisations: [{ id: 'org_id', isShadow: true, name: '', size: '', role: 'INNOVATOR_OWNER' }],
  passwordResetOn: '2020-01-01T00:00:00.000Z',
  phone: '212000000'
};

export const USER_INFO_ADMIN: Required<AuthenticationModel>['user'] = {
  id: '_id',
  email: 'a@gmail.com',
  displayName: 'Test admin  ',
  type: 'ADMIN',
  roles: [ 'ADMIN', 'SERVICE_TEAM' ],
  organisations: [],
  passwordResetOn: '2022-03-10T07:42:24.0571567Z',
  phone: '23422134'
};


export const CONTEXT_INNOVATION_INFO: ContextInnovationType = {
  id: 'innovationId01',
  name: 'Test innovation',
  status: InnovationStatusEnum.IN_PROGRESS,
  owner: {    name: 'User name 01',    isActive: true  }
};
