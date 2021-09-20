import { AuthenticationModel } from '@modules/stores';


export const USER_INFO_ACCESSOR: Required<AuthenticationModel>['user'] = {
  id: '_id',
  email: 'tqa@email.com',
  displayName: 'Test qualifying Accessor',
  type: 'ACCESSOR',
  organisations: [{
    id: 'org_id', isShadow: false, name: 'organisation_1', size: '', role: 'QUALIFYING_ACCESSOR',
    organisationUnits: [
      { id: '_unit_id', name: 'ORG_UNIT' }
    ]
  }],
  innovations: []
};
export const USER_INFO_INNOVATOR: Required<AuthenticationModel>['user'] = {
  id: '_id',
  email: 'i@email.com',
  displayName: 'Test innovator',
  type: 'INNOVATOR',
  organisations: [{ id: 'org_id', isShadow: true, name: '', size: '', role: 'OWNER' }],
  innovations: [{ id: 'Inno01', name: 'Test innovation' }]
};
