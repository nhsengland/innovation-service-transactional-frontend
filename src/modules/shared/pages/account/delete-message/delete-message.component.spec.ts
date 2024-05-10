import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { PageAccountDeleteMessageComponent } from './delete-message.component';
import { RouterModule } from '@angular/router';

describe('Shared/Pages/ManageDeleteAccount/PageAccountManageUserAccountNewComponent', () => {
  let component: PageAccountDeleteMessageComponent;
  let fixture: ComponentFixture<PageAccountDeleteMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, CoreModule, StoresModule, SharedModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    fixture = TestBed.createComponent(PageAccountDeleteMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
