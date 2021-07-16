import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ThemeModule } from '@modules/theme/theme.module';

import { CookiesInfoComponent } from './cookies-info.component';

describe('CookiesInfoComponent', () => {

  let component: CookiesInfoComponent;
  let fixture: ComponentFixture<CookiesInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ThemeModule
      ],
      declarations: [
        CookiesInfoComponent,
      ],
    });

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(CookiesInfoComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();

  });

});
