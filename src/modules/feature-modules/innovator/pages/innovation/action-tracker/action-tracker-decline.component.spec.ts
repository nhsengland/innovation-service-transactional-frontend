import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationActionTrackerDeclineComponent } from './action-tracker-decline.component';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


describe('FeatureModules/Innovator/Innovation/InnovationActionTrackerEditComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovatorService: InnovatorService;

  let component: InnovationActionTrackerDeclineComponent;
  let fixture: ComponentFixture<InnovationActionTrackerDeclineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    innovatorService = TestBed.inject(InnovatorService);

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationActionTrackerDeclineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should run onSubmit() with invalid form', () => {

    fixture = TestBed.createComponent(InnovationActionTrackerDeclineComponent);
    component = fixture.componentInstance;

    component.onSubmit();
    fixture.detectChanges();
    expect(component.form.valid).toEqual(false);

  });

});
