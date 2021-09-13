import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { PageAccountManageInnovationsArchivalComponent } from './manage-innovations-archival.component';

describe('Shared/Pages/Account/ManageInnovations/PageAccountManageInnovationsArchivalComponent', () => {

  let authenticationStore: AuthenticationStore;

  let component: PageAccountManageInnovationsArchivalComponent;
  let fixture: ComponentFixture<PageAccountManageInnovationsArchivalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(PageAccountManageInnovationsArchivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });
});
