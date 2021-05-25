import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { TableModel } from '@app/base/models';

import { AssessmentService } from './assessment.service';

describe('FeatureModules/Innovator/InnovatorService', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: AssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        AssessmentService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(AssessmentService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run getInnovationsList() and return success', () => {

    const responseMock = {
      count: 2,
      data: [
        {
          id: '01', name: 'Innovation 01', countryName: 'England', postCode: 'SW01', mainCategory: 'Medical', submittedAt: '',
          assessment: { createdAt: '2021-04-16T09:23:49.396Z', assignTo: 'User Name', finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 01']
        },
        {
          id: '02', name: 'Innovation 02', countryName: 'England', postCode: 'SW01', mainCategory: 'Medical', submittedAt: '',
          assessment: { createdAt: '2021-04-16T09:23:49.396Z', assignTo: 'User Name', finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 01']
        }
      ]
    };
    const tableList = new TableModel({ visibleColumns: { name: 'Name' } }).setFilters({status: ['ASSESSMENT']});

    const expected = responseMock;
    let response: any = null;

    service.getInnovationsList(tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/assessments//innovations?take=10&skip=0&status=%5B%22ASSESSMENT%22%5D`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

});
