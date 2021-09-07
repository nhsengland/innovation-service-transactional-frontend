import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

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

    authenticationStore = TestBed.inject(AuthenticationStore);
    innovatorService = TestBed.inject(InnovatorService);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
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


  it('should load innovation transfer information', () => {

    activatedRoute.snapshot.params = { stepId: 1 };
    activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.

    innovatorService.getInnovationTransfers = () => of();

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.wizard).toBe(INNOVATION_TRANSFER);

  });


  it('should do nothing when submitting a step and form not is valid', () => {

    activatedRoute.snapshot.params = { stepId: 1 };
    activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.

    const expected = {};

    fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    spyOn(component.formEngineComponent, 'getFormValues').and.returnValue({ valid: false, data: { value1: 'some value' } });
    component.onSubmitStep('next', new Event(''));
    fixture.detectChanges();

    expect(component.wizard.getAnswers()).toEqual(expected);

  });

  // it('should redirect when submitting a step', () => {

  //   const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

  //   activatedRoute.snapshot.data = { module: 'innovator' };
  //   activatedRoute.snapshot.params = { stepId: 1 };
  //   activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.
  //   authenticationStore.isInnovatorType = () => true;

  //   fixture = TestBed.createComponent(InnovationTransferAcceptanceComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
  //   spyOn(component.formEngineComponent, 'getFormValues').and.returnValue({ valid: true });
  //   component.onSubmitStep('next', new Event(''));
  //   fixture.detectChanges();

  //   expect(routerSpy).toHaveBeenCalledWith(['/innovator/account/manage-details/edit/2']);

  // });

});
