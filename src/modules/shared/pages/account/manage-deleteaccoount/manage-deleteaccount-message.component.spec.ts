import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@shared-module/shared.module';

import { PageAccountManageUserDeleteAccountMesasageComponent } from './manage-deleteaccount-message.component';


describe('Shared/Pages/ManageDeleteAccount/PageAccountManageUserAccountNewComponent', () => {

  let component: PageAccountManageUserDeleteAccountMesasageComponent;
  let fixture: ComponentFixture<PageAccountManageUserDeleteAccountMesasageComponent>;
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

    fixture = TestBed.createComponent(PageAccountManageUserDeleteAccountMesasageComponent);
    component = fixture.componentInstance;

  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
