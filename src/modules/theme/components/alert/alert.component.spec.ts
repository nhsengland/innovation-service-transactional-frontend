import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AlertComponent } from './alert.component';
import { RouterModule } from '@angular/router';

describe('Theme/Components/Alert/AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, HttpClientTestingModule],
      declarations: [AlertComponent]
    });
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
