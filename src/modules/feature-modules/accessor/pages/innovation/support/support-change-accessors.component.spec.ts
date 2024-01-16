import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { USER_INFO_ACCESSOR } from '@tests/data.mocks';

import { AppInjector, CoreModule } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';
import { InnovationChangeAccessorsComponent } from './support-change-accessors.component';

describe('FeatureModules/Accessor/Innovation/InnovationChangeAccessorsComponent', () => {
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let authenticationStore: AuthenticationStore;
  let accessorService: AccessorService;

  let component: InnovationChangeAccessorsComponent;
  let fixture: ComponentFixture<InnovationChangeAccessorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, CoreModule, StoresModule, AccessorModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    authenticationStore = TestBed.inject(AuthenticationStore);
    accessorService = TestBed.inject(AccessorService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };

    authenticationStore.getUserInfo = () => USER_INFO_ACCESSOR;
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationChangeAccessorsComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
