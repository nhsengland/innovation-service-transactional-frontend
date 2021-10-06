import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { EmailNotificationService } from './email-notifications.service';

describe('Shared/Services/EmailNotificationService', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: EmailNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        EmailNotificationService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(EmailNotificationService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run getUserNotificationPreferences() and return success', () => {

    const responseMock = [{ id: 'Action', isSubscribed: true }, { id: 'SupportStatusChange', isSubscribed: false }];
    const expected = [{ id: 'Action', isSubscribed: true }, { id: 'SupportStatusChange', isSubscribed: false }];
    let response: any = null;

    service.getUserNotificationPreferences().subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${environmentStore.API_URL}/user//notification-preference`);
    req.flush(responseMock);
    expect(req.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run updateUserNotificationPreference() and return success', () => {

    const payload = [{ id: 'Action', isSubscribed: false }];
    const responseMock = { id: 'id' };
    const expected = { id: 'id' };
    let response: any = null;

    service.updateUserNotificationPreference(payload).subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${environmentStore.API_URL}/user//notification-preference`);
    req.flush(responseMock);
    expect(req.request.method).toBe('PUT');
    expect(response).toEqual(expected);

  });

});
