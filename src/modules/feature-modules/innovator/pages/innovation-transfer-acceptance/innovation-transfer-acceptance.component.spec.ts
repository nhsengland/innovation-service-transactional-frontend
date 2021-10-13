import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';
import { FormEngineComponent } from '@modules/shared/forms';

import { InnovationTransferAcceptanceComponent } from './innovation-transfer-acceptance.component';

import { InnovatorService } from '../../services/innovator.service';

import { INNOVATION_TRANSFER } from './innovation-transfer-acceptance.config';


describe('FeatureModules/Innovator/Pages/InnovationTransferAcceptanceComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jasmine.Spy;

  let authenticationStore: AuthenticationStore;
  let innovatorService: InnovatorService;

  let component: InnovationTransferAcceptanceComponent;
  let fixture: ComponentFixture<InnovationTransferAcceptanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule,
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

    authenticationStore = TestBed.inject(AuthenticationStore);
    innovatorService = TestBed.inject(InnovatorService);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

    innovatorService.getInnovationTransfers = () => of([
      { id: 'TransferId01', email: 'some@email.com', innovation: { id: 'InnoNew01', name: 'Innovation name 01' } },
    ]);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should redirect to error if no transfer is returned', () => {

    activatedRoute.snapshot.params = { stepId: 1 };
    activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.

    innovatorService.getInnovationTransfers = () => of([]);

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['error'], {});

  });

  it('should load innovation transfer information', () => {

    activatedRoute.snapshot.params = { stepId: 1 };
    activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.wizard).toBe(INNOVATION_TRANSFER);

  });

  it('should NOT load innovations transfer information due to API error', () => {

    activatedRoute.snapshot.params = { stepId: 1 };
    activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.

    innovatorService.getInnovationTransfers = () => throwError('error');

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['error'], {});

  });


  it('should redirected because is not a valid step', () => {

    activatedRoute.snapshot.params = { stepId: 10 }; // Invalid stepId.
    activatedRoute.params = of({ stepId: 10 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['/not-found'], {});

  });


  it('should be a question step', () => {

    activatedRoute.snapshot.params = { stepId: 1 };
    authenticationStore.isInnovatorType = () => true;

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.isQuestionStep()).toBe(true);

  });

  it('should be summary step', () => {

    activatedRoute.snapshot.params = { stepId: 'summary' };
    activatedRoute.params = of({ stepId: 'summary' }); // Simulate activatedRoute.params subscription.
    authenticationStore.isInnovatorType = () => true;

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.isSummaryStep()).toBe(true);

  });


  it('should run onSubmitStep() with UNDEFINED formEngineComponent field', () => {

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;
    component.formEngineComponent = undefined;

    component.onSubmitStep('next', new Event(''));
    expect(component.wizard.currentAnswers).toEqual({});

  });

  it('should run onSubmitStep() and DO NOTHING with form NOT valid', () => {

    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: false, data: { value1: 'some value' } });

    component.onSubmitStep('next', new Event(''));
    fixture.detectChanges();
    expect(component.wizard.currentAnswers).toEqual({
      innovatorName: '',
      isCompanyOrOrganisation: 'NO',
      organisationName: '',
      organisationSize: '',
    });

  });

  it('should run onSubmitStep() and redirect to next step', () => {

    activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value1: 'some value' } });

    component.onSubmitStep('next', new Event(''));
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['/innovator/innovation-transfer-acceptance/2'], {});

  });

  it('should run onSubmitWizard and call api with success', () => {

    activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.

    innovatorService.submitFirstTimeSigninInfo = () => of({ id: 'actionId' });
    authenticationStore.initializeAuthentication$ = () => of(true);

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    component.onSubmitWizard();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['innovator/dashboard'], {});

  });

  it('should run onSubmit and call api with error', () => {

    activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.

    innovatorService.submitFirstTimeSigninInfo = () => throwError('error');
    authenticationStore.initializeAuthentication$ = () => of(true);

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    component.onSubmitWizard();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['innovator/innovation-transfer-acceptance/summary'], {});

  });

  it('should run getNavigationUrl() for first step when pressing PREVIOUS', () => {

    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.getNavigationUrl('previous')).toBe('/innovator/innovation-transfer-acceptance/1');

  });

  it('should run getNavigationUrl() for summary step when pressing PREVIOUS', () => {

    activatedRoute.snapshot.params = { stepId: 'summary' };
    activatedRoute.params = of({ stepId: 'summary' }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.getNavigationUrl('previous')).toBe('/innovator/innovation-transfer-acceptance/3');

  });

  it('should run getNavigationUrl() for a question step', () => {

    activatedRoute.snapshot.params = { stepId: 2 };
    activatedRoute.params = of({ stepId: 2 });

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.getNavigationUrl('previous')).toBe('/innovator/innovation-transfer-acceptance/1');

  });

  it('should run getNavigationUrl() for summary step when pressing NEXT', () => {

    activatedRoute.snapshot.params = { stepId: 'summary' };
    activatedRoute.params = of({ stepId: 'summary' }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.getNavigationUrl('next')).toBe('/innovator/innovation-transfer-acceptance');

  });

  it('should run getNavigationUrl() for last step when pressing NEXT', () => {

    activatedRoute.params = of({ stepId: 3 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.getNavigationUrl('next')).toBe('/innovator/innovation-transfer-acceptance/summary');

  });

  it('should run getNavigationUrl() and return initial URL with INVALID action', () => {

    activatedRoute.snapshot.params = { stepId: 2 };
    activatedRoute.params = of({ stepId: 2 });

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.getNavigationUrl('invalidAction' as any)).toBe('/innovator/innovation-transfer-acceptance');

  });

});
