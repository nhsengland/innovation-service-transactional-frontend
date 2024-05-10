import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ThemeModule } from '@modules/theme/theme.module';

import { SpinnerComponent } from './spinner.component';
import { RouterModule } from '@angular/router';

describe('Theme/Components/Spinner/SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, ThemeModule],
      declarations: []
    });

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });
});
