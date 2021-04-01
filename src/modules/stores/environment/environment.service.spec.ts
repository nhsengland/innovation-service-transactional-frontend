import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '@app/config/environment.config';

import { EnvironmentService } from './environment.service';

describe('Store/EnvironemntStore/EnvironmentService tests Suite', () => {

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


  it('should run getUserInfo() method', () => {

    const expected = { user: { id: 'id', displayName: 'John Doe' } };

    service.getUserInfo().subscribe(response => {
      expect(response).toBe(expected);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/auth/user`);
    req.flush(expected);
    expect(req.request.method).toBe('GET');

  });

});
