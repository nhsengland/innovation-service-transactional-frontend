import { ContextInnovationType, InnovationStatusEnum, UserContextType, UserRoleEnum } from '@modules/stores';

export const USER_INFO_ACCESSOR: Required<UserContextType>['user'] = {
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
  hasInnovationCollaborations: false,
  hasLoginAnnouncements: {},
  passwordResetAt: '2020-01-01T00:00:00.000Z',
  firstTimeSignInAt: '2020-01-01T00:00:00.000Z',
  organisations: [
    {
      id: 'org_id',
      isShadow: false,
      name: 'organisation_1',
      acronym: 'O1',
      size: '',
      description: 'Sole trader',
      registrationNumber: null,
      organisationUnits: [{ id: '_unit_id', name: 'ORG_UNIT', acronym: 'ORG' }]
    }
  ]
};

export const USER_INFO_INNOVATOR: Required<UserContextType>['user'] = {
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
  hasInnovationCollaborations: false,
  hasLoginAnnouncements: {},
  passwordResetAt: '2020-01-01T00:00:00.000Z',
  firstTimeSignInAt: '2020-01-01T00:00:00.000Z',
  organisations: [
    {
      id: 'org_id',
      isShadow: true,
      name: '',
      size: '',
      acronym: 'O1',
      description: null,
      registrationNumber: null,
      organisationUnits: []
    }
  ]
};

export const USER_INFO_ADMIN: Required<UserContextType>['user'] = {
  id: '_id',
  email: 'a@gmail.com',
  displayName: 'Test admin  ',
  roles: [
    {
      id: '',
      role: UserRoleEnum.ADMIN
    }
  ],
  contactByPhone: false,
  contactByEmail: false,
  contactByPhoneTimeframe: null,
  contactDetails: null,
  phone: '212000000',
  termsOfUseAccepted: true,
  hasInnovationTransfers: false,
  hasInnovationCollaborations: false,
  hasLoginAnnouncements: {},
  passwordResetAt: '2020-01-01T00:00:00.000Z',
  firstTimeSignInAt: '2020-01-01T00:00:00.000Z',
  organisations: []
};

export const CONTEXT_INNOVATION_INFO: ContextInnovationType = {
  id: 'innovationId01',
  uniqueId: 'uniqueId01',
  name: 'Test innovation',
  status: InnovationStatusEnum.IN_PROGRESS,
  statusUpdatedAt: '2020-01-01T00:00:00.000Z',
  owner: { id: 'ID01', name: 'User name 01', isActive: true },
  loggedUser: { isOwner: true },
  hasBeenAssessed: false,
  assessment: {
    id: 'assessment01',
    currentMajorAssessmentId: 'majorAssessmentId01',
    majorVersion: 1,
    minorVersion: 0,
    createdAt: '2020-01-01T00:00:00.000Z',
    finishedAt: null
  },
  categories: [],
  countryName: 'England',
  description: 'Description',
  otherCategoryDescription: null,
  postCode: null,
  expiryAt: 5000
};
