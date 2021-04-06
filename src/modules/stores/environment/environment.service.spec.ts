import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '@app/config/environment.config';

import { EnvironmentService } from './environment.service';

describe('Store/EnvironmentStore/EnvironmentService tests Suite', () => {

  let httpMock: HttpTestingController;
  let service: EnvironmentService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        EnvironmentService
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EnvironmentService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run verifyUserSession() and return success', () => {

    const expected = {
      success: true,
      error: { status: 0, statusText: '' }
    };

    service.verifyUserSession().subscribe(
      response => expected.success = response,
      error => expected.error = error
    );

    const req = httpMock.expectOne(`${environment.API_URL}/transactional/session`);
    req.flush(expected.success);
    expect(req.request.method).toBe('HEAD');
    expect(expected.success).toBe(expected.success);

  });

  it('should run getUserInfo() method and return success', () => {

    const expected = {
      success: { user: { id: 'id', displayName: 'John Doe' } },
      error: { status: 0, statusText: '' }
    };

    service.getUserInfo().subscribe(
      response => expected.success = response,
      error => expected.error = error
    );

    const req = httpMock.expectOne(`${environment.API_URL}/transactional/auth/user`);
    req.flush(expected.success);
    expect(req.request.method).toBe('GET');
    expect(expected.success).toBe(expected.success);

  });

  it('should run verifyInnovator() and return success', () => {

    const expected = {
      success: true,
      error: { status: 0, statusText: '' }
    };

    service.verifyInnovator('010101').subscribe(
      response => expected.success = response,
      error => expected.error = error
    );

    const req = httpMock.expectOne(`${environment.API_URL}/transactional/api/innovators/010101`);
    req.flush(expected.success);
    expect(req.request.method).toBe('HEAD');
    expect(expected.success).toBe(expected.success);

  });

});
