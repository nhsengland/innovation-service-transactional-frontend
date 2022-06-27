import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CoreModule } from '@modules/core';

import { AuthenticationStore } from '../authentication/authentication.store';
import { AuthenticationService } from '../authentication/authentication.service';
import { EnvironmentStore } from './environment.store';
import { EnvironmentService } from './environment.service';

import { InnovationStatusEnum } from '@modules/shared/enums';


describe('Stores/Context/ContextStore', () => {

  let contextStore: EnvironmentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule
      ],
      providers: [
        AuthenticationStore,
        AuthenticationService,
        EnvironmentStore,
        EnvironmentService
      ]
    });

    contextStore = TestBed.inject(EnvironmentStore);

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
