import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { MappedObjectType } from '@app/base/types';
import { FormEngineComponent, FormEngineParameterModel } from '@modules/shared/forms';
import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { AssessmentService } from '../../../services/assessment.service';
import { InnovationsService } from '@modules/shared/services/innovations.service';


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

  form: {
    sections: {
      title: string;
      parameters: FormEngineParameterModel[];
    }[];
    data: { [key: string]: any };
  };

  assessmentHasBeenSubmitted: null | boolean;

  currentAnswers: { [key: string]: any };

  saveAsDraft: {
    disabled: boolean,
    label: string
  } = { disabled: true, label: 'Saved' };

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
      this.organisationsService.getOrganisationsListWithUnits(),
      this.innovationsService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId),
    ]).subscribe(([organisationUnits, innovationNeedsAssessment]) => {

      // Update last step with the organisations list with description and pre-select all checkboxes.
      NEEDS_ASSESSMENT_QUESTIONS.suggestedOrganisationUnitsIds[0].description = `Please select all organisations you think are in a position to offer support, assessment or other type of engagement at this time. The qualifying accessors of the organisations you select will be notified. <br /> <a href="/about-the-service/who-we-are" target="_blank" rel="noopener noreferrer"> Support offer guide (opens in a new window) </a>`;
      NEEDS_ASSESSMENT_QUESTIONS.suggestedOrganisationUnitsIds[0].groupedItems = organisationUnits.map(item => ({ value: item.id, label: item.name, items: item.organisationUnits.map(i => ({ value: i.id, label: i.name })) }));

      this.innovationName = this.stores.context.getInnovation().name;

      this.form.data = {
        ...innovationNeedsAssessment.assessment,
        suggestedOrganisationUnitsIds: innovationNeedsAssessment.assessment.suggestedOrganisations.reduce((unitsAcc: string[], o) => [...unitsAcc, ...o.units.map(u => u.id)], [])
      };
      this.assessmentHasBeenSubmitted = innovationNeedsAssessment.assessment.hasBeenSubmitted;

      this.setPageStatus('READY');

    });

    this.subscriptions.push(
      this.activatedRoute.params.subscribe(params => {

        this.stepId = Number(params.stepId);

        if (!this.isValidStepId()) {
          this.redirectTo('/not-found');
          return;
        }

        this.saveAsDraft = { disabled: true, label: 'Saved' };

        switch (this.stepId) {
          case 1:
            this.form.sections = [
              { title: 'The innovation', parameters: NEEDS_ASSESSMENT_QUESTIONS.innovation },
              { title: 'The innovator', parameters: NEEDS_ASSESSMENT_QUESTIONS.innovator }
            ];
            break;
          case 2:
            this.form.sections = [
              { title: 'Support need summary', parameters: NEEDS_ASSESSMENT_QUESTIONS.summary },
              { title: '', parameters: NEEDS_ASSESSMENT_QUESTIONS.suggestedOrganisationUnitsIds }
            ];
            break;
        }

        this.setBackLink('Back to innovation', `/assessment/innovations/${this.innovationId}`);
        this.setPageTitle('Needs assessment', { hint: `${this.stepId} of 2` });
        this.setPageStatus('READY');

      })
    );

  }


  onSubmit(action: 'update' | 'saveAsDraft' | 'submit'): void {

    let isValid = true;

    // This section is not easy to test. TOIMPROVE: Include this code on unit test.
    (this.formEngineComponent?.toArray() || []).forEach(engine => /* istanbul ignore next */ {

      let formData: MappedObjectType;

      if (action === 'saveAsDraft') {
        formData = engine.getFormValues(false);
      } else {

        formData = engine.getFormValues(true);

        if (!formData?.valid) { isValid = false; }

      }

      this.currentAnswers = { ...this.currentAnswers, ...formData?.data };

    });

    if (!isValid) /* istanbul ignore next */ {
      return;
    }

    this.assessmentService.updateInnovationNeedsAssessment(this.innovationId, this.assessmentId, (this.stepId === 2 && action === 'submit'), this.currentAnswers).subscribe({
      next: () => {
        switch (action) {
          case 'saveAsDraft':
            this.saveAsDraft = { disabled: true, label: 'Saved' };
            break;
          case 'update':
          case 'submit':
            switch (this.stepId) {
              case 1:
                this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/2`);
                break;
              case 2:
                this.setRedirectAlertSuccess('Needs assessment successfully completed');
                this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}`);
                break;
            }
            break;
          default:
            break;
        }
      },
      error: () => this.setAlertError('An error occurred when starting needs assessment. Please try again or contact us for further help')
    });

  }

  onFormChange(): void {
    this.saveAsDraft = { disabled: false, label: 'Save as draft' };
  }

}
