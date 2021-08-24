import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { PoliciesModule } from '@modules/feature-modules/policies/policies.module';

import { CookiesEditConfirmationComponent } from './cookies-edit-confirmation.component';

describe('CookiesInfoComponent', () => {

  let component: CookiesEditConfirmationComponent;
  let fixture: ComponentFixture<CookiesEditConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        PoliciesModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(CookiesEditConfirmationComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();

  });

});
