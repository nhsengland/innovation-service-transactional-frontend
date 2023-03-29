import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FileTypes, FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { LocalStorageHelper } from '@app/base/helpers';

import { UrlModel } from '@app/base/models';

import { ContextInnovationType } from '@modules/stores/context/context.types';

import { SECTION_2_1 } from './section-2-1.config';
import { SECTION_2_EVIDENCES } from './section-2-2-evidences.config';
import { SECTION_2_2 } from './section-2-2.config';


@Component({
  selector: 'app-innovator-experiments-innovation-section-edit',
  templateUrl: './section-edit.component.html'
})
export class ExperimentsInnovationSectionEditComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  alertErrorsList: { title: string, description: string }[] = [];

  innovation: ContextInnovationType;
  sectionId: any;
  baseUrl: string;

  wizard: WizardEngineModel;

  saveButton = { isActive: true, label: 'Save and continue' };
  submitButton = { isActive: true, label: 'Confirm section answers' };
  submitRequestedActionsButton = { isActive: false, label: 'Submit updates' };

  hasRequestActions: boolean = false;


  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    
    super();
    
    this.innovation = this.stores.context.getInnovation();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.baseUrl = `innovator/innovations/${this.innovation.id}/record/sections/experiments/${this.sectionId}`;

    console.log('sectionId', this.sectionId);

    switch (this.sectionId) {
      case '2_1':
        this.wizard = SECTION_2_1.wizard;
        break;

      case '2_2':
        this.wizard = SECTION_2_2.wizard;
        break;

      case '2_2_evidence':
        this.baseUrl = `innovator/innovations/${this.innovation.id}/record/sections/experiments/2_2`;
        this.wizard = SECTION_2_EVIDENCES;
        break;

      default:
        this.wizard = new WizardEngineModel({});
        console.error('Section experiment NOT FOUND!');
        break;
    }

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));

  }

  // private getNextSectionId(): string | null {

  //   const sectionsIdsList = INNOVATION_SECTIONS.flatMap(sectionsGroup => sectionsGroup.sections.map(section => section.id));
  //   const currentSectionIndex = sectionsIdsList.indexOf(this.sectionId);
  //   return sectionsIdsList[currentSectionIndex + 1] || null;

  // }


  ngOnInit(): void {

    // this.stores.innovation.getSectionInfo$(this.innovation.id, this.sectionId).subscribe({
    //   next: response => {
    this.hasRequestActions = false;

    const currentAnswers = LocalStorageHelper.getObjectItem(`experimentSection${this.sectionId}`) as any;

    console.log('aaa', currentAnswers);

    this.wizard.setAnswers(this.wizard.runInboundParsing(currentAnswers ?? {})).runRules();
    this.wizard.gotoStep(this.activatedRoute.snapshot.params.questionId || 1);

    this.setUploadConfiguration();

    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    this.setPageStatus('READY');

    // },
    // error: () => {
    //   this.setPageStatus('ERROR');
    //   this.logger.error('Error fetching data');
    // }
    // });

  }


  setUploadConfiguration(): void {

    if (this.wizard.currentStep().parameters[0].dataType === 'file-upload') {
      this.wizard.currentStep().parameters[0].fileUploadConfig = {
        httpUploadUrl: new UrlModel(this.CONSTANTS.APP_URL).addPath('upload').buildUrl(),
        httpUploadBody: {
          context: this.sectionId,
          innovatorId: this.stores.authentication.getUserId(),
          innovationId: this.innovation.id
        },
        maxFileSize: 10,
        acceptedFiles: [FileTypes.CSV, FileTypes.DOCX, FileTypes.XLSX, FileTypes.PDF]
      };
    }

  }


  onGotoStep(stepNumber: number): void {

    this.wizard.gotoStep(stepNumber);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    this.setUploadConfiguration();

  }

  onSubmitStep(action: 'previous' | 'next'): void {

    this.alertErrorsList = [];
    this.resetAlert();

    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'previous') {
      this.wizard.addAnswers(formData?.data || {}).runRules();
      if (this.wizard.isFirstStep()) { this.redirectTo(this.baseUrl); }
      else { this.wizard.previousStep(); }
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      this.setUploadConfiguration();
      return;
    }

    if (action === 'next' && !formData?.valid) { // Apply validation only when moving forward.
      return;
    }

    this.wizard.addAnswers(formData!.data).runRules();

    this.saveButton = { isActive: false, label: 'Saving...' };

    this.wizard.nextStep();

    if (this.wizard.isQuestionStep()) {
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      this.setUploadConfiguration();
    }
    else {

      this.setPageStatus('LOADING');

      const validInformation = this.wizard.validateData();

      if (!validInformation.valid) {
        this.alertErrorsList = validInformation.errors;
        this.setAlertError(`Please verify what's missing with your answers`, { itemsList: this.alertErrorsList, width: '2.thirds' });
      }

      this.setPageTitle('Check your answers', { size: 'l' });

      this.setPageStatus('READY');

    }

    this.saveButton = { isActive: true, label: 'Save and continue' };

  }

  onSubmitSection(): void {

    LocalStorageHelper.setObjectItem(`experimentSection${this.sectionId}`, this.wizard.currentAnswers);

    this.setRedirectAlertSuccess('Your answers have been confirmed for this section');
    this.redirectTo(this.baseUrl);
  }

}
