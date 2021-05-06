import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule, InnovationService } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';


import { InnovationOverviewComponent } from './overview.component';

import { of, throwError } from 'rxjs';


describe('FeatureModules/Innovator/DashboardComponent', () => {

  let innovationService: InnovationService;

  let component: InnovationOverviewComponent;
  let fixture: ComponentFixture<InnovationOverviewComponent>;

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

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

  it('should have a innovation loaded', () => {

    spyOn(innovationService, 'getInnovationInfo').and.returnValue(of({
      id: 'abc123zxc',
      name: 'HealthyApp',
      company: 'Organisation 01',
      location: 'England',
      description: '',
      openActionsNumber: 10,
      openCommentsNumber: 10
    }));

    const expectedState = {
      innovation: {
        id: 'abc123zxc',
        name: 'HealthyApp',
        company: 'Organisation 01',
        location: 'England',
        description: '',
        openActionsNumber: 10,
        openCommentsNumber: 10
      },
    };

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.innovation).toEqual(expectedState.innovation);

  });

  it('should NOT have a innovation loaded', () => {

    spyOn(innovationService, 'getInnovationInfo').and.returnValue(throwError('error'));

    const expectedState = { innovation: {} };

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.innovation).toEqual(expectedState.innovation);

  });

});
