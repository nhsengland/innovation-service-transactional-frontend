import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationSectionEditComponent } from './section-edit.component';


describe('FeatureModules/Innovator/Pages/Innovations/Sections/InnovationsSectionEditComponent', () => {

  let activatedRoute: ActivatedRoute;

  let component: InnovationSectionEditComponent;
  let fixture: ComponentFixture<InnovationSectionEditComponent>;

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

    activatedRoute = TestBed.inject(ActivatedRoute);

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();

  });

});
