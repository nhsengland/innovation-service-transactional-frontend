import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AuthenticationModule } from '@modules/feature-modules/authentication/authentication.module';

import { SignUpConfirmationComponent } from './sign-up-confirmation.component';
import { RouterModule } from '@angular/router';

describe('FeatureModules/Authentication/SignUpConfirmationComponent', () => {
  let component: SignUpConfirmationComponent;
  let fixture: ComponentFixture<SignUpConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, CoreModule, StoresModule, AuthenticationModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(SignUpConfirmationComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
