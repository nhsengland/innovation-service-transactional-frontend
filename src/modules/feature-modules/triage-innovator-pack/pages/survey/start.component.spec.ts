import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SurveyStartComponent } from './start.component';

describe('SurveyStartComponent', () => {

  let component: SurveyStartComponent;
  let fixture: ComponentFixture<SurveyStartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        SurveyStartComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyStartComponent);
    component = fixture.componentInstance;

  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
