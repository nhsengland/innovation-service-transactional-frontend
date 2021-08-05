import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';


import { PageAccountManageDetailsEditComponent } from './manage-details-edit.component';


describe('Shared/Pages/Account/PageAccountManageDetailsEditComponent', () => {

  let activatedRoute: ActivatedRoute;
  let authenticationStore: AuthenticationStore;

  let component: PageAccountManageDetailsEditComponent;
  let fixture: ComponentFixture<PageAccountManageDetailsEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        SharedModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);
    activatedRoute = TestBed.inject(ActivatedRoute);

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(PageAccountManageDetailsEditComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();

  });

});
