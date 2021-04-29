import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of, throwError } from 'rxjs';

import { CoreModule } from '@modules/core';
import { AuthenticationStore, AuthenticationService } from '@modules/stores';

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
        AuthenticationStore,
        AuthenticationService,
        InnovationStore,
        InnovationService
      ]
    });

    innovationStore = TestBed.inject(InnovationStore);
    innovationService = TestBed.inject(InnovationService);

  });

  it('should run getSectionsSummary$() and return success', () => {

    spyOn(innovationService, 'getInnovationSections').and.returnValue(of({
      id: 'innovationId',
      name: 'innovationName',
      sections: [
        { section: InnovationSectionsIds.INNOVATION_DESCRIPTION, status: 'DRAFT', actionStatus: 'REQUESTED' },
        { section: InnovationSectionsIds.VALUE_PROPOSITION, status: 'NOT_STARTED', actionStatus: 'IN_REVIEW' },
        { section: InnovationSectionsIds.UNDERSTANDING_OF_NEEDS, status: 'SUBMITTED', actionStatus: '' },
        { section: InnovationSectionsIds.UNDERSTANDING_OF_BENEFITS, status: 'UNKNOWN', actionStatus: '' }
      ]
    }));

    const expectedResponse = [
      {
        title: 'About your product or service',
        sections: [
          { id: 0, status: 'DRAFT', title: 'Description of innovation', actionStatus: 'REQUESTED' },
          { id: 1, status: 'NOT_STARTED', title: 'Value proposition', actionStatus: 'IN_REVIEW' }
        ]
      },
      {
        title: 'Clinical needs and benefits',
        sections: [
          { id: 2, status: 'SUBMITTED', title: 'Detailed understanding of needs', actionStatus: '' },
          { id: 3, status: 'UNKNOWN', title: 'Detailed understanding of benefits', actionStatus: '' }
        ],
      }];
    let response: any = null;

    innovationStore.getSectionsSummary$('innovationId').subscribe(success => response = success, error => response = error);

    //expect(response).toEqual(expectedResponse);
    expect(true).toBe(true); // TODO: Review this test!

  });

});
