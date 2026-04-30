import { Component, OnInit, ViewChild } from '@angular/core';
import { cloneDeep } from 'lodash';

import { CoreComponent } from '@app/base';
import { FileTypes, FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { InnovationImportResponseType, InnovatorService } from '../../services/innovator.service';

import { HttpErrorResponse } from '@angular/common/http';
import { InnovationErrorsEnum } from '@app/base/enums';
import { getImportInnovationQuestionsWizard, getNewInnovationQuestionsWizard } from './innovation-new.config';
import { InnovationsService } from '@modules/shared/services/innovations.service';

@Component({
  selector: 'app-innovator-pages-innovation-new',
  templateUrl: './innovation-new.component.html'
})
export class InnovationNewComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard: WizardEngineModel = cloneDeep(getNewInnovationQuestionsWizard(this.ctx.schema.irSchemaInfo()));

  isCreatingInnovation = false;
  isImportingInnovation = false;
  isImportingExcel = false;
  importSuccess = false;
  sectionsToFillAfterImport: string[] = [];

  createdInnovationId: undefined | string = undefined;

  baseUrl = '/innovator/dashboard';

  constructor(
    private innovatorService: InnovatorService,
    private innovationsService: InnovationsService
  ) {
    super();

    this.setPageTitle('', { showPage: false });
    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
  }

  ngOnInit(): void {
    this.wizard.setAnswers(this.wizard.runInboundParsing({}));
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    const formData = this.formEngineComponent?.getFormValues() ?? { valid: false, data: {} };

    if (action === 'next' && !formData.valid) {
      // Apply validation only when moving forward.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    this.resetAlert();

    this.navigateTo(action);
  }

  submitWizard(): void {
    this.isCreatingInnovation = true;

    const data = this.wizard.runOutboundParsing();
    const body = {
      name: data.name,
      description: data.description,
      postcode: data.postcode,
      website: data.website,
      hasWebsite: data.hasWebsite,
      countryLocation: data.countryLocation,
      officeLocation: data.officeLocation,
      hasVideoDemonstration: data.hasVideoDemonstration,
      videoDemonstrationUrl: data.videoDemonstrationUrl
    };

    this.innovatorService.createInnovation(body).subscribe({
      next: response => {
        this.createdInnovationId = response.id;
        this.setRedirectAlertSuccess(`You have successfully registered the innovation '${body.name}'`);
        this.redirectTo(`innovator/innovations/${this.createdInnovationId}/registered`);
      },
      error: ({ error: err }: HttpErrorResponse) => {
        if (err.error === InnovationErrorsEnum.INNOVATION_ALREADY_EXISTS) {
          this.setAlertError('An innovation with that name already exists. Try again with a new name');
        } else {
          this.setAlertError(
            'An error occurred when creating the innovation. Please try again or contact us for further help'
          );
        }
        this.isCreatingInnovation = false;
      }
    });
  }

  private navigateTo(action: 'previous' | 'next'): void {
    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) {
          this.redirectTo('innovator');
        } else {
          this.wizard.previousStep();
        }
        break;
      case 'next':
        this.wizard.nextStep();
        break;
      default:
        break; // Should NOT happen!
    }
  }

  downloadExcelTemplate(): void {
    this.innovationsService.getInnovationRecordExcelTemplate().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Innovation-Record-Template.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.setAlertError('Unable to download the template. Please try again.');
      }
    });
  }

  onImportInnovation(): void {
    this.isCreatingInnovation = false;
    this.wizard = cloneDeep(getImportInnovationQuestionsWizard());
    this.onSubmitStep('next');
    this.setUploadConfiguration();
  }

  onStartInnovation(): void {
    this.isCreatingInnovation = true;
    this.wizard = cloneDeep(getNewInnovationQuestionsWizard(this.ctx.schema.irSchemaInfo()));
    this.onSubmitStep('next');
  }

  onUploadTemplate(): void {
    this.isImportingExcel = true;

    const formData = this.formEngineComponent?.getFormValues() ?? { valid: false, data: {} };
    const file = formData.data.file?.file;

    this.fileToBase64(file).then(fileAsBase64 => {
      this.innovatorService.createInnovationFromExcel(fileAsBase64).subscribe({
        next: response => {
          this.createdInnovationId = response.id;
          this.sectionsToFillAfterImport = this.getNotCompletedSections(response);

          this.importSuccess = true;
          this.setAlertSuccess('Your innovation has been imported');
        },
        error: ({ error: err }: HttpErrorResponse) => {
          if (err.error === InnovationErrorsEnum.INNOVATION_ALREADY_EXISTS) {
            this.setAlertError('An innovation with that name already exists. Try again with a new name');
          } else if (err.error === InnovationErrorsEnum.INNOVATION_INFO_EMPTY_INPUT) {
            this.setAlertError('Import failed as some mandatory fields are missing. Please try again.');
          } else {
            this.setAlertError(
              'An error occurred when importing the innovation. Please try again or contact us for further help'
            );
          }

          this.isImportingExcel = false;
        }
      });
    });
  }

  private setUploadConfiguration(): void {
    if (this.wizard.currentStep().parameters[0].dataType === 'file-upload') {
      this.wizard.currentStep().parameters[0].fileUploadConfig = {
        httpUploadUrl: '',
        acceptedFiles: [FileTypes.XLSX],
        localOnly: true,
        customValidationError: { wrongTemplateFileFormat: true }
      };
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  private getNotCompletedSections(res: InnovationImportResponseType): string[] {
    const withErrors = Object.keys(res.validationIssues).filter(id => id !== 'GLOBAL_WARNING');
    const empty = res.emptySections;

    const sections = [...new Set([...withErrors, ...empty])];

    const numberedSections = sections.map(s => this.ctx.schema.getNumberedTranslatedSection(s));

    return numberedSections;
  }
}
