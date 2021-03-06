import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { TableModel } from '@app/base/models';
import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { NotificationsListInDTO, NotificationsListOutDTO, NotificationsService } from './notifications.service';
import { NotificationContextDetailEnum, NotificationContextTypeEnum } from '@modules/stores/environment/environment.enums';
import { InnovationActionStatusEnum, InnovationSectionEnum, InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation';


describe('Shared/Services/NotificationsService', () => {

  let httpMock: HttpTestingController;

  let envVariablesStore: EnvironmentVariablesStore;
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        NotificationsService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);

    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    service = TestBed.inject(NotificationsService);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should run getNotificationsList() WITHOUT filters, WITH payload 01 and return SUCCESS', () => {

    const responseMock: NotificationsListInDTO = {
      count: 20,
      data: [{
        id: 'Notification001',
        innovation: { id: 'Innovation001', name: 'Innovation name', status: InnovationStatusEnum.IN_PROGRESS },
        contextType: NotificationContextTypeEnum.NEEDS_ASSESSMENT, contextDetail: NotificationContextDetailEnum.NEEDS_ASSESSMENT_COMPLETED, contextId: 'NeedsAssessment001',
        createdAt: '2020-01-01T00:00:00.000Z', createdBy: 'User name', readAt: null,
        params: null
      }]
    };

    const expected: NotificationsListOutDTO = {
      count: responseMock.count,
      data: responseMock.data.map(item => ({
        id: 'Notification001',
        contextType: item.contextType, contextDetail: item.contextDetail, contextId: item.contextId,
        createdAt: item.createdAt, createdBy: item.createdBy, readAt: item.readAt,
        link: { label: 'Click to go to innovation assessment', url: '//innovations/Innovation001/assessments/NeedsAssessment001' },
        params: { innovationId: item.innovation.id, innovationName: item.innovation.name, innovationStatus: item.innovation.status }
      }))
    };

    let response: any = null;

    const tableList = new TableModel<
      NotificationsListOutDTO['data'][0],
      { contextTypes: NotificationContextTypeEnum[], unreadOnly: boolean }
    >();

    service.getNotificationsList(tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/notifications?take=20&skip=0&unreadOnly=false`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getNotificationsList() WITHOUT filters, WITH payload 02 and return SUCCESS', () => {

    const responseMock: NotificationsListInDTO = {
      count: 20,
      data: [{
        id: 'Notification001',
        innovation: { id: 'Innovation001', name: 'Innovation name', status: InnovationStatusEnum.IN_PROGRESS },
        contextType: NotificationContextTypeEnum.INNOVATION, contextDetail: NotificationContextDetailEnum.INNOVATION_SUBMISSION, contextId: 'Innovation001',
        createdAt: '2020-01-01T00:00:00.000Z', createdBy: 'User name', readAt: null,
        params: {}
      }]
    };

    const expected: NotificationsListOutDTO = {
      count: responseMock.count,
      data: responseMock.data.map(item => ({
        id: 'Notification001',
        contextType: item.contextType, contextDetail: item.contextDetail, contextId: item.contextId,
        createdAt: item.createdAt, createdBy: item.createdBy, readAt: item.readAt,
        link: { label: 'Click to go to innovation', url: '//innovations/Innovation001/overview' },
        params: { innovationId: item.innovation.id, innovationName: item.innovation.name, innovationStatus: item.innovation.status }
      }))
    };

    let response: any = null;

    const tableList = new TableModel<
      NotificationsListOutDTO['data'][0],
      { contextTypes: NotificationContextTypeEnum[], unreadOnly: boolean }
    >();

    service.getNotificationsList(tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/notifications?take=20&skip=0&unreadOnly=false`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getNotificationsList() WITHOUT filters, WITH payload 03 and return SUCCESS', () => {

    const responseMock: NotificationsListInDTO = {
      count: 20,
      data: [{
        id: 'Notification001',
        innovation: { id: 'Innovation001', name: 'Innovation name', status: InnovationStatusEnum.IN_PROGRESS },
        contextType: NotificationContextTypeEnum.ACTION, contextDetail: NotificationContextDetailEnum.ACTION_CREATION, contextId: 'Action001',
        createdAt: '2020-01-01T00:00:00.000Z', createdBy: 'User name', readAt: null,
        params: {
          section: InnovationSectionEnum.INNOVATION_DESCRIPTION,
          actionStatus: InnovationActionStatusEnum.REQUESTED,
          supportStatus: InnovationSupportStatusEnum.ENGAGING
        }
      }]
    };

    const expected: NotificationsListOutDTO = {
      count: responseMock.count,
      data: responseMock.data.map(item => ({
        id: 'Notification001',
        contextType: item.contextType, contextDetail: item.contextDetail, contextId: item.contextId,
        createdAt: item.createdAt, createdBy: item.createdBy, readAt: item.readAt,
        link: { label: 'Click to go to action', url: '//innovations/Innovation001/action-tracker/Action001' },
        params: {
          innovationId: item.innovation.id, innovationName: item.innovation.name, innovationStatus: item.innovation.status,
          section: item.params?.section,
          sectionNumber: '1.1',
          actionStatus: item.params?.actionStatus,
          actionStatusName: 'shared.catalog.innovation.action_status.REQUESTED.name',
          supportStatus: item.params?.supportStatus,
          supportStatusName: 'shared.catalog.innovation.support_status.ENGAGING.name'
        }
      }))
    };

    let response: any = null;

    const tableList = new TableModel<
      NotificationsListOutDTO['data'][0],
      { contextTypes: NotificationContextTypeEnum[], unreadOnly: boolean }
    >();

    service.getNotificationsList(tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/notifications?take=20&skip=0&unreadOnly=false`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getNotificationsList() WITHOUT filters, WITH payload 04 and return SUCCESS', () => {

    const responseMock: NotificationsListInDTO = {
      count: 20,
      data: [{
        id: 'Notification001',
        innovation: { id: 'Innovation001', name: 'Innovation name', status: InnovationStatusEnum.IN_PROGRESS },
        contextType: NotificationContextTypeEnum.COMMENT, contextDetail: NotificationContextDetailEnum.COMMENT_CREATION, contextId: 'Comment001',
        createdAt: '2020-01-01T00:00:00.000Z', createdBy: 'User name', readAt: null,
        params: null
      }]
    };

    const expected: NotificationsListOutDTO = {
      count: responseMock.count,
      data: responseMock.data.map(item => ({
        id: 'Notification001',
        contextType: item.contextType, contextDetail: item.contextDetail, contextId: item.contextId,
        createdAt: item.createdAt, createdBy: item.createdBy, readAt: item.readAt,
        link: { label: 'Click to go to comment', url: '//innovations/Innovation001/comments' },
        params: { innovationId: item.innovation.id, innovationName: item.innovation.name, innovationStatus: item.innovation.status }
      }))
    };

    let response: any = null;

    const tableList = new TableModel<
      NotificationsListOutDTO['data'][0],
      { contextTypes: NotificationContextTypeEnum[], unreadOnly: boolean }
    >();

    service.getNotificationsList(tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/notifications?take=20&skip=0&unreadOnly=false`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run getNotificationsList() WITH filters and return SUCCESS', () => {

    const responseMock: NotificationsListInDTO = { count: 0, data: [] };

    const expected: NotificationsListOutDTO = {
      count: responseMock.count,
      data: []
    };

    let response: any = null;

    const tableList = new TableModel<
      NotificationsListOutDTO['data'][0],
      { contextTypes: NotificationContextTypeEnum[], unreadOnly: boolean }
    >().setFilters({ contextTypes: [NotificationContextTypeEnum.INNOVATION], unreadOnly: true });

    service.getNotificationsList(tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/notifications?take=20&skip=0&contextTypes=INNOVATION&unreadOnly=true`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  // it('should run markAsReadAllNotifications() and return SUCCESS', () => {

  //   const responseMock = null;
  //   const expected = responseMock;

  //   let response: any = null;
  //   service.markAsReadAllNotifications().subscribe(success => response = success, error => response = error);

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/notifications`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('PATCH');
  //   expect(response).toEqual(expected);

  // });

  it('should run dismissAllUserNotifications() and return SUCCESS', () => {

    const responseMock = { affected: 10 };
    const expected = responseMock;

    let response: any = null;
    service.dismissAllUserNotifications().subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/notifications/dismiss`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });

  it('should run deleteNotification() and return SUCCESS', () => {

    const responseMock = { id: 'Notification001' };
    const expected = responseMock;

    let response: any = null;
    service.deleteNotification('Notification001').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/notifications/${responseMock.id}`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('DELETE');
    expect(response).toEqual(expected);

  });

  it('should run getEmailNotificationTypes() and return success', () => {

    const responseMock = [{ id: 'Action', isSubscribed: true }, { id: 'SupportStatusChange', isSubscribed: false }];
    const expected = responseMock;

    let response: any = null;
    service.getEmailNotificationsPreferences().subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${envVariablesStore.API_URL}/email-notifications`);
    req.flush(responseMock);
    expect(req.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run updateUserNotificationPreferences() and return success', () => {

    const payload = [{ id: 'Action', isSubscribed: false }];
    const responseMock = { id: 'id' };
    const expected = { id: 'id' };

    let response: any = null;
    service.updateEmailNotificationsPreferences(payload).subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${envVariablesStore.API_URL}/email-notifications`);
    req.flush(responseMock);
    expect(req.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

});
