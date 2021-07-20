import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { TriageInnovatorPackModule } from '@modules/feature-modules/triage-innovator-pack/triage-innovator-pack.module';

import { SurveyEndComponent } from './end.component';


describe('FeatureModules/TriageInnovatorPack/Pages/Survey/SurveyEndComponent', () => {

  let component: SurveyEndComponent;
  let fixture: ComponentFixture<SurveyEndComponent>;

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

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(SurveyEndComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();

  });

});
