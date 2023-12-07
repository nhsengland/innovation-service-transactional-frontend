import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AlertComponent } from './alert.component';

describe('Theme/Components/Alert/AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [AlertComponent]
    });
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
