import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule, InnovationService } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationActionTrackerComponent } from './action-tracker.component';

describe('FeatureModules/Innovator/Innovation/ActionTrackerComponent', () => {

  let innovationService: InnovationService;

  let component: InnovationActionTrackerComponent;
  let fixture: ComponentFixture<InnovationActionTrackerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule
      ]
    }).compileComponents();

    AppInjector.setInjector(TestBed.inject(Injector));

    innovationService = TestBed.inject(InnovationService);

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationActionTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

});
