import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import {
  AnnouncementStatusEnum,
  AnnouncementTypeEnum,
  AnnouncementsService
} from '@modules/feature-modules/admin/services/announcements.service';

import {
  ANNOUNCEMENT_EDIT_QUESTIONS,
  ANNOUNCEMENT_NEW_QUESTIONS,
  OutboundPayloadType
} from './announcement-newdit.config';

import { DatePipe } from '@angular/common';
import { UserRoleEnum } from '@app/base/enums';
import { AnnouncementCardDataType } from '@modules/theme/components/announcements/announcement-card.component';
import { InnovationRecordSchemaStore } from '@modules/stores';

const QUESTION_LABELS = {
  linkLabel: 'Link label',
  linkUrl: 'Link url',
  startsAt: 'Start date',
  expiresAt: 'End date'
};

enum SummaryDataItemTypeEnum {
  SINGLE_PARAMETER = 'SINGLE_PARAMETER',
  MULTIPLE_PARAMETERS = 'MULTIPLE_PARAMETERS',
  FILTER_PARAMETER = 'FILTER_PARAMETER'
}

type SummaryPayloadFilterType = { section: string; question: string; answer: string };

type SummaryPayloadType = {
  title: string;
  content: string;
  linkLabel?: string;
  linkUrl?: string;
  userRoles: string;
  showToWhom?: string;
  filters?: SummaryPayloadFilterType[];
  startsAt: string;
  expiresAt?: string;
  type: string;
};

type SummaryDataItemType = {
  label: string;
  editStepNumber: number;
  data: SummaryDataItemSingleParameterType | SummaryDataItemMultipleParametersType | SummaryDataItemFilterParamaterType;
};

type SummaryDataItemSingleParameterType = {
  type: SummaryDataItemTypeEnum.SINGLE_PARAMETER;
  answer: string;
};

type SummaryDataItemMultipleParametersType = {
  type: SummaryDataItemTypeEnum.MULTIPLE_PARAMETERS;
  questions: {
    label: string;
    answer: string;
  }[];
};

type SummaryDataItemFilterParamaterType = {
  type: SummaryDataItemTypeEnum.FILTER_PARAMETER;
  sections: {
    section: string;
    question: string;
    answer: string;
  }[];
};

@Component({
  selector: 'app-admin-pages-announcement-newdit',
  templateUrl: './announcement-newdit.component.html'
})
export class PageAnnouncementNewditComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  announcementId: string;
  announcementData: {
    isCreation: boolean;
    isEdition: boolean;
    status: null | AnnouncementStatusEnum;
    isScheduled: boolean;
    isActive: boolean;
    cardData?: AnnouncementCardDataType;
  };

  wizard: WizardEngineModel = new WizardEngineModel({});
  summaryData: SummaryDataItemType[] = [];

  isChangeMode: boolean = false;
  submitButton = { isActive: true, label: 'Save announcement' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private announcementsService: AnnouncementsService,
    private datePipe: DatePipe,
    private irSchemaStore: InnovationRecordSchemaStore
  ) {
    super();

    this.announcementId = this.activatedRoute.snapshot.params.announcementId;

    this.announcementData = {
      isCreation: !this.announcementId,
      isEdition: !!this.announcementId,
      status: null,
      isScheduled: false,
      isActive: false
    };

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
  }

  ngOnInit(): void {
    if (this.announcementData.isCreation) {
      this.wizard = new WizardEngineModel(ANNOUNCEMENT_NEW_QUESTIONS);
      this.wizard.setInboundParsedAnswers({}).runRules();

      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      this.setPageStatus('READY');
    } else {
      this.announcementsService.getAnnouncementInfo(this.announcementId).subscribe(response => {
        this.announcementData.status = response.status;
        this.announcementData.isScheduled =
          this.announcementData.isEdition && this.announcementData.status === AnnouncementStatusEnum.SCHEDULED;
        this.announcementData.isActive =
          this.announcementData.isEdition && this.announcementData.status === AnnouncementStatusEnum.ACTIVE;

        if (this.announcementData.isScheduled) {
          this.wizard = new WizardEngineModel(ANNOUNCEMENT_NEW_QUESTIONS);
        } else if (this.announcementData.isActive) {
          this.wizard = new WizardEngineModel(ANNOUNCEMENT_EDIT_QUESTIONS);
        } else {
          this.redirectTo('info');
        }

        this.wizard.setInboundParsedAnswers(response).runRules();
        this.wizard.gotoStep(this.activatedRoute.snapshot.params.stepId || 1);

        this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
        this.setPageStatus('READY');
      });
    }
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    this.resetAlert();

    const formData = this.formEngineComponent?.getFormValues() || { valid: false, data: {} };
    if (action === 'next' && !formData.valid) {
      // Don't move forward if step is NOT valid.

      // To display alert error.
      const currentStepErrors = this.wizard.checkCurrentStepErrors(this.formEngineComponent?.form);
      if (currentStepErrors?.length) {
        this.setAlertError('', {
          itemsList: [
            {
              title: this.translate(currentStepErrors?.[0].errorMessage!),
              fieldId: currentStepErrors?.[0].fieldId
            }
          ]
        });
      }

      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) {
          this.redirectTo(`admin/announcements${this.announcementData.isEdition ? '/' + this.announcementId : ''}`);
        } else {
          this.wizard.previousStep();
        }
        break;
      case 'next':
        this.wizard.nextStep();
        break;
      default: // Should NOT happen!
        break;
    }

    if (this.wizard.isQuestionStep()) {
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    } else {
      this.setPageTitle('Check your answers', { size: 'l' });
      this.summaryData = this.getSummaryData();
      this.announcementData.cardData = this.getSummaryCardData();
    }
  }

  onGotoStep(stepNumber: number): void {
    this.wizard.setIsChangingMode(true);
    this.wizard.gotoStep(stepNumber);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
  }

  formatSectionLabel(sectionId: string) {
    const sectionIdentification = this.irSchemaStore.getIrSchemaSectionIdentificationV3(sectionId);
    return `${sectionIdentification?.group.number}.${sectionIdentification?.section.number} - ${sectionIdentification?.section.title}`;
  }

  summaryParsing(): SummaryPayloadType {
    const outboundPayload = this.wizard.runOutboundParsing() as OutboundPayloadType;

    const irSchemaTranslations = this.irSchemaStore.getIrSchemaTranslationsMap();

    return {
      title: outboundPayload.title,
      content: outboundPayload.params.content,
      linkLabel: outboundPayload.params.link?.label,
      linkUrl: outboundPayload.params.link?.url,
      userRoles: outboundPayload.userRoles.map(item => this.stores.authentication.getRoleDescription(item)).join('\n'),
      showToWhom: outboundPayload.userRoles.includes(UserRoleEnum.INNOVATOR)
        ? outboundPayload.filters?.length
          ? 'Specific types of innovations'
          : 'All innovators'
        : undefined,
      filters: outboundPayload.filters?.map(filter => {
        return {
          section: this.formatSectionLabel(filter.section),
          question: irSchemaTranslations['questions'].get(filter.question)?.label ?? filter.question,
          answer: filter.answers
            .map(
              answer => irSchemaTranslations['questions'].get(filter.question.split('_')[0])?.items?.get(answer)?.label
            )
            .join('\n')
        };
      }),
      startsAt: this.datePipe.transform(outboundPayload.startsAt, this.translate('app.date_formats.long_date'))!,
      expiresAt: outboundPayload.expiresAt
        ? this.datePipe.transform(outboundPayload.expiresAt, this.translate('app.date_formats.long_date'))!
        : undefined,
      type: outboundPayload.type === AnnouncementTypeEnum.LOG_IN ? 'Log in' : 'Homepage'
    };
  }

  getSummaryData(): SummaryDataItemType[] {
    const summaryData: SummaryDataItemType[] = [];
    const summaryPayload = this.summaryParsing();

    this.wizard.steps.forEach((step, stepIndex) => {
      let stepDataType: SummaryDataItemTypeEnum = SummaryDataItemTypeEnum.MULTIPLE_PARAMETERS;
      if (step.parameters.length === 1) {
        stepDataType =
          step.parameters[0].dataType === 'ir-selectable-filters'
            ? SummaryDataItemTypeEnum.FILTER_PARAMETER
            : SummaryDataItemTypeEnum.SINGLE_PARAMETER;
      }

      const label = step.label ?? step.parameters[0].label ?? '';
      const editStepNumber = stepIndex + 1;

      if (stepDataType === SummaryDataItemTypeEnum.SINGLE_PARAMETER) {
        const stepItemData: SummaryDataItemSingleParameterType = {
          type: stepDataType,
          answer: summaryPayload[step.parameters[0].id as keyof SummaryPayloadType] as string
        };
        summaryData.push({ label, editStepNumber, data: stepItemData });
      } else if (stepDataType === SummaryDataItemTypeEnum.MULTIPLE_PARAMETERS) {
        const questions = step.parameters.map(parameter => {
          return {
            label: QUESTION_LABELS[parameter.id as keyof typeof QUESTION_LABELS],
            answer: summaryPayload[parameter.id as keyof SummaryPayloadType] as string
          };
        });

        const stepItemData: SummaryDataItemMultipleParametersType = {
          type: stepDataType,
          questions
        };
        summaryData.push({ label, editStepNumber, data: stepItemData });
      } else if (stepDataType === SummaryDataItemTypeEnum.FILTER_PARAMETER) {
        const sections = summaryPayload[
          step.parameters[0].id as keyof SummaryPayloadType
        ] as SummaryPayloadFilterType[];

        const stepItemData: SummaryDataItemFilterParamaterType = {
          type: stepDataType,
          sections
        };
        summaryData.push({ label, editStepNumber, data: stepItemData });
      }
    });

    return summaryData;
  }

  getSummaryCardData(): AnnouncementCardDataType {
    const wizardOutBoundPayload = this.wizard.runOutboundParsing() as OutboundPayloadType;

    return {
      title: wizardOutBoundPayload.title,
      params: wizardOutBoundPayload.params
    };
  }

  onSubmitWizard(): void {
    this.resetAlert();

    this.submitButton = { isActive: false, label: 'Saving...' };

    const body = this.wizard.runOutboundParsing() as OutboundPayloadType;

    if (this.announcementData.isCreation) {
      this.announcementsService.createAnnouncement(body).subscribe({
        next: () => {
          this.setRedirectAlertSuccess('A new announcement was created');
          this.redirectTo(`admin/announcements`);
        },
        error: () => {
          this.submitButton = { isActive: true, label: 'Save announcement' };
          this.setAlertUnknownError();
        }
      });
    } else {
      this.announcementsService.updateAnnouncement(this.announcementId, this.announcementData.status!, body).subscribe({
        next: () => {
          this.setRedirectAlertSuccess('The announcement was updated');
          this.redirectTo(`admin/announcements/${this.announcementId}`);
        },
        error: () => {
          this.submitButton = { isActive: true, label: 'Save announcement' };
          this.setAlertUnknownError();
        }
      });
    }
  }
}
