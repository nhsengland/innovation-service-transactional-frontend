import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Injector } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserRoleEnum } from '@app/base/enums';

import { AppInjector, CoreModule } from '@modules/core';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';
import { CtxStore, StoresModule } from '@modules/stores';
import { of, Subject, throwError } from 'rxjs';

import { FirstTimeSigninComponent } from './first-time-signin.component';

import { InnovatorService } from '../../services/innovator.service';

describe('FeatureModules/Innovator/Pages/FirstTimeSignin/FirstTimeSigninComponent', () => {
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let innovatorService: InnovatorService;

  let component: FirstTimeSigninComponent;
  let fixture: ComponentFixture<FirstTimeSigninComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, InnovatorModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    innovatorService = TestBed.inject(InnovatorService);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should preserve givenName and surname in the outbound payload', () => {
    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizard.addAnswers({ givenName: 'Ada', surname: 'Lovelace' });

    expect(component.wizard.runOutboundParsing()).toMatchObject({
      givenName: 'Ada',
      surname: 'Lovelace'
    });
  });

  it('should keep the organisation question after adding the two name steps', () => {
    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.wizard.steps[2]?.parameters[0]?.id).toBe('isCompanyOrOrganisation');
  });

  describe('acknowledged names after onboarding', () => {
    const submittedNames = { givenName: 'Ada', surname: 'Lovelace', displayName: 'Ada Lovelace' };

    function prepareSubmission() {
      fixture = TestBed.createComponent(FirstTimeSigninComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const user = TestBed.inject(CtxStore).user;
      user.updateInfo({ id: 'onboarding-user', organisations: [{ id: 'organisation-id' }] });
      component.wizard.addAnswers(submittedNames);
      const save = jest.spyOn(user, 'updateUserInfo$').mockReturnValue(of({ id: 'onboarding-user' }));
      const refresh = jest.spyOn(user, 'initializeAuthentication$').mockImplementation(() => {
        user.updateInfo({ givenName: '', surname: '', displayName: '' });
        return of(true);
      });
      const navigate = jest.spyOn(component, 'redirectTo').mockImplementation(() => undefined);
      return { user, save, refresh, navigate };
    }

    it('shows acknowledged submitted names when the fresh identity still has empty names', () => {
      const { user, save, refresh, navigate } = prepareSubmission();

      component.onSubmitWizard();

      expect(save).toHaveBeenCalledTimes(1);
      expect(refresh).toHaveBeenCalledWith(true);
      expect(user.getUserInfo()).toMatchObject(submittedNames);
      expect(navigate).toHaveBeenCalledWith('innovator/dashboard', { alert: 'alertDisabled' });
      expect(component.isSaving).toBe(false);
    });

    it('changes only display fields and retains refreshed server onboarding state', () => {
      const { user, refresh } = prepareSubmission();
      refresh.mockImplementation(() => {
        user.updateInfo({ givenName: 'Old', surname: 'Name', displayName: 'Old Name', firstTimeSignInAt: null });
        return of(true);
      });

      component.onSubmitWizard();

      expect(user.getUserInfo()).toMatchObject({ ...submittedNames, id: 'onboarding-user', firstTimeSignInAt: null });
      expect(user.getUserInfo().organisations[0].id).toBe('organisation-id');
    });

    it("does not apply another identity's submitted name after the refresh changes user", () => {
      const { user, refresh, navigate } = prepareSubmission();
      refresh.mockImplementation(() => {
        user.updateInfo({ id: 'different-user', givenName: 'Other', surname: 'Person', displayName: 'Other Person' });
        return of(true);
      });

      component.onSubmitWizard();

      expect(user.getUserInfo().displayName).toBe('Other Person');
      expect(navigate).not.toHaveBeenCalled();
      expect(component.alert.type).toBe('ERROR');
      expect(component.isSaving).toBe(false);
    });

    it('does not claim success or refresh after the profile write fails', () => {
      const { user, save, refresh, navigate } = prepareSubmission();
      save.mockReturnValue(throwError(() => new Error('Profile write failed')));

      component.onSubmitWizard();

      expect(refresh).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
      expect(user.getUserInfo().displayName).not.toBe(submittedNames.displayName);
      expect(component.alert.type).toBe('ERROR');
      expect(component.isSaving).toBe(false);
    });

    it('does not navigate or invent a profile after the post-save refresh fails', () => {
      const { user, refresh, navigate } = prepareSubmission();
      refresh.mockReturnValue(throwError(() => new Error('Refresh timed out')));

      component.onSubmitWizard();

      expect(navigate).not.toHaveBeenCalled();
      expect(user.getUserInfo().displayName).not.toBe(submittedNames.displayName);
      expect(component.alert.type).toBe('ERROR');
      expect(component.isSaving).toBe(false);
    });

    it('waits for the acknowledged write before refreshing or displaying submitted names', () => {
      const { user, save, refresh, navigate } = prepareSubmission();
      const pendingSave = new Subject<{ id: string }>();
      save.mockReturnValue(pendingSave);

      component.onSubmitWizard();

      expect(refresh).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
      expect(user.getUserInfo().displayName).not.toBe(submittedNames.displayName);
      expect(component.isSaving).toBe(true);

      pendingSave.next({ id: 'onboarding-user' });
      pendingSave.complete();
      expect(user.getUserInfo()).toMatchObject(submittedNames);
    });

    it('waits for a delayed context refresh and preserves its authoritative roles', () => {
      const { user, refresh, navigate } = prepareSubmission();
      const pendingRefresh = new Subject<boolean>();
      refresh.mockReturnValue(pendingRefresh);

      component.onSubmitWizard();

      expect(navigate).not.toHaveBeenCalled();
      expect(component.isSaving).toBe(true);
      user.updateInfo({
        roles: [{ id: 'fresh-role', role: UserRoleEnum.INNOVATOR }],
        firstTimeSignInAt: null,
        termsOfUseAccepted: false,
        displayName: 'Old name'
      });
      pendingRefresh.next(true);
      pendingRefresh.complete();

      expect(user.getUserInfo()).toMatchObject({
        ...submittedNames,
        roles: [{ id: 'fresh-role', role: UserRoleEnum.INNOVATOR }],
        firstTimeSignInAt: null,
        termsOfUseAccepted: false
      });
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(component.isSaving).toBe(false);
    });
  });

  // it('should NOT have default information loaded', () => {

  //   organisationsService.getAccessorsOrganisations = () => throwError('error');

  //   fixture = TestBed.createComponent(FirstTimeSigninComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.pageStatus).toBe('READY');

  // });

  // it('should run onSubmitStep() with UNDEFINED formEngineComponent field', () => {

  //   fixture = TestBed.createComponent(FirstTimeSigninComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.formEngineComponent = undefined;

  //   component.onSubmitStep('next');
  //   expect(component.wizard.currentAnswers).toEqual({
  //     innovatorName: '',
  //     innovationName: '',
  //     innovationDescription: '',
  //     isCompanyOrOrganisation: 'NO',
  //     organisationName: '',
  //     organisationSize: null,
  //     location: '',
  //     englandPostCode: null,
  //     locationCountryName: '',
  //     mobilePhone: null,
  //     organisationShares: ['orgId01', 'orgId02']
  //   });

  // });

  // it('should run onSubmitStep() and DO NOTHING with form NOT valid', () => {

  //   fixture = TestBed.createComponent(FirstTimeSigninComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
  //   component.formEngineComponent.getFormValues = () => ({ valid: false, data: { value: 'some value' } });

  //   component.onSubmitStep('next');
  //   expect(component.wizard.currentAnswers).toEqual({
  //     innovatorName: '',
  //     innovationName: '',
  //     innovationDescription: '',
  //     isCompanyOrOrganisation: 'NO',
  //     organisationName: '',
  //     organisationSize: null,
  //     location: '',
  //     englandPostCode: null,
  //     locationCountryName: '',
  //     mobilePhone: null,
  //     organisationShares: ['orgId01', 'orgId02']
  //   });

  // });

  // it('should run onSubmitStep() and redirect because is the first step', () => {

  //   fixture = TestBed.createComponent(FirstTimeSigninComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
  //   component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });

  //   component.onSubmitStep('previous');
  //   expect(routerSpy).toHaveBeenCalledWith(['innovator'], {});

  // });

  // it('should run onSubmitStep() and go to previous step', () => {

  //   fixture = TestBed.createComponent(FirstTimeSigninComponent);
  //   component = fixture.componentInstance;
  //   component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
  //   component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
  //   fixture.detectChanges();

  //   component.wizard.gotoStep(3);

  //   component.onSubmitStep('previous');
  //   expect(component.wizard.currentStepId).toBe(2);

  // });

  // it('should run onSubmitStep() and go to next step', () => {

  //   fixture = TestBed.createComponent(FirstTimeSigninComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
  //   component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
  //   component.wizard.gotoStep(1);

  //   component.onSubmitStep('next');
  //   expect(component.wizard.currentStepId).toBe(2);

  // });

  // it('should run onSubmitStep() and do NOTHING with invalid action', () => {

  //   fixture = TestBed.createComponent(FirstTimeSigninComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
  //   component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
  //   component.wizard.gotoStep(1);

  //   component.onSubmitStep('invalid' as any);
  //   expect(component.wizard.currentStepId).toBe(1);

  // });

  // it('should run onSubmitWizard() with API success', () => {

  //   authenticationStore.initializeAuthentication$ = () => of(true);
  //   innovatorService.submitFirstTimeSigninInfo = () => of({ id: 'id' });

  //   fixture = TestBed.createComponent(FirstTimeSigninComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onSubmitWizard();
  //   expect(routerSpy).toHaveBeenCalledWith(['innovator/dashboard'], { queryParams: { alert: 'alertDisabled' } });
  // });

  // it('should run onSubmitWizard() with API error', () => {

  //   innovatorService.submitFirstTimeSigninInfo = () => throwError('error');

  //   fixture = TestBed.createComponent(FirstTimeSigninComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmitWizard();
  //   fixture.detectChanges();
  //   expect(component.alert).toEqual({
  //     type: 'ERROR',
  //     title: 'An unknown error occurred',
  //     message: 'You may try to go back and try again.',
  //     setFocus: true
  //   });

  // });
});
