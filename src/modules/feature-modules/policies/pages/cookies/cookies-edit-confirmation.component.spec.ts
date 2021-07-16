import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ThemeModule } from '@modules/theme/theme.module';

import { CookiesEditConfirmationComponent } from './cookies-edit-confirmation.component';

describe('CookiesInfoComponent', () => {

  let component: CookiesEditConfirmationComponent;
  let fixture: ComponentFixture<CookiesEditConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ThemeModule
      ],
      declarations: [
        CookiesEditConfirmationComponent,
      ],
    });

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(CookiesEditConfirmationComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();

  });

});
