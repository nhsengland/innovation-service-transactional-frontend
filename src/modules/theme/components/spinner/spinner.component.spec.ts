import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ThemeModule } from '@modules/theme/theme.module';

import { SpinnerComponent } from './spinner.component';


describe('Theme/Components/Spinner/SpinnerComponent', () => {

  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ThemeModule
      ],
      declarations: [

      ]
    });

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;

  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });

});
