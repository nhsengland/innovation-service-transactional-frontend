import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { CoreModule, EnvironmentStore } from '@modules/core';
import { AuthenticationStore, AuthenticationService } from '@modules/stores';

import { InnovationService } from './innovation.service';

import { InnovationSectionsIds } from './innovation.models';

describe('Stores/Innovation/InnovationService', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: InnovationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule
      ],
      providers: [
        AuthenticationStore,
        AuthenticationService,
        InnovationService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(InnovationService);

  });

  afterEach(() => {
    httpMock.verify();
  });



  // it('should run getInnovationInfo() and return success with response 01', () => {

  //   const responseMock = {
  //     id: '123abc',
  //     name: 'Innovation name',
  //     company: '',
  //     description: 'Some description',
  //     countryName: 'England',
  //     postcode: 'EN60',
  //     actions: [],
  //     comments: []
  //   };
  //   const expected = {
  //     id: '123abc',
  //     name: 'Innovation name',
  //     company: '',
  //     location: 'England, EN60',
  //     description: 'Some description',
  //     openActionsNumber: 0,
  //     openCommentsNumber: 0
  //   };
  //   let response: any = null;

  //   service.getInnovationInfo('123abc').subscribe(success => response = success, error => response = error);

  //   const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/123abc`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('GET');
  //   expect(response).toEqual(expected);

  // });

  // it('should run getInnovationInfo() and return success with response 02', () => {

  //   const responseMock = {
  //     id: '123abc',
  //     name: 'Innovation name',
  //     company: '',
  //     description: 'Some description',
  //     countryName: 'England',
  //     // postcode: '',
  //     actions: [],
  //     comments: []
  //   };
  //   const expected = {
  //     id: '123abc',
  //     name: 'Innovation name',
  //     company: '',
  //     location: 'England',
  //     description: 'Some description',
  //     openActionsNumber: 0,
  //     openCommentsNumber: 0
  //   };
  //   let response: any = null;

  //   service.getInnovationInfo('123abc').subscribe(success => response = success, error => response = error);

  //   const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/123abc`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('GET');
  //   expect(response).toEqual(expected);

  // });

  it('should run submitInnovation() and return success', () => {

    const responseMock = { id: 'Inno01', status: 'WAITING_NEEDS_ASSESSMENT' };
    const expected = responseMock;
    let response: any = null;

    service.submitInnovation('Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/submit`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });

  it('should run submitInnovation() and return error', () => {

    const responseMock = '';
    const expected = false;
    let response: any = {};

    service.submitInnovation('Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/submit`);
    httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });

    expect(httpRequest.request.method).toBe('PATCH');
    expect(response.status).toEqual(400);
    expect(response.statusText).toEqual('Bad Request');

  });


  it('should run getInnovationSections() from "innovator" module and return success', () => {

    const responseMock = [
      { code: InnovationSectionsIds.INNOVATION_DESCRIPTION, status: 'DRAFT', actionStatus: 'REQUESTED' },
      { code: InnovationSectionsIds.VALUE_PROPOSITION, status: 'NOT_STARTED', actionStatus: 'IN_REVIEW' }
    ];
    const expected = [
      { code: InnovationSectionsIds.INNOVATION_DESCRIPTION, status: 'DRAFT', actionStatus: 'REQUESTED' },
      { code: InnovationSectionsIds.VALUE_PROPOSITION, status: 'NOT_STARTED', actionStatus: 'IN_REVIEW' }
    ];
    let response: any = null;

    service.getInnovationSections('innovator', 'Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/section-summary`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationSections() from "accessor" module and return success', () => {

    const responseMock = [
      { code: InnovationSectionsIds.INNOVATION_DESCRIPTION, status: 'DRAFT', actionStatus: 'REQUESTED' },
      { code: InnovationSectionsIds.VALUE_PROPOSITION, status: 'NOT_STARTED', actionStatus: 'IN_REVIEW' }
    ];
    const expected = [
      { code: InnovationSectionsIds.INNOVATION_DESCRIPTION, status: 'DRAFT', actionStatus: 'REQUESTED' },
      { code: InnovationSectionsIds.VALUE_PROPOSITION, status: 'NOT_STARTED', actionStatus: 'IN_REVIEW' }
    ];
    let response: any = null;

    service.getInnovationSections('accessor', 'Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors//innovations/Inno01/section-summary`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationSections() and return error', () => {

    const responseMock = '';
    const expected = false;
    let response: any = {};

    service.getInnovationSections('', 'Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}///innovations/Inno01/section-summary`);
    httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });

    expect(httpRequest.request.method).toBe('GET');
    expect(response.status).toEqual(400);
    expect(response.statusText).toEqual('Bad Request');

  });


  it('should run getSectionInfo() from "innovator" module and return success', () => {

    const responseMock = { answer01: 'answer 01', answer02: 'answer 0' };
    const expected = { answer01: 'answer 01', answer02: 'answer 0' };
    let response: any = null;

    service.getSectionInfo('innovator', 'Inno01', InnovationSectionsIds.INNOVATION_DESCRIPTION).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/sections?section=${InnovationSectionsIds.INNOVATION_DESCRIPTION}`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getSectionInfo() from "accessor" module and return success', () => {

    const responseMock = { answer01: 'answer 01', answer02: 'answer 0' };
    const expected = { answer01: 'answer 01', answer02: 'answer 0' };
    let response: any = null;

    service.getSectionInfo('accessor', 'Inno01', InnovationSectionsIds.INNOVATION_DESCRIPTION).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors//innovations/Inno01/sections?section=${InnovationSectionsIds.INNOVATION_DESCRIPTION}`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getSectionInfo() and return error', () => {

    const responseMock = '';
    const expected = false;
    let response: any = {};

    service.getSectionInfo('', 'Inno01', InnovationSectionsIds.INNOVATION_DESCRIPTION).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}///innovations/Inno01/sections?section=${InnovationSectionsIds.INNOVATION_DESCRIPTION}`);
    httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });

    expect(httpRequest.request.method).toBe('GET');
    expect(response.status).toEqual(400);
    expect(response.statusText).toEqual('Bad Request');

  });


  it('should run updateSectionInfo() and return success', () => {

    const responseMock = { section: { id: 'id' }, data: { some: 'data' } };
    const expected = { section: { id: 'id' }, data: { some: 'data' } };
    let response: any = null;

    service.updateSectionInfo('Inno01', InnovationSectionsIds.INNOVATION_DESCRIPTION, { some: 'data' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/sections`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

  it('should run updateSectionInfo() and return error', () => {

    const responseMock = '';
    const expected = false;
    let response: any = {};

    service.updateSectionInfo('Inno01', InnovationSectionsIds.INNOVATION_DESCRIPTION, { some: 'data' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/sections`);
    httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });

    expect(httpRequest.request.method).toBe('PUT');
    expect(response.status).toEqual(400);
    expect(response.statusText).toEqual('Bad Request');

  });


  it('should run submitSections() and return success', () => {

    const responseMock = true;
    const expected = true;
    let response: any = null;

    service.submitSections('Inno01', ['section01', 'section02']).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/sections/submit`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });

  it('should run submitSections() and return error', () => {

    const responseMock = '';
    const expected = false;
    let response: any = {};

    service.submitSections('Inno01', ['section01', 'section02']).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/sections/submit`);
    httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });

    expect(httpRequest.request.method).toBe('PATCH');
    expect(response.status).toEqual(400);
    expect(response.statusText).toEqual('Bad Request');

  });


  it('should run getSectionEvidenceInfo() from "innovator" module and return success', () => {

    const responseMock = {
      evidenceType: 'CLINICAL',
      clinicalEvidenceType: 'UNPUBLISHED_DATA',
      description: '',
      summary: '',
      files: [{ id: 'file01', displayFileName: 'filename.pdf', url: 'http://some.url' }]
    };
    const expected = responseMock;
    let response: any = null;

    service.getSectionEvidenceInfo('innovator', 'Inno01', 'Evidence01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/evidence/Evidence01`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getSectionEvidenceInfo() from "accessor" module and return success', () => {

    const responseMock = { answer01: 'answer 01', answer02: 'answer 0' };
    const expected = { answer01: 'answer 01', answer02: 'answer 0' };
    let response: any = null;

    service.getSectionEvidenceInfo('accessor', 'Inno01', 'Evidence01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors//innovations/Inno01/evidence/Evidence01`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getSectionEvidenceInfo() and return error', () => {

    const responseMock = '';
    const expected = false;
    let response: any = {};

    service.getSectionEvidenceInfo('', 'Inno01', 'Evidence01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}///innovations/Inno01/evidence/Evidence01`);
    httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });

    expect(httpRequest.request.method).toBe('GET');
    expect(response.status).toEqual(400);
    expect(response.statusText).toEqual('Bad Request');

  });


  it('should run upsertSectionEvidenceInfo() WITHOUT evidenceId and return success', () => {

    const responseMock = { id: 'Evidence01' };
    const expected = responseMock;
    let response: any = null;

    service.upsertSectionEvidenceInfo('Inno01', { some: 'data' }).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/evidence`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run upsertSectionEvidenceInfo() WITH evidenceId and return success', () => {

    const responseMock = { id: 'Evidence01' };
    const expected = responseMock;
    let response: any = {};

    service.upsertSectionEvidenceInfo('Inno01', { some: 'data' }, 'Evidence01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/evidence/Evidence01`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });




  it('should run deleteEvidence() and return success', () => {

    const responseMock = true;
    const expected = true;
    let response: any = null;

    service.deleteEvidence('Inno01', 'Evidence01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/evidence/Evidence01`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('DELETE');
    expect(response).toEqual(expected);

  });

  it('should run deleteEvidence() and return error', () => {

    const responseMock = '';
    const expected = false;
    let response: any = {};

    service.deleteEvidence('Inno01', 'Evidence01').subscribe(
      success => response = success,
      error => response = error
    );

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/evidence/Evidence01`);
    httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });

    expect(httpRequest.request.method).toBe('DELETE');
    expect(response).toBe(false);

  });

});

    // This will be use to test activity log endpoint.
    // return of([
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.INNOVATION_CREATION,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       sectionName: ''
    //     },
    //     link: null
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.OWNERSHIP_TRANSFER,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       interveningUserName: 'Other guy',
    //       sectionName: ''
    //     },
    //     link: null
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.SHARING_PREFERENCES_UPDATE,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       organisations: ['Org 01', 'Org 02', 'Org 03'],
    //       sectionName: ''
    //     },
    //     link: null
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.SECTION_DRAFT_UPDATE,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       sectionId: InnovationSectionsIds.COST_OF_INNOVATION,
    //       sectionName: 'the section name TODO!!!!!'
    //     },
    //     link: null
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.SECTION_SUBMISSION,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       sectionId: InnovationSectionsIds.COST_OF_INNOVATION,
    //       sectionName: 'the section name TODO!!!!!',
    //     },
    //     link: { label: 'Go to section', url: `/innovator/innovations/Inno01/record/section/${InnovationSectionsIds.COST_OF_INNOVATION}` }
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.INNOVATION_SUBMISSION,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       sectionName: ''
    //     },
    //     link: null
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.NEEDS_ASSESSMENT_START,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       sectionName: '',
    //       comment: { id: 'C123', value: 'This a comment!!!!!' }
    //     },
    //     link: null
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.NEEDS_ASSESSMENT_COMPLETED,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       sectionName: ''
    //     },
    //     link: { label: 'Go to needs assessment', url: `/innovator/innovations/Inno01/assessments/Assess01` }
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.ORGANISATION_SUGGESTION,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       organisations: ['Org 01', 'Org 02', 'Org 03'],
    //       sectionName: ''
    //     },
    //     link: { label: 'Go to support information', url: `/innovator/innovations/Inno01/support` }
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.SUPPORT_STATUS_UPDATE,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       innovationSupportStatus: 'ENGAGING' as keyof typeof INNOVATION_SUPPORT_STATUS,
    //       comment: { id: 'C123', value: 'This comment was inserted when the support changed!!' },
    //       sectionName: ''
    //     },
    //     link: null
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.COMMENT_CREATION,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       comment: { id: 'C123', value: 'A comment was created!!!!!' },
    //       sectionName: ''
    //     },
    //     link: null
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.ACTION_CREATION,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       comment: { id: 'C123', value: 'A comment from the action!!!!!' },
    //       sectionName: ''
    //     },
    //     link: { label: 'Go to action', url: `/innovator/innovations/Inno01/action-tracker/Action01` }
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.ACTION_STATUS_IN_REVIEW_UPDATE,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       totalActions: 10,
    //       sectionName: 'SECtion name here'
    //     },
    //     link: null
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.ACTION_STATUS_DECLINED_UPDATE,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       interveningUserName: 'Other guy',
    //       comment: { id: 'C123', value: 'A comment from the action decline!!!!!' },
    //       sectionName: ''
    //     },
    //     link: { label: 'Go to action', url: `/innovator/innovations/Inno01/action-tracker/Action01` }
    //   },
    //   {
    //     date: '2020-01-01T00:00:00.000Z', type: 'INNOVATION_MANAGEMENT' as keyof ActivityLogTypesEnum, activity: ActivityLogItemsEnum.ACTION_STATUS_COMPLETED_UPDATE,
    //     params: {
    //       innovationName: 'Healthy App',
    //       actionUserName: 'This guy',
    //       comment: { id: 'C123', value: 'A comment from the action complete!!!!!' },
    //       sectionName: ''
    //     },
    //     link: { label: 'Go to action', url: `/innovator/innovations/Inno01/action-tracker/Action01` }
    //   }

    // ]);
