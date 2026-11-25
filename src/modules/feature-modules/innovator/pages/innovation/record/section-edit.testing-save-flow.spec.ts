import '@modules/core';
import { of, Subject, throwError } from 'rxjs';
import { InnovationSectionEditComponent } from './section-edit.component';

describe('Testing with users saving', () => {
  function setup(isChangeMode = false, sectionId = 'TESTING_WITH_USERS') {
    const answers = { involvedUsersDesignProcess: 'IN_PROGRESS', userTests: [] };
    const wizard: any = {
      currentStepId: 1,
      getAnswers: () => ({ userTests: [] }),
      addAnswers: jest.fn(() => wizard),
      runRules: jest.fn(() => wizard),
      getNextStep: jest.fn(() => 2),
      getPreviousStep: jest.fn(() => 1),
      runOutboundParsing: jest.fn(() => answers),
      validateData: () => ({ valid: true, errors: [] })
    };
    const innovation = {
      updateSectionInfo$: jest.fn(() => of({})),
      submitSections$: jest.fn(() => of({}))
    };
    const component = Object.assign(Object.create(InnovationSectionEditComponent.prototype), {
      sectionId,
      isChangeMode,
      isRegulationsSection: false,
      isInMemoryStepNavigation: false,
      allowMarkSectionAsComplete: true,
      innovation: { id: 'innovation', status: 'CREATED' },
      baseUrl: '/innovator/innovations/innovation/record/sections/' + sectionId,
      sectionStatus: 'DRAFT',
      wizard,
      formEngineComponent: {
        getFormValues: () => ({ valid: true, data: { involvedUsersDesignProcess: 'IN_PROGRESS' } })
      },
      ctx: {
        innovation,
        schema: {
          getIrSchemaSectionIdentificationV3: () => ({
            group: { number: 1 },
            section: { number: 2, title: 'Testing' }
          }),
          getIrSchemaTranslationsMap: () => ({ subsections: new Map(), questions: new Map() })
        }
      },
      location: { replaceState: jest.fn() },
      onGoToStep: jest.fn(),
      resetAlert: jest.fn(),
      setBackLink: jest.fn(),
      redirectTo: jest.fn(),
      setRedirectAlertSuccess: jest.fn(),
      setAlertError: jest.fn(),
      setAlertUnknownError: jest.fn()
    });
    return { component, innovation, wizard, answers };
  }

  it.each([false, true])('keeps incomplete answers in memory when advancing (change mode: %s)', isChangeMode => {
    const { component, innovation, wizard } = setup(isChangeMode);
    component.onSubmitStep('next');
    expect(wizard.addAnswers).toHaveBeenCalledWith({ involvedUsersDesignProcess: 'IN_PROGRESS' });
    expect(innovation.updateSectionInfo$).not.toHaveBeenCalled();
    expect(component.onGoToStep).toHaveBeenCalledWith(2, isChangeMode);
    expect(component.location.replaceState).toHaveBeenCalledWith(
      component.baseUrl + '/edit/2',
      isChangeMode ? 'isChangeMode=true' : ''
    );
  });

  it('goes back without reloading the normal testing flow', () => {
    const { component } = setup();
    component.wizard.currentStepId = 2;
    component.onSubmitStep('previous');
    expect(component.onGoToStep).toHaveBeenCalledWith(1, false);
    expect(component.redirectTo).not.toHaveBeenCalled();
    expect(component.location.replaceState).toHaveBeenCalledWith(component.baseUrl + '/edit/1', '');
  });

  it.each([false, true])('waits for the final data save before completing (change mode: %s)', isChangeMode => {
    const { component, innovation, answers } = setup(isChangeMode);
    const save = new Subject();
    innovation.updateSectionInfo$.mockReturnValue(save as any);
    component.onSubmitSection();
    expect(innovation.updateSectionInfo$).toHaveBeenCalledWith('innovation', 'TESTING_WITH_USERS', answers);
    expect(innovation.submitSections$).not.toHaveBeenCalled();
    save.next({});
    save.complete();
    expect(innovation.submitSections$).toHaveBeenCalledWith('innovation', 'TESTING_WITH_USERS');
    expect(component.setRedirectAlertSuccess).toHaveBeenCalled();
  });

  it('does not complete the section when saving fails', () => {
    const { component, innovation } = setup();
    innovation.updateSectionInfo$.mockReturnValue(throwError(() => new Error('save failed')));
    component.onSubmitSection();
    expect(innovation.submitSections$).not.toHaveBeenCalled();
    expect(component.setRedirectAlertSuccess).not.toHaveBeenCalled();
    expect(component.setAlertError).toHaveBeenCalled();
  });

  it('reports a completion failure without showing success', () => {
    const { component, innovation } = setup();
    innovation.submitSections$.mockReturnValue(throwError(() => new Error('submit failed')));
    component.onSubmitSection();
    expect(component.setRedirectAlertSuccess).not.toHaveBeenCalled();
    expect(component.setAlertError).toHaveBeenCalled();
  });

  it('keeps per-step saving for other sections', () => {
    const { component, innovation } = setup(false, 'MARKET_RESEARCH');
    component.onSubmitStep('next');
    expect(innovation.updateSectionInfo$).toHaveBeenCalled();
  });

  it('does not advance when the current answer is invalid', () => {
    const { component, innovation } = setup();
    component.formEngineComponent.getFormValues = () => ({ valid: false, data: {} });
    component.onSubmitStep('next');
    expect(component.onGoToStep).not.toHaveBeenCalled();
    expect(innovation.updateSectionInfo$).not.toHaveBeenCalled();
  });

  it('ignores a second completion click while the testing answers are saving', () => {
    const { component, innovation } = setup();
    const save = new Subject();
    innovation.updateSectionInfo$.mockReturnValue(save as any);
    component.onSubmitSection();
    component.onSubmitSection();
    expect(innovation.updateSectionInfo$).toHaveBeenCalledTimes(1);
  });
});
