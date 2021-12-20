import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';

import { ENV } from '@tests/app.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { TriageInnovatorPackModule } from '../triage-innovator-pack.module';

import { TriageInnovatorPackLayoutComponent } from './triage-innovator-pack-layout.component';


describe('FeatureModules/TriageInnovatorPack/TriageInnovatorPackLayoutComponent', () => {

  let component: TriageInnovatorPackLayoutComponent;
  let fixture: ComponentFixture<TriageInnovatorPackLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        TriageInnovatorPackModule
      ],
      providers: [
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(TriageInnovatorPackLayoutComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
