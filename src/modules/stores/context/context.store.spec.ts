import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CoreModule } from '@modules/core';
import { AuthenticationStore, AuthenticationService } from '@modules/stores';

import { ContextStore } from './context.store';

import { InnovationStatusEnum } from '@modules/shared/enums';


describe('Stores/Context/ContextStore', () => {

  let contextStore: ContextStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule
      ],
      providers: [
        AuthenticationStore,
        AuthenticationService,
        ContextStore
      ]
    });

    contextStore = TestBed.inject(ContextStore);

  });


  it('should run getInnovation() and return success', () => {

    contextStore.setInnovation({
      id: 'innovationId01',
      name: 'Innovation name',
      status: InnovationStatusEnum.CREATED,
      owner: { name: 'user name', isActive: true }
    });

    expect(contextStore.getInnovation().id).toBe('innovationId01');

  });

});
