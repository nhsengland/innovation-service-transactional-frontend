import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, interval } from 'rxjs';

import { CoreComponent } from '@app/base';
import { UtilsHelper } from '@app/base/helpers';
import { MappedObjectType } from '@app/base/types';
import { FormEngineComponent, FormEngineHelper, FormEngineParameterModel } from '@modules/shared/forms';
import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { AssessmentService } from '../../../services/assessment.service';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-assessment-pages-innovation-assessment-edit',
  templateUrl: './assessment-edit.component.html'
})
export class InnovationAssessmentEditComponent extends CoreComponent implements OnInit {

  @ViewChildren(FormEngineComponent) formEngineComponent?: QueryList<FormEngineComponent>;

  innovationId: string;
  innovationName: string;
  assessmentId: string;
  stepId: number;
  errorParameter: boolean = false;

  form: {
    sections: {
      title: string;
      parameters: FormEngineParameterModel[];
    }[];
    data: { [key: string]: any };
  };

  errors: {
    id: string;
    title: string;
    callback: string;
  }[] = [];

  assessmentHasBeenSubmitted: null | boolean;

  currentAnswers: { [key: string]: any };

  saveButton: {
    disabled: boolean,
    label: 'Save changes' | 'All changes are saved'
  } = { disabled: true, label: 'All changes are saved' };

  isValidStepId(): boolean {
    const id = this.stepId;
    return (1 <= Number(id) && Number(id) <= 2);
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected assessmentService: AssessmentService,
    protected organisationsService: OrganisationsService,
    protected innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovationName = '';
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
    this.stepId = this.activatedRoute.snapshot.params.stepId;

    this.form = { sections: [], data: {} };

    this.assessmentHasBeenSubmitted = null;

    this.currentAnswers = {};
  }


  ngOnInit(): void {

    forkJoin([
      this.organisationsService.getOrganisationsList({ unitsInformation: true }),
      this.innovationsService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId),
    ]).subscribe(([organisationUnits, needsAssessment]) => {

      // Update last step with the organisations list with description and pre-select all checkboxes.
      NEEDS_ASSESSMENT_QUESTIONS.suggestedOrganisationUnitsIds[0].description = `Please select all organisations you think are in a position to offer support, assessment or other type of engagement at this time. The qualifying accessors of the organisations you select will be notified. <br /> <a href="/about-the-service/who-we-are" target="_blank" rel="noopener noreferrer"> Support offer guide (opens in a new window) </a>`;
      NEEDS_ASSESSMENT_QUESTIONS.suggestedOrganisationUnitsIds[0].groupedItems = organisationUnits.map(item => ({ value: item.id, label: item.name, items: item.organisationUnits.map(i => ({ value: i.id, label: i.name })) }));

      this.innovationName = this.stores.context.getInnovation().name;

      this.form.data = {
        ...needsAssessment,
        suggestedOrganisationUnitsIds: needsAssessment.suggestedOrganisations.reduce((unitsAcc: string[], o) => [...unitsAcc, ...o.units.map(u => u.id)], [])
      };

      if (this.errorParameter && this.stepId === 2) {

        const parameters = [...NEEDS_ASSESSMENT_QUESTIONS.innovation, ...NEEDS_ASSESSMENT_QUESTIONS.innovator, ...NEEDS_ASSESSMENT_QUESTIONS.summary, ...NEEDS_ASSESSMENT_QUESTIONS.suggestedOrganisationUnitsIds];

        this.errors = Object.entries(FormEngineHelper.getErrors(this.buildEntireForm())).map(([key]) => this.errorObject(key, parameters));

        this.displayAlertError();
      }

      this.assessmentHasBeenSubmitted = !!needsAssessment.finishedAt;

      this.setPageStatus('READY');

    });

    this.subscriptions.push(

      this.activatedRoute.queryParamMap
        .subscribe(params => {
          this.errorParameter = Boolean(params.get('error'));
        }),

      this.activatedRoute.params.subscribe(params => {

        this.stepId = Number(params.stepId);

        if (!this.isValidStepId()) {
          this.redirectTo('/not-found');
          return;
        }

        switch (this.stepId) {
          case 1:
            this.form.sections = [
              { title: 'The innovation', parameters: NEEDS_ASSESSMENT_QUESTIONS.innovation },
              { title: 'The innovator', parameters: NEEDS_ASSESSMENT_QUESTIONS.innovator }
            ];
            this.setBackLink('Back to innovation', `/assessment/innovations/${this.innovationId}`);
            break;
          case 2:
            this.form.sections = [
              { title: 'Support need summary', parameters: NEEDS_ASSESSMENT_QUESTIONS.summary },
              { title: '', parameters: NEEDS_ASSESSMENT_QUESTIONS.suggestedOrganisationUnitsIds }
            ];
            if (this.errorParameter) {
              this.setBackLink('Go back', `/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/1?error=true`);
            } else {
              this.setBackLink('Go back', `/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/1`);
            }
            break;
        }

        this.setPageTitle('Needs assessment', { hint: `${this.stepId} of 2` });
        this.setPageStatus('READY');

      })
    );

    this.subscriptions.push(
      interval(1000 * 60).subscribe(() => {
        if (!this.saveButton.disabled) {
          this.onSubmit('autosave');
        }
      })
    );

  }

  errorObject(key: string, parameters: FormEngineParameterModel[]): {
    id: string;
    title: string;
    callback: string;
  } {
    return {
      id: key,
      title: `${parameters.find(p => p.id === key)?.label} (on step ${[...NEEDS_ASSESSMENT_QUESTIONS.innovation, ...NEEDS_ASSESSMENT_QUESTIONS.innovator].find(question => question.id === key) ? 1 : 2})` || '',
      callback: `/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/${[...NEEDS_ASSESSMENT_QUESTIONS.innovation, ...NEEDS_ASSESSMENT_QUESTIONS.innovator].find(question => question.id === key) ? 1 : 2}?error=true`,
    }
  }

  displayAlertError(): void {
    this.resetAlert();
    if (this.errors.length >= 1) this.setAlertError('Review and complete these questions.', { itemsList: this.errors });
  }

  buildEntireForm(): FormGroup<any> {
    const parameters = [...NEEDS_ASSESSMENT_QUESTIONS.innovation, ...NEEDS_ASSESSMENT_QUESTIONS.innovator, ...NEEDS_ASSESSMENT_QUESTIONS.summary, ...NEEDS_ASSESSMENT_QUESTIONS.suggestedOrganisationUnitsIds];
    return FormEngineHelper.buildForm(parameters, this.form.data);
  }

  onSubmit(action: 'saveAsDraft' | 'submit' | 'saveAsDraftFirstSection' | 'saveAsDraftSecondSection' | 'autosave'): void {

    let isValid = true;

    if (action === 'submit') {

      const form = this.buildEntireForm();

      if (!form.valid) /* istanbul ignore next */ {
        isValid = false;
      }
    }

    // This section is not easy to test. TOIMPROVE: Include this code on unit test.
    (this.formEngineComponent?.toArray() || []).forEach(engine => /* istanbul ignore next */ {

      let formData: MappedObjectType;

      formData = engine.getFormValues(false);

      this.currentAnswers = {
        ...this.currentAnswers,
        // Update to null empty values.
        ...Object.entries(formData?.data).reduce((accumulator, [key, value]) => {
          return { ...accumulator, [key]: UtilsHelper.isEmpty(value) ? null : value };
        }, {})
      }

    });

    this.assessmentService.updateInnovationNeedsAssessment(this.innovationId, this.assessmentId, (this.stepId === 2 && action === 'submit'), this.currentAnswers).subscribe({
      next: () => {
        switch (action) {
          case 'autosave':
          case 'saveAsDraft':
            this.saveButton = { disabled: true, label: 'All changes are saved' };
            break;
          case 'saveAsDraftFirstSection':
            this.reuseRouteStrategy();
            if (this.errorParameter) {
              this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/2`, { error: true });
            } else {
              this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/2`);
            }
            break;
          case 'saveAsDraftSecondSection':
            this.reuseRouteStrategy();
            if (this.errorParameter) {
              this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/1`, { error: true });
            } else {
              this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/1`);
            }
            break;
          case 'submit':
            if (isValid) {
              this.setRedirectAlertSuccess('Needs assessment successfully completed');
              this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}`);
            } else {
              this.reuseRouteStrategy();
              this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/2`, { error: true });
            }
            break;
          default:
            break;
        }
      },
      error: () => this.setAlertError('An error occurred when starting needs assessment. Please try again or contact us for further help')
    });
  }

  onFormLoaded(): void {
    if (this.errorParameter) {
      (this.formEngineComponent?.toArray() || []).forEach(engine => /* istanbul ignore next */ {
        engine.form.markAllAsTouched();
      });
    }
  }

  onFormChange(): void {

    this.saveButton = { disabled: false, label: 'Save changes' };

    (this.formEngineComponent?.toArray() || []).forEach(engine => /* istanbul ignore next */ {

      let formData: MappedObjectType;
      formData = engine.getFormValues(false);

      const indexOfError = this.errors.map(e => e.id).indexOf(Object.keys(formData.data)[0]);

      if (formData.valid && indexOfError !== -1) {

        this.errors.splice(indexOfError, 1);

      } else if (formData.valid === false && indexOfError === -1) {

        const key = Object.keys(formData.data)[0];
        const parameters = [...NEEDS_ASSESSMENT_QUESTIONS.summary, ...NEEDS_ASSESSMENT_QUESTIONS.suggestedOrganisationUnitsIds];

        const error = this.errorObject(key, parameters);

        this.errors.push(error);
      }
    });

    if (this.stepId === 2 && this.errorParameter) {
      this.displayAlertError();
    }
  }

  private reuseRouteStrategy(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';
  }

}
