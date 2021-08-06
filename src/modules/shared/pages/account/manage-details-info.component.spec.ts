import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { PageAccountManageDetailsInfoComponent } from './manage-details-info.component';

describe('Shared/Pages/Account/PageAccountManageDetailsInfoComponent', () => {

  let authenticationStore: AuthenticationStore;

  let component: PageAccountManageDetailsInfoComponent;
  let fixture: ComponentFixture<PageAccountManageDetailsInfoComponent>;

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

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(PageAccountManageDetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

});
