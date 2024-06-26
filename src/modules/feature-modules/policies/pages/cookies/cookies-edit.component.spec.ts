import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { PoliciesModule } from '@modules/feature-modules/policies/policies.module';

import { CookiesEditComponent } from './cookies-edit.component';
import { RouterModule } from '@angular/router';

describe('CookiesInfoComponent', () => {
  let component: CookiesEditComponent;
  let fixture: ComponentFixture<CookiesEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, CoreModule, StoresModule, PoliciesModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(CookiesEditComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });
});
