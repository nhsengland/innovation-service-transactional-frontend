import { AuthenticationModel } from '@modules/stores';


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
  innovations: [],
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
  innovations: [{ id: 'Inno01', name: 'Test innovation' }],
  passwordResetOn: '2020-01-01T00:00:00.000Z',
  phone: '212000000'
};
