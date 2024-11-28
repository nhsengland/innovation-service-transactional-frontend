import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

import {
  EvidenceV3Type,
  WizardIRV3EngineModel,
  WizardSummaryV3Type
} from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';
import {
  InnovationDocumentsListOutDTO,
  InnovationDocumentsService
} from '@modules/shared/services/innovation-documents.service';
import { InnovationSectionStatusEnum, InnovationStatusEnum } from '@modules/stores';
import { InnovationSectionStepLabels } from '@modules/stores/innovation/innovation-record/ir-versions.types';
import { NotificationEnum } from '@modules/feature-modules/accessor/services/accessor.service';
import { CustomNotificationEntrypointComponentLinksType } from '@modules/feature-modules/accessor/pages/innovation/custom-notifications/custom-notifications-entrypoint.component';

export type SectionInfoType = {
  id: string;
  nextSectionId: null | string;
  title: string;
  status: { id: InnovationSectionStatusEnum; label: string };
  submitButton: { show: boolean; label: string };
  isNotStarted: boolean;
  hasEvidences: boolean;
  wizard: WizardIRV3EngineModel;
  allStepsList: InnovationSectionStepLabels;
  date: string;
  submittedBy: null | { name: string; displayTag?: string };
  openTasksCount: number;
};

@Component({
  selector: 'shared-pages-innovation-section-info',
  templateUrl: './section-info.component.html'
})
export class PageInnovationSectionInfoComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  sectionId: string;

  assessmentType = '';
  sectionSubmittedText = '';

  sectionsIdsList: string[];

  sectionSummaryData: {
    sectionInfo: SectionInfoType;
    summaryList: WizardSummaryV3Type[];
    evidencesList: EvidenceV3Type[];
    documentsList: InnovationDocumentsListOutDTO['data'];
  };

  previousSection: null | { id: string; title: string } = null;
  nextSection: null | { id: string; title: string } = null;

  baseUrl: string;

  // Flags
  shouldShowDocuments = false;

  search?: string;

  customNotificationLinks: CustomNotificationEntrypointComponentLinksType = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService
  ) {
    super();

    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.search = this.activatedRoute.snapshot.queryParams.search;

    this.innovation = this.ctx.innovation.info();
    this.assessmentType =
      this.innovation.assessment && this.innovation.assessment.majorVersion > 1 ? 'reassessment' : 'assessment';

    this.sectionsIdsList = this.ctx.schema.getSubSectionsIds();

    this.baseUrl = `${this.ctx.user.userUrlBasePath()}/innovations/${this.innovation.id}`;

    this.sectionSummaryData = {
      sectionInfo: {
        id: '',
        nextSectionId: null,
        title: '',
        status: { id: InnovationSectionStatusEnum.NOT_STARTED, label: '' },
        submitButton: { show: false, label: 'Confirm section answers' },
        isNotStarted: false,
        hasEvidences: false,
        wizard: new WizardIRV3EngineModel({}),
        allStepsList: {},
        date: '',
        submittedBy: null,
        openTasksCount: 0
      },
      summaryList: [],
      evidencesList: [],
      documentsList: []
    };
  }

  ngOnInit(): void {
    this.initializePage();

    // This router subscription is needed for the button to go to the next step.
    // As is it the same component, we can't use the routerLink directive alone.
    this.subscriptions.push(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => this.initializePage())
    );
  }

  private initializePage(): void {
    this.setPageStatus('LOADING');

    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    const sectionIdentification = this.ctx.schema.getIrSchemaSectionIdentificationV3(this.sectionId);

    const savedOrSubmitted = !this.ctx.innovation.isArchived() ? 'submitted' : 'saved';

    this.sectionSubmittedText = sectionIdentification
      ? `You have ${savedOrSubmitted} section ${sectionIdentification?.group.number}.${sectionIdentification?.section.number} '${sectionIdentification?.section.title}'`
      : '';

    this.setPageTitle(this.translate(sectionIdentification!.section.title), {
      hint: sectionIdentification ? `${sectionIdentification.group.number}. ${sectionIdentification.group.title}` : ''
    });
    this.setBackLink('Innovation Record', `${this.baseUrl}/record`);

    const section = this.ctx.schema.getIrSchemaSectionV3(this.sectionId);

    this.sectionSummaryData.sectionInfo.id = section.id;
    this.sectionSummaryData.sectionInfo.title = section.title;
    this.sectionSummaryData.sectionInfo.wizard = section.wizard;

    // Status not created or archived as created or it's a section with files.
    this.shouldShowDocuments =
      !!this.innovation.submittedAt ||
      this.ctx.schema.getInnovationSectionsWithFiles().includes(this.sectionSummaryData.sectionInfo.id);

    forkJoin([
      this.ctx.innovation.getSectionInfo$(this.innovation.id, this.sectionSummaryData.sectionInfo.id),
      !this.shouldShowDocuments
        ? of(null)
        : this.innovationDocumentsService.getDocumentList(this.innovation.id, {
            skip: 0,
            take: 100,
            order: { createdAt: 'ASC' },
            filters: {
              contextTypes: ['INNOVATION_SECTION'],
              contextId: this.sectionSummaryData.sectionInfo.id,
              fields: ['description']
            }
          })
    ]).subscribe(([sectionInfo, documents]) => {
      this.sectionSummaryData.sectionInfo.status = {
        id: sectionInfo.status,
        label: this.translate(`shared.catalog.innovation.support_status.${sectionInfo.status}.name`)
      };
      this.sectionSummaryData.sectionInfo.isNotStarted = ['NOT_STARTED', 'UNKNOWN'].includes(
        this.sectionSummaryData.sectionInfo.status.id
      );

      this.sectionSummaryData.sectionInfo.date = sectionInfo.submittedAt;
      this.sectionSummaryData.sectionInfo.submittedBy = sectionInfo.submittedBy;
      this.sectionSummaryData.sectionInfo.openTasksCount = sectionInfo.tasksIds ? sectionInfo.tasksIds.length : 0;

      // Special business rule around section 2.2.

      this.sectionSummaryData.sectionInfo.hasEvidences = !!(
        section.evidences &&
        sectionInfo.data.hasEvidence &&
        sectionInfo.data.hasEvidence === 'YES'
      );

      const wizard = this.sectionSummaryData.sectionInfo.wizard;
      wizard.setAnswers(sectionInfo.data).runRules();

      const data = this.sectionSummaryData.sectionInfo.wizard.runInboundParsing().parseSummary();

      const evidenceData = sectionInfo.data.evidences
        ? (sectionInfo.data.evidences as { id: string; name: string; summary: string }[]).map(item => ({
            evidenceId: item.id,
            label: item.name,
            value: item.summary
          }))
        : [];

      const validInformation = this.sectionSummaryData.sectionInfo.wizard.validateData();

      if (this.sectionSummaryData.sectionInfo.status.id === 'DRAFT' && validInformation.valid) {
        this.sectionSummaryData.sectionInfo.submitButton.show = true;
        if (
          this.innovation.status !== InnovationStatusEnum.CREATED &&
          this.innovation.status !== InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT
        ) {
          this.sectionSummaryData.sectionInfo.submitButton.label = !this.ctx.innovation.isArchived()
            ? 'Submit updates'
            : 'Save updates';
        }
      } else {
        this.sectionSummaryData.sectionInfo.submitButton.show = false;
      }

      this.sectionSummaryData.summaryList = data.filter(item => !item.evidenceId);

      this.sectionSummaryData.evidencesList = evidenceData;

      this.getPreviousAndNextPagination();

      this.sectionSummaryData.documentsList = documents?.data ?? [];

      this.customNotificationLinks = [
        {
          label: 'Notify me when this section of the innovation record is updated',
          action: NotificationEnum.INNOVATION_RECORD_UPDATED
        }
      ];

      this.setPageStatus('READY');
    });
  }

  private getPreviousAndNextPagination(): void {
    const currentSectionIndex = this.sectionsIdsList.indexOf(this.sectionId);
    const previousSectionId = this.sectionsIdsList[currentSectionIndex - 1] || null;
    const nextSectionId = this.sectionsIdsList[currentSectionIndex + 1] || null;

    if (previousSectionId) {
      const previousSection = this.ctx.schema.getIrSchemaSectionIdentificationV3(previousSectionId);
      this.previousSection = {
        id: previousSectionId,
        title: previousSection
          ? `${previousSection.group.number}.${previousSection.section.number} ${previousSection.section.title}`
          : ''
      };
    } else {
      this.previousSection = null;
    }

    if (nextSectionId) {
      const nextSection = this.ctx.schema.getIrSchemaSectionIdentificationV3(nextSectionId);
      this.nextSection = {
        id: nextSectionId,
        title: nextSection
          ? `${nextSection.group.number}.${nextSection.section.number} ${nextSection.section.title}`
          : ''
      };
    } else {
      this.nextSection = null;
    }
  }

  onSubmitSection(): void {
    this.ctx.innovation.submitSections$(this.innovation.id, this.sectionSummaryData.sectionInfo.id).subscribe({
      next: () => {
        if (
          this.innovation.status === InnovationStatusEnum.CREATED ||
          this.innovation.status === InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT
        ) {
          this.sectionSummaryData.sectionInfo.status = {
            id: InnovationSectionStatusEnum.SUBMITTED,
            label: this.translate(
              `shared.catalog.innovation.support_status.${InnovationSectionStatusEnum.SUBMITTED}.name`
            )
          };
          this.sectionSummaryData.sectionInfo.submitButton.show = false;
          this.sectionSummaryData.sectionInfo.nextSectionId = this.getNextSectionId();
          this.setAlertSuccess('Your answers have been confirmed for this section', {
            message: this.sectionSummaryData.sectionInfo.nextSectionId
              ? 'Go to next section or return to the full innovation record'
              : undefined
          });
        } else {
          this.setRedirectAlertSuccess(this.sectionSubmittedText);
          this.redirectTo(`/${this.baseUrl}/record/sections/${this.sectionSummaryData.sectionInfo.id}/submitted`);
        }
      },
      error: () => this.setAlertUnknownError()
    });
  }

  private getNextSectionId(): string | null {
    const currentSectionIndex = this.sectionsIdsList.indexOf(this.sectionSummaryData.sectionInfo.id);

    return this.sectionsIdsList[currentSectionIndex + 1] || null;
  }
}
