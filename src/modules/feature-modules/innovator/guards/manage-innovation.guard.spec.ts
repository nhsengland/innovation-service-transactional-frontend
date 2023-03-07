import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@modules/core';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { AuthenticationStore, StoresModule } from '@modules/stores';

import { ManageInnovationGuard } from './manage-innovation.guard';

describe('ManageInnovationGuard', () => {

  let guard: ManageInnovationGuard;
  let authenticationStore: AuthenticationStore;
  let innovationsService: InnovationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        ManageInnovationGuard
      ]
    });

    guard = TestBed.inject(ManageInnovationGuard);
    authenticationStore = TestBed.inject(AuthenticationStore);
    innovationsService = TestBed.inject(InnovationsService);

  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
