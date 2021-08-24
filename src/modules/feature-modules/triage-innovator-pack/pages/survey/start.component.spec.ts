import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { TriageInnovatorPackModule } from '@modules/feature-modules/triage-innovator-pack/triage-innovator-pack.module';

import { SurveyStartComponent } from './start.component';

describe('SurveyStartComponent', () => {

  let component: SurveyStartComponent;
  let fixture: ComponentFixture<SurveyStartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        TriageInnovatorPackModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    fixture = TestBed.createComponent(SurveyStartComponent);
    component = fixture.componentInstance;

  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
