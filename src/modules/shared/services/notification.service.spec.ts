import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { NotificationService } from './notification.service';


describe('Shared/Services/NotificationService', () => {

  let httpMock: HttpTestingController;

  let environmentStore: EnvironmentStore;
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        NotificationService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);

    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(NotificationService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run innovationStatusNotifications() and return success', () => {

    const responseMock = { IN_PROGRESS: 1, NEEDS_ASSESSMENT: 2, WAITING_NEEDS_ASSESSMENT: 3 };
    const expected = responseMock;

    let response: any = null;
    service.innovationStatusNotifications().subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/notifications/status?scope=INNOVATION_STATUS`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run dismissNotification() and return success', () => {

    const responseMock = { affected: 1, updated: [] };
    const expected = responseMock;

    let response: any = null;
    service.dismissNotification('Some string', 'Another string').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/notifications`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);

  });

  it('should run getAllUnreadNotificationsGroupedByContext() WITH innovationId and return success', () => {

    const responseMock = { some: 'key' };
    const expected = responseMock;

    let response: any = null;
    service.getAllUnreadNotificationsGroupedByContext('Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/notifications/context?innovationId=Inno01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getAllUnreadNotificationsGroupedByContext() WITHOUT innovationId and return success', () => {

    const responseMock = { some: 'key' };
    const expected = responseMock;

    let response: any = null;
    service.getAllUnreadNotificationsGroupedByContext().subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/notifications/context`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getAllUnreadNotificationsGroupedByStatus() and return success', () => {

    const responseMock = { some: 'key' };
    const expected = responseMock;

    let response: any = null;
    service.getAllUnreadNotificationsGroupedByStatus('SUPPORT_STATUS').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/notifications/status?scope=SUPPORT_STATUS`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });


  it('should run getEmailNotificationTypes() and return success', () => {

    const responseMock = [{ id: 'Action', isSubscribed: true }, { id: 'SupportStatusChange', isSubscribed: false }];
    const expected = responseMock;

    let response: any = null;
    service.getEmailNotificationTypes().subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${environmentStore.API_URL}/email-notifications`);
    req.flush(responseMock);
    expect(req.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run updateUserNotificationPreferences() and return success', () => {

    const payload = [{ id: 'Action', isSubscribed: false }];
    const responseMock = { id: 'id' };
    const expected = { id: 'id' };

    let response: any = null;
    service.updateUserNotificationPreferences(payload).subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${environmentStore.API_URL}/email-notifications`);
    req.flush(responseMock);
    expect(req.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

});
