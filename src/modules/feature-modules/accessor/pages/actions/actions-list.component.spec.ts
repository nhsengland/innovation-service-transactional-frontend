import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { ActionsListComponent } from './actions-list.component';

import { AccessorService } from '../../services/accessor.service';


describe('FeatureModules/Accessor/Actions/ActionsListComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let component: ActionsListComponent;
  let fixture: ComponentFixture<ActionsListComponent>;

  let accessorService: AccessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AccessorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    accessorService = TestBed.inject(AccessorService);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(ActionsListComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
