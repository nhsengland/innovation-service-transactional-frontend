import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ThemeModule } from '@modules/theme/theme.module';

import { SignUpConfirmationComponent } from './sign-up-confirmation.component';

describe('FeatureModule/Authentication/SignUpConfirmationComponent tests Suite', () => {

  let component: SignUpConfirmationComponent;
  let fixture: ComponentFixture<SignUpConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ThemeModule
      ],
      declarations: [
        SignUpConfirmationComponent,
      ],
    }).compileComponents();

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(SignUpConfirmationComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();

  });

});
