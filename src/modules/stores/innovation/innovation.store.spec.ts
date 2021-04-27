import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of, throwError } from 'rxjs';

import { CoreModule } from '@modules/core';

import { InnovationStore } from './innovation.store';
import { InnovationService } from './innovation.service';

import { InnovationSectionsIds } from './innovation.models';


describe('Stores/Innovation/InnovationStore', () => {

  let innovationStore: InnovationStore;
  let innovationService: InnovationService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule
      ],
      providers: [
        InnovationStore,
        InnovationService
      ]
    });

    innovationStore = TestBed.inject(InnovationStore);
    innovationService = TestBed.inject(InnovationService);

  });

  it('should run getSectionsSummary$() and return success', () => {

    spyOn(innovationService, 'getInnovationSections').and.returnValue(of([
      { code: InnovationSectionsIds.descritionOfInnovation, status: 'DRAFT', actionStatus: 'REQUESTED' },
      { code: InnovationSectionsIds.valueProposition, status: 'NOT_STARTED', actionStatus: 'IN_REVIEW' },
      { code: InnovationSectionsIds.understandingOfNeeds, status: 'SUBMITTED', actionStatus: '' },
      { code: InnovationSectionsIds.understandingOfBenefits, status: 'UNKNOWN', actionStatus: '' },
      { code: InnovationSectionsIds.evidenceDocuments, status: 'SUBMITTED', actionStatus: '' }
    ]
    ));

    const expectedResponse = [
      {
        title: 'About your product or service',
        sections: [
          { id: 0, status: 'DRAFT', title: 'Description of innovation', actionStatus: 'REQUESTED'},
          { id: 1, status: 'NOT_STARTED', title: 'Value proposition', actionStatus: 'IN_REVIEW' }
        ]
      },
      {
        title: 'Clinical needs and benefits',
        sections: [
          { id: 2, status: 'SUBMITTED', title: 'Detailed understanding of needs' , actionStatus: '' },
          { id: 3, status: 'UNKNOWN', title: 'Detailed understanding of benefits' , actionStatus: '' },
          { id: 4, status: 'SUBMITTED', title: 'Evidence documents', actionStatus: '' }
        ],
      }];
    let response: any = null;

    innovationStore.getSectionsSummary$('innovationId').subscribe(success => response = success, error => response = error);

    expect(response).toEqual(expectedResponse);

  });

});
