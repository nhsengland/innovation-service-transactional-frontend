import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ThemeModule } from '@modules/theme/theme.module';

import { SurveyEndComponent } from './end.component';

describe('SurveyEndComponent', () => {

  let component: SurveyEndComponent;
  let fixture: ComponentFixture<SurveyEndComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ThemeModule
      ],
      declarations: [
        SurveyEndComponent,
      ],
    }).compileComponents();

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(SurveyEndComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();

  });

});
