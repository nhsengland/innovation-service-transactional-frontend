import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, interval, of, switchMap } from 'rxjs';

import { CoreComponent } from '@app/base';
import { UtilsHelper } from '@app/base/helpers';
import { MappedObjectType } from '@app/base/types';
import { FormEngineComponent, FormEngineHelper, FormEngineParameterModel } from '@modules/shared/forms';
import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { InnovationNeedsAssessmentInfoDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { AssessmentService } from '../../../services/assessment.service';

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

  entrypointUrl: string = '';

  assessment?: InnovationNeedsAssessmentInfoDTO;

  form: {
    sections: {
      title: string;
      parameters: FormEngineParameterModel[];
    }[];
    data: { [key: string]: any };
  };

  assessmentHasBeenSubmitted: null | boolean;

  isReassessment = false;
  showAssessmentDetails = false;

  currentAnswers: { [key: string]: any };

  saveButton: {
    disabled: boolean;
    label: 'Save changes' | 'All changes are saved';
  } = { disabled: true, label: 'All changes are saved' };

  isValidStepId(): boolean {
    const id = this.stepId;
    return 1 <= Number(id) && Number(id) <= 2;
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
    this.entrypointUrl = this.stores.context.getPreviousUrl() ?? '';

    forkJoin([
      this.organisationsService.getOrganisationsList({ unitsInformation: true }),
      this.innovationsService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId)
    ])
      .pipe(
        switchMap(([orgList, needsAssessment]) => {
          const previousAssessmentId = needsAssessment.previousAssessment?.id;
          return forkJoin([
            of(orgList),
            of(needsAssessment),
            previousAssessmentId && needsAssessment.minorVersion > 0
              ? this.innovationsService.getInnovationNeedsAssessment(this.innovationId, previousAssessmentId)
              : of(null)
          ]);
        })
      )
      .subscribe(([organisationUnits, needsAssessment, previousNeedsAssessment]) => {
        // Update last step with the organisations list with description and pre-select all checkboxes.
        NEEDS_ASSESSMENT_QUESTIONS.suggestedOrganisationUnitsIds[0].description = `Please select all organisations you think are in a position to offer support, assessment or other type of engagement at this time. The qualifying accessors of the organisations you select will be notified. <br /> <a href="${this.CONSTANTS.URLS.WHO_WE_ARE}" target="_blank" rel="noopener noreferrer"> Check their referral criteria (opens in a new window) </a>`;
        NEEDS_ASSESSMENT_QUESTIONS.suggestedOrganisationUnitsIds[0].groupedItems = organisationUnits.map(item => {
          const previousSuggestedOrgs = previousNeedsAssessment?.suggestedOrganisations ?? [];
          const curSuggestedOrg = previousSuggestedOrgs.find(s => s.id === item.id);
          const suggestedUnits = curSuggestedOrg ? new Set(curSuggestedOrg.units.map(u => u.id)) : new Set();
          return {
            value: item.id,
            label: item.name,
            items: item.organisationUnits.map(i => ({
              value: i.id,
              label: i.name,
              isEditable: !suggestedUnits.has(i.id)
            })),
            isEditable: suggestedUnits.size !== item.organisationUnits.length
          };
        });

        this.innovationName = this.stores.context.getInnovation().name;

        this.assessment = needsAssessment;

        this.form.data = {
          ...this.assessment,
          suggestedOrganisationUnitsIds: this.assessment.suggestedOrganisations.reduce(
            (unitsAcc: string[], o) => [...unitsAcc, ...o.units.map(u => u.id)],
            []
          )
        };

        this.assessmentHasBeenSubmitted = !!this.assessment.finishedAt;

        this.isReassessment = this.assessment.majorVersion > 1;
        this.showAssessmentDetails = !(this.assessment.majorVersion === 1 && this.assessment.minorVersion === 0);

        // Only autosave if the assessment has not been submitted.
        if (!this.assessmentHasBeenSubmitted) {
          this.subscriptions.push(
            interval(1000 * 60).subscribe(() => {
              if (!this.saveButton.disabled) {
                this.onSubmit('autosave');
              }
            })
          );
        }

        this.subscriptions.push(
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
                this.setBackLink(
                  'Go back',
                  this.entrypointUrl.endsWith(`/assessments/${this.assessment?.previousAssessment?.id}/edit/reason`)
                    ? `/assessment/innovations/${this.innovationId}/overview`
                    : this.entrypointUrl
                );

                break;
              case 2:
                this.form.sections = [
                  { title: 'Support need summary', parameters: NEEDS_ASSESSMENT_QUESTIONS.summary },
                  { title: '', parameters: NEEDS_ASSESSMENT_QUESTIONS.suggestedOrganisationUnitsIds }
                ];
                this.setBackLink(
                  'Go back',
                  `/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/1`
                );
                break;
            }

            const error = Boolean(this.activatedRoute.snapshot.queryParams['error']);
            if (this.stepId === 1 && error) {
              (this.formEngineComponent?.toArray() || []).forEach(engine => /* istanbul ignore next */ {
                engine.getFormValues(true);
              });
            }

            this.updatePageTitle();

            this.setPageStatus('READY');
          })
        );
      });
  }

  updatePageTitle(): void {
    let assessmentTitle =
      (this.isReassessment ? 'Needs reassessment' : 'Needs assessment') +
      ` ${UtilsHelper.getAssessmentVersion(this.assessment?.majorVersion, this.assessment?.minorVersion)}`;
    if (this.assessment?.minorVersion) {
      assessmentTitle = this.isReassessment ? 'Edit needs reassessment' : 'Edit needs assessment';
    }

    const pageTitle = `${assessmentTitle}`;
    const hint = `${this.stepId} of 2`;
    this.setPageTitle(pageTitle, { hint });
  }

  onSubmit(
    action: 'saveAsDraft' | 'submit' | 'saveAsDraftFirstSection' | 'saveAsDraftSecondSection' | 'autosave'
  ): void {
    let isFirstStepValid = true;
    let isSecondStepValid = true;

    // This section is not easy to test. TOIMPROVE: Include this code on unit test.
    (this.formEngineComponent?.toArray() || []).forEach(engine => /* istanbul ignore next */ {
      let formData: MappedObjectType;

      if (action === 'submit') {
        formData = engine.getFormValues(true);
        if (!formData?.valid) {
          isSecondStepValid = false;
        }
      } else {
        formData = engine.getFormValues(false);
      }

      this.currentAnswers = {
        ...this.currentAnswers,
        // Update to null empty values.
        ...Object.entries(formData?.data).reduce((accumulator, [key, value]) => {
          return {
            ...accumulator,
            [key]: key !== 'suggestedOrganisationUnitsIds' && UtilsHelper.isEmpty(value) ? null : value
          };
        }, {})
      };
    });

    if (action === 'saveAsDraftFirstSection' || action === 'saveAsDraftSecondSection') {
      // Update form.data only if the user navigates between steps
      this.form.data = {
        ...this.form.data,
        ...this.currentAnswers
      };
    }

    if (action === 'submit') {
      const firstStepParameters = [...NEEDS_ASSESSMENT_QUESTIONS.innovation, ...NEEDS_ASSESSMENT_QUESTIONS.innovator];
      const firstStepForm = FormEngineHelper.buildForm(firstStepParameters, this.form.data);

      if (!firstStepForm.valid) {
        isFirstStepValid = false;
      }
    }

    const isValid = isFirstStepValid && isSecondStepValid;

    this.assessmentService
      .updateInnovationNeedsAssessment(
        this.innovationId,
        this.assessmentId,
        this.stepId === 2 && action === 'submit' && isValid,
        this.currentAnswers
      )
      .subscribe({
        next: () => {
          switch (action) {
            case 'autosave':
            case 'saveAsDraft':
              this.saveButton = { disabled: true, label: 'All changes are saved' };
              break;
            case 'saveAsDraftFirstSection':
              this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/2`);
              break;
            case 'saveAsDraftSecondSection':
              this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/1`);
              break;
            case 'submit':
              if (isValid) {
                this.setRedirectAlertSuccess(
                  `Needs ${this.isReassessment ? 'reassessment' : 'assessment'} successfully completed`
                );
                this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}`);
              } else {
                if (isFirstStepValid) {
                  this.setAlertError('All questions must be completed before submit');
                } else {
                  this.setAlertError('All questions must be completed before submit', {
                    itemsList: [
                      {
                        title: 'Go to step 1 and start filling in all incomplete questions',
                        callback: `/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/1?error=true`
                      }
                    ]
                  });
                }
              }
              break;
            default:
              break;
          }
        },
        error: () =>
          this.setAlertError(
            'An error occurred when starting needs assessment. Please try again or contact us for further help'
          )
      });
  }

  onFormChange(): void {
    this.saveButton = { disabled: false, label: 'Save changes' };
  }
}
