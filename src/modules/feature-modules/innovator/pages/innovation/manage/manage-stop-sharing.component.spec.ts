import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { Router } from '@angular/router';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { AppInjector, CoreModule } from '@modules/core';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { AuthenticationStore, StoresModule } from '@modules/stores';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { PageInnovationManageStopSharingComponent } from './manage-stop-sharing.component';

describe('FeatureModules/Innovator/Pages/Account/PageAccountInnovationsStopSharingComponent', () => {
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let authenticationStore: AuthenticationStore;
  let innovationsService: InnovationsService;
  let innovatorService: InnovatorService;

  let component: PageInnovationManageStopSharingComponent;
  let fixture: ComponentFixture<PageInnovationManageStopSharingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, CoreModule, StoresModule, InnovatorModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    authenticationStore = TestBed.inject(AuthenticationStore);
    innovationsService = TestBed.inject(InnovationsService);
    innovatorService = TestBed.inject(InnovatorService);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageInnovationManageStopSharingComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
