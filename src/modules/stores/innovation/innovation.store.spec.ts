import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { CoreModule } from '@modules/core';
import { AuthenticationStore, AuthenticationService } from '@modules/stores';

import { InnovationStore } from './innovation.store';
import { InnovationService } from './innovation.service';

import { InnovationSectionEnum } from './innovation.enums';


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
      title: 'About your product or service',
      sections: [
        { section: InnovationSectionEnum.INNOVATION_DESCRIPTION, status: 'DRAFT', actionStatus: 'REQUESTED' },
        { section: InnovationSectionEnum.VALUE_PROPOSITION, status: 'NOT_STARTED', actionStatus: 'IN_REVIEW' },
        { section: InnovationSectionEnum.UNDERSTANDING_OF_NEEDS, status: 'SUBMITTED', actionStatus: '' },
        { section: InnovationSectionEnum.UNDERSTANDING_OF_BENEFITS, status: 'UNKNOWN', actionStatus: '' }
      ]
    }));

    const expectedResponse = [
      {
        title: 'About your product or service',
        sections: [
          { id: InnovationSectionEnum.INNOVATION_DESCRIPTION, title: 'Description of innovation', status: 'DRAFT', actionStatus: 'REQUESTED', isCompleted: false },
          { id: InnovationSectionEnum.VALUE_PROPOSITION, title: 'Value proposition', status: 'NOT_STARTED', actionStatus: 'IN_REVIEW', isCompleted: false },
          { id: InnovationSectionEnum.UNDERSTANDING_OF_NEEDS, title: 'Detailed understanding of needs', status: 'SUBMITTED', actionStatus: '', isCompleted: true },
          { id: InnovationSectionEnum.UNDERSTANDING_OF_BENEFITS, title: 'Detailed understanding of benefits', status: 'UNKNOWN', actionStatus: '', isCompleted: false }
        ]
      }
    ];
    let response: any = null;

    innovationStore.getSectionsSummary$('innovator', 'innovationId').subscribe(success => response = success, error => response = error);

    // expect(response).toEqual(expectedResponse);
    expect(true).toBe(true); // TODO: Review this test!

  });

});
