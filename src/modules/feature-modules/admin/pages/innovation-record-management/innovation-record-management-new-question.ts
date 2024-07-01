import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { IRSchemaErrors } from '@modules/shared/enums/ir-schema-errors.enum';
import { FormEngineV3Component } from '@modules/shared/forms/engine/form-engine-v3.component';
import { ContextInnovationType } from '@app/base/types';
import { FormEngineModelV3 } from '@modules/shared/forms/engine/models/form-engine.models';
import { WizardIRV3EngineModel } from '@modules/shared/forms/engine/models/wizard-irv3-engine.model';
import { dummy_schema_flow_demo } from '@modules/stores/innovation/innovation-record/202405/ir-v3-flow-schema';
import { dummy_schema_V3_202405 } from '@modules/stores/innovation/innovation-record/202405/ir-v3-schema';
import {
  InnovationRecordQuestionStepType,
  InnovationRecordSchemaV3Type
} from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';
import { concatMap, of } from 'rxjs';
import { InnovationRecordSchemaInfoType } from '@modules/stores/innovation/innovation-record/innovation-record-schema/innovation-record-schema.models';

@Component({
  selector: 'app-admin-innovation-record-management-new-question',
  templateUrl: './innovation-record-management-new-question.html'
})
export class PageIRManagementNewQuestionComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineV3Component) formEngineComponent?: FormEngineV3Component;

  alertErrorsList: { title: string; description: string }[] = [];
  errorOnSubmitStep: boolean = false;

  sectionId: string;
  irSections = this.stores.schema.getIrSchemaSectionsListV3();

  wizard: WizardIRV3EngineModel;
  irManagementSchema: InnovationRecordSchemaInfoType = dummy_schema_flow_demo;

  baseUrl: string;

  isChangeMode: boolean = false;

  saveButton = { isActive: true, label: 'Save and continue' };
  submitButton = { isActive: false, label: 'Confirm section answers' };

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    this.baseUrl = `/admin/innovation-record/sections/${this.sectionId}/new`;

    this.wizard = new WizardIRV3EngineModel({
      sectionId: this.irManagementSchema.schema.sections[0].subSections[0].id,
      schema: dummy_schema_flow_demo,
      translations: this.stores.schema.getIrSchemaTranslationsMap(dummy_schema_flow_demo.schema),
      steps: this.irManagementSchema.schema.sections[0].subSections[0].steps.map(
        st => new FormEngineModelV3({ parameters: [] })
      )
    });
    console.log(this.wizard);
  }

  ngOnInit(): void {
    this.wizard.setAnswers({}).runRules().parseIRManagementSteps(this.sectionId, this.stores.context.getIrSchema());
    this.setPageStatus('READY');
  }

  onGoToStep(stepId: 'summary' | number, isChangeMode?: boolean) {
    if (stepId === 'summary') {
      console.log('go to summary');
      this.wizard.gotoSummary();
      this.redirectTo(`${this.baseUrl}/summary`);
      this.setPageTitle('Check your answers', { size: 'l' });
    } else {
      this.wizard.gotoStep(stepId, isChangeMode);
      this.redirectTo(`${this.baseUrl}/${stepId}`, { isChangeMode: this.isChangeMode });
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    }

    this.setPageStatus('READY');
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    this.alertErrorsList = [];
    this.resetAlert();

    const formData = this.formEngineComponent?.getFormValues() || { valid: false, data: {} };

    if (action === 'next' && !formData?.valid) {
      // Apply validation only when moving forward.
      return;
    }

    let currentStepIndex = this.wizard.currentStepId;

    // this.wizard.addAnswers(formData.data).runRules();

    if (typeof currentStepIndex === 'number') {
      if (action === 'previous') {
        console.log('previous');

        const previousStep = this.wizard.getPreviousStep(this.isChangeMode);
        if (this.wizard.isFirstStep() || previousStep === -1) {
          this.redirectTo(this.baseUrl);
        } else {
          this.onGoToStep(previousStep, this.isChangeMode);
        }
      }

      if (action === 'next') {
        const shouldUpdateInformation = true;
        this.wizard
          .addAnswers(formData!.data)
          .runRules()
          .parseIRManagementSteps(this.sectionId, this.stores.context.getIrSchema());

        this.saveButton = { isActive: false, label: 'Saving...' };

        of(true)
          .pipe(
            concatMap(() => {
              return of(true);
            })
          )
          .subscribe({
            next: response => {
              this.saveButton = { isActive: true, label: 'Save and continue' };
              console.log('next');
              this.onGoToStep(this.wizard.getNextStep(this.isChangeMode), this.isChangeMode);
            },
            error: ({ error: err }: HttpErrorResponse) => {
              // this.errorOnSubmitStep = true;
              // this.saveButton = { isActive: true, label: 'Save and continue' };
              // this.alertErrorsList = [];
              // this.setAlertUnknownError();
              // if (err.error === IRSchemaErrors.INNOVATION_RECORD_SCHEMA_VERSION_MISMATCH) {
              //   this.stores.context.clearIrSchema();
              //   this.setAlertError('This section of the innovation record has been updated.', {
              //     itemsList: [
              //       {
              //         title: 'Go back to the section and start again',
              //         callback: `/innovator/innovations/${this.innovation.id}/record/sections/${this.sectionId}`
              //       }
              //     ]
              //   });
              // }
            }
          });
      }
    } else {
      this.router.navigateByUrl(`${this.baseUrl}`);
    }

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
  }

  onSubmitSection(): void {}
}
