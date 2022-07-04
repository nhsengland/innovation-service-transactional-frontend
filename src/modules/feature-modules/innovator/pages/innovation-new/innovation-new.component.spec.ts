import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';
import { FormEngineComponent } from '@modules/shared/forms';

import { InnovationNewComponent } from './innovation-new.component';

import { InnovatorService } from '../../services/innovator.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';


describe('FeatureModules/Innovator/Pages/InnovationNew/InnovationNewComponent', () => {

  let router: Router;
  let routerSpy: jasmine.Spy;

  let authenticationStore: AuthenticationStore;
  let innovatorService: InnovatorService;
  let organisationsService: OrganisationsService;

  let component: InnovationNewComponent;
  let fixture: ComponentFixture<InnovationNewComponent>;

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

    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

    authenticationStore = TestBed.inject(AuthenticationStore);
    innovatorService = TestBed.inject(InnovatorService);
    organisationsService = TestBed.inject(OrganisationsService);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;
    organisationsService.getAccessorsOrganisations = () => of([{ id: 'orgId', name: 'Org name' }]);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should run onSubmitStep() with UNDEFINED formEngineComponent field', () => {

    fixture = TestBed.createComponent(InnovationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.formEngineComponent = undefined;

    component.onSubmitStep('next', new Event(''));
    expect(component.wizard.getAnswers()).toEqual({
      innovationName: '',
      innovationDescription: '',
      location: '',
      locationCountryName: '',
      englandPostCode: '',
      organisationShares: ['orgId']
    });

  });

  it('should run onSubmitStep() and DO NOTHING with form NOT valid', () => {

    fixture = TestBed.createComponent(InnovationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: false, data: { value1: 'some value' } });

    component.onSubmitStep('next', new Event(''));
    expect(component.wizard.getAnswers()).toEqual({
      innovationName: '',
      innovationDescription: '',
      location: '',
      locationCountryName: '',
      englandPostCode: '',
      organisationShares: ['orgId']
    });

  });

  it('should run onSubmitStep() and redirect to next step', () => {

    fixture = TestBed.createComponent(InnovationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value1: 'some value' } });

    component.onSubmitStep('next', new Event(''));
    expect(component.wizard.currentStepId).toBe(2);

  });

  it('should run submitWizard and call api with success', () => {

    innovatorService.createInnovation = () => of({ id: 'Inno01' });
    authenticationStore.initializeAuthentication$ = () => of(true);

    fixture = TestBed.createComponent(InnovationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.submitWizard();
    expect(routerSpy).toHaveBeenCalledWith(['innovator/innovations/Inno01'], { queryParams: { alert: 'innovationCreationSuccess', name: '' } });

  });

  it('should run submitWizard and call api with error', () => {

    innovatorService.createInnovation = () => throwError('error');
    authenticationStore.initializeAuthentication$ = () => of(true);

    const expected = {
      type: 'ERROR',
      title: 'An error occurred when creating the innovation',
      message: 'Please try again or contact us for further help',
      setFocus: true
    };

    fixture = TestBed.createComponent(InnovationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.submitWizard();
    expect(component.alert).toEqual(expected);

  });

  it('should run navigateTo() when pressing PREVIOUS on first step', () => {

    fixture = TestBed.createComponent(InnovationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.navigateTo('previous');
    expect(routerSpy).toHaveBeenCalledWith(['innovator/dashboard'], {});

  });

  it('should run navigateTo() when pressing PREVIOUS on a question step ', () => {

    fixture = TestBed.createComponent(InnovationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizard.gotoStep(2);

    component.navigateTo('previous');
    expect(component.wizard.currentStepId).toBe(1);

  });

  it('should run navigateTo() when pressing NEXT on last step', () => {

    fixture = TestBed.createComponent(InnovationNewComponent);
    component = fixture.componentInstance;
    component.wizard.gotoStep(5);
    fixture.detectChanges();

    const spy = spyOn(component, 'submitWizard');

    component.navigateTo('next');
    expect(spy).toHaveBeenCalled();

  });

  it('should run navigateTo() for last step when pressing NEXT', () => {

    fixture = TestBed.createComponent(InnovationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizard.gotoStep(2);

    component.navigateTo('next');
    expect(component.wizard.currentStepId).toBe(3);

  });

  it('should run navigateTo() when passing an INVALID action', () => {

    fixture = TestBed.createComponent(InnovationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.navigateTo('invalidAction' as any);
    expect(component.wizard.currentStepId).toBe(1);

  });

});
