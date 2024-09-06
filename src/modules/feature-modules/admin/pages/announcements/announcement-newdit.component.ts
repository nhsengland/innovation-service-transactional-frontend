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
  OutboundPayloadType,
  stepsLabels
} from './announcement-newdit.config';

import { DatePipe, ViewportScroller } from '@angular/common';
import { UserRoleEnum } from '@app/base/enums';
import { AnnouncementCardDataType } from '@modules/theme/components/announcements/announcement-card.component';
import { InnovationRecordSchemaStore } from '@modules/stores';
import { combineLatest } from 'rxjs';

export enum SummaryDataItemTypeEnum {
  SINGLE_PARAMETER = 'SINGLE_PARAMETER',
  MULTIPLE_PARAMETERS = 'MULTIPLE_PARAMETERS',
  FILTER_PARAMETER = 'FILTER_PARAMETER'
}

type SummaryPayloadFilterType = { section: string; question: string; answer: string };

type SummaryPayloadType = {
  title: string;
  content: string;
  linkLabel: string;
  linkUrl: string;
  userRoles: string;
  showToWhom?: string;
  filters?: SummaryPayloadFilterType[];
  startsAt: string;
  expiresAt: string;
  type: string;
  sendEmail: string;
};

export type SummaryDataItemType = {
  label: string;
  editStepNumber: number;
  data: SummaryDataItemSingleParameterType | SummaryDataItemMultipleParametersType | SummaryDataItemFilterParamaterType;
};

export type SummaryDataItemSingleParameterType = {
  type: SummaryDataItemTypeEnum.SINGLE_PARAMETER;
  answer: string;
  canChangeOnStatus?: AnnouncementStatusEnum[];
};

export type SummaryDataItemMultipleParametersType = {
  type: SummaryDataItemTypeEnum.MULTIPLE_PARAMETERS;
  questions: {
    label: string;
    answer: string;
  }[];
  canChangeOnStatus?: AnnouncementStatusEnum[];
};

export type SummaryDataItemFilterParamaterType = {
  type: SummaryDataItemTypeEnum.FILTER_PARAMETER;
  sections: {
    section: string;
    question: string;
    answer: string;
  }[];
  canChangeOnStatus?: AnnouncementStatusEnum[];
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
    cardData: AnnouncementCardDataType;
  };

  wizard: WizardEngineModel = new WizardEngineModel({});
  summaryData: SummaryDataItemType[] = [];

  isChangeMode: boolean = false;
  submitButton = { isActive: true, label: 'Save announcement' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private announcementsService: AnnouncementsService,
    private datePipe: DatePipe,
    private irSchemaStore: InnovationRecordSchemaStore,
    private scroller: ViewportScroller
  ) {
    super();

    this.announcementId = this.activatedRoute.snapshot.params.announcementId;

    this.announcementData = {
      isCreation: !this.announcementId,
      isEdition: !!this.announcementId,
      status: null,
      isScheduled: false,
      isActive: false,
      cardData: { title: '', params: { content: '' } }
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
      combineLatest([
        this.activatedRoute.queryParams,
        this.announcementsService.getAnnouncementInfo(this.announcementId)
      ]).subscribe({
        next: ([queryParams, announcementInfo]) => {
          this.announcementData.status = announcementInfo.status;
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

          this.wizard.setInboundParsedAnswers(announcementInfo).runRules();

          if (queryParams.isChangeMode && queryParams.isChangeMode === 'true') {
            this.onGotoStep(this.activatedRoute.snapshot.params.stepId || 1);
          } else {
            this.wizard.gotoStep(this.activatedRoute.snapshot.params.stepId || 1);
            this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
          }

          this.setPageStatus('READY');
        }
      });
    }
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    this.resetAlert();
    const formData = this.formEngineComponent?.getFormValues() || { valid: false, data: {} };
    if ((action === 'next' || (action === 'previous' && this.isChangeMode)) && !formData.valid) {
      // Don't move forward if step is NOT valid.

      // To display alert error.
      const currentStepErrors = this.wizard.checkCurrentStepErrors(this.formEngineComponent?.form);
      if (currentStepErrors?.length) {
        const itemsList = currentStepErrors.map(error => ({
          title: error.message,
          fieldId: error.fieldId
        }));
        this.setAlertError('', {
          itemsList
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
        this.scroller.scrollToPosition([0, 0]);
        break;
      default: // Should NOT happen!
        break;
    }

    if (this.wizard.isQuestionStep()) {
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    } else {
      this.setPageTitle('Check your answers', { size: 'l' });
      this.resetBackLink();
      this.summaryData = this.getSummaryData();
      this.announcementData.cardData = this.getSummaryCardData();
    }
  }

  onGotoStep(stepNumber: number): void {
    this.isChangeMode = true;
    this.wizard.setIsChangingMode(this.isChangeMode);
    this.wizard.gotoStep(stepNumber);
    this.scroller.scrollToPosition([0, 0]);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
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
      linkLabel: outboundPayload.params.link?.label ?? '',
      linkUrl: outboundPayload.params.link?.url ?? '',
      userRoles: outboundPayload.userRoles
        .map(item => this.stores.authentication.getRoleDescription(item, true))
        .join('\n'),
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
        : '',
      type: outboundPayload.type === AnnouncementTypeEnum.LOG_IN ? 'Login announcement' : 'Homepage announcement',
      sendEmail: outboundPayload.sendEmail ? 'Yes' : 'No'
    };
  }

  getSummaryData(): SummaryDataItemType[] {
    const summaryData: SummaryDataItemType[] = [];
    const summaryPayload = this.summaryParsing();

    let editStepNumber = 1;

    summaryData.push(
      {
        label: stepsLabels.s1.label,
        editStepNumber: editStepNumber++,
        data: {
          type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
          answer: summaryPayload.title,
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        }
      },
      {
        label: stepsLabels.s2.label,
        editStepNumber: editStepNumber++,
        data: {
          type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
          answer: summaryPayload.content,
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        }
      },
      {
        label: stepsLabels.s3.label,
        editStepNumber: editStepNumber++,
        data: {
          type: SummaryDataItemTypeEnum.MULTIPLE_PARAMETERS,
          questions: [
            { label: 'Link label', answer: summaryPayload.linkLabel },
            { label: 'Link URL', answer: summaryPayload.linkUrl }
          ],
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        }
      },
      {
        label: stepsLabels.s4.p1.label,
        editStepNumber: editStepNumber++,
        data: {
          type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
          answer: summaryPayload.userRoles,
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        }
      }
    );

    if (summaryPayload.showToWhom) {
      summaryData.push({
        label: stepsLabels.s5.p1.label,
        editStepNumber: editStepNumber++,
        data: {
          type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
          answer: summaryPayload.showToWhom,
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        }
      });
    }

    if (summaryPayload.filters) {
      summaryData.push({
        label: stepsLabels.s6.p1.label,
        editStepNumber: editStepNumber++,
        data: {
          type: SummaryDataItemTypeEnum.FILTER_PARAMETER,
          sections: summaryPayload.filters,
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        }
      });
    }

    summaryData.push(
      {
        label: stepsLabels.s7.label,
        editStepNumber: !(
          this.announcementData.isEdition && this.announcementData.status === AnnouncementStatusEnum.ACTIVE
        )
          ? editStepNumber++
          : 1,
        data: {
          type: SummaryDataItemTypeEnum.MULTIPLE_PARAMETERS,
          questions: [
            { label: 'Start date', answer: summaryPayload.startsAt },
            { label: 'End date', answer: summaryPayload.expiresAt }
          ],
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED, AnnouncementStatusEnum.ACTIVE]
        }
      },
      {
        label: stepsLabels.s8.p1.label,
        editStepNumber: editStepNumber++,
        data: {
          type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
          answer: summaryPayload.type,
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        }
      },
      {
        label: stepsLabels.s9.p1.label,
        editStepNumber: editStepNumber++,
        data: {
          type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
          answer: summaryPayload.sendEmail,
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        }
      }
    );

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
