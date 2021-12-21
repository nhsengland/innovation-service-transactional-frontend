import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@shared-module/shared.module';

import { PageAccountDeleteAccountMessageComponent } from './delete-account-message.component';


describe('Shared/Pages/ManageDeleteAccount/PageAccountManageUserAccountNewComponent', () => {

  let component: PageAccountDeleteAccountMessageComponent;
  let fixture: ComponentFixture<PageAccountDeleteAccountMessageComponent>;

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

    fixture = TestBed.createComponent(PageAccountDeleteAccountMessageComponent);
    component = fixture.componentInstance;

  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
