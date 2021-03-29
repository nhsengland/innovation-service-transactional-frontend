import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ThemeModule } from '@modules/theme/theme.module';

import { SurveyEndComponent } from './end.component';

describe('SurveyEndComponent tests Suite', () => {

  let component: SurveyEndComponent;
  let fixture: ComponentFixture<SurveyEndComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        ThemeModule
      ],
      declarations: [
        SurveyEndComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyEndComponent);
    component = fixture.componentInstance;

  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
