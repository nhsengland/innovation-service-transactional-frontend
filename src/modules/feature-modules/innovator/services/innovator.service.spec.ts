import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ENV } from '@tests/app.mocks';

import { Injector, signal } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule, InnovationTransferStatusEnum, CtxStore } from '@modules/stores';

import { InnovatorService } from './innovator.service';

describe('FeatureModules/Innovator/InnovatorService', () => {
  let httpMock: HttpTestingController;

  let envVariablesStore: EnvironmentVariablesStore;
  let ctx: CtxStore;
  let service: InnovatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, StoresModule],
      providers: [InnovatorService, { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);

    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    ctx = TestBed.inject(CtxStore);
    service = TestBed.inject(InnovatorService);

    ctx.user.getUserId = signal('UserId01');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should run createInnovation() and return success', () => {
    const payload = {
      name: 'User display name',
      description: 'Innovation name',
      countryName: 'Some location',
      postcode: 'EN05'
    };
    const responseMock = { id: 'id' };
    const expected = { id: 'id' };

    let response: any = null;
    service
      .createInnovation(payload)
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);
  });

  it('should run submitOrganisationSharing() and return success', () => {
    const responseMock = { id: 'id' };
    const expected = { id: 'id' };

    let response: any = null;
    service
      .submitOrganisationSharing('Inno01', { some: 'parameters' })
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/Inno01/shares`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PUT');
    expect(response).toEqual(expected);
  });

  it('should run getInnovationTransfers() with NO parameter and return success', () => {
    const responseMock = [
      {
        id: 'transferId01',
        email: 'some@email.com',
        name: 'User name',
        innovation: { id: 'Inno01', name: 'Innovation name', owner: 'userId01' }
      }
    ];
    const expected = responseMock;

    let response: any = null;
    service
      .getInnovationTransfers()
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/transfers`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);
  });

  it('should run getInnovationTransfers() with assignToMe = true and return success', () => {
    const responseMock = [
      {
        id: 'transferId01',
        email: 'some@email.com',
        name: 'User name',
        innovation: { id: 'Inno01', name: 'Innovation name', owner: 'userId01' }
      }
    ];
    const expected = responseMock;

    let response: any = null;
    service
      .getInnovationTransfers(true)
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/transfers?assignedToMe=true`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);
  });

  it('should run transferInnovation() and return success', () => {
    const responseMock = { id: 'id' };
    const expected = responseMock;

    let response: any = null;
    service
      .transferInnovation({ innovationId: 'Inno01', email: 'some@email.com', ownerToCollaborator: false })
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/transfers`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);
  });

  it('should run updateTransferInnovation() and return success', () => {
    const responseMock = { id: 'id' };
    const expected = responseMock;

    let response: any = null;
    service
      .updateTransferInnovation('transferId01', InnovationTransferStatusEnum.COMPLETED)
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/transfers/transferId01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);
  });

  it('should run withdrawInnovation() and return success', () => {
    const responseMock = { id: 'id' };
    const expected = responseMock;

    let response: any = null;
    service
      .withdrawInnovation('Inno01', 'Some reason')
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/Inno01/withdraw`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);
  });

  it('should run deleteUserAccount() and return success', () => {
    const responseMock = { id: 'id' };
    const expected = responseMock;

    let response: any = null;
    service
      .deleteUserAccount({ reason: 'Some reason' })
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_USERS_URL}/v1/me/delete`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);
  });
});
