import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { ContextInnovationType, MappedObjectType } from '@app/base/types';

import { CustomNotificationEntrypointComponentLinksType } from '@modules/feature-modules/accessor/pages/innovation/custom-notifications/custom-notifications-entrypoint.component';
import { NotificationEnum } from '@modules/feature-modules/accessor/services/accessor.service';
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
import { UtilsHelper } from '@app/base/helpers';
import { RegulationsSectionAnswersType } from '../../../components/regulations-table/section-regulations-documents-table.component';
import { IrV3TranslatePipe } from '@modules/shared/pipes/ir-v3-translate.pipe';
import { innovationsSubSections } from '@modules/stores/innovation/innovation-record/ir-versions.config';

export type SectionInfoType = {
  id: string;
  nextSectionId: null | string;
  title: string;
  status: { id: InnovationSectionStatusEnum; label: string };
  submitButton: { show: boolean; label: string };
  isNotStarted: boolean;
  wizard: WizardIRV3EngineModel;
  allStepsList: InnovationSectionStepLabels;
  date: string;
  submittedBy: null | { name: string; displayTag?: string };
  openTasksCount: number;
};

type SectionSummaryDataType = {
  sectionInfo: SectionInfoType;
  summaryList: WizardSummaryV3Type[];
  evidencesList: EvidenceV3Type[];
  documentsList: InnovationDocumentsListOutDTO['data'];
};
type EvidenceDataType = {
  evidenceSupportingDocumentsList: InnovationDocumentsListOutDTO['data'];
  evidencesWithoutDocuments: EvidenceV3Type[];
  hasEvidences: boolean;
  hasAddedEvidence: boolean;
  allEvidencesHaveDocuments: boolean;
};
type RegulationsDataType = {
  regulationsDocumentsList: InnovationDocumentsListOutDTO['data'];
  regulationsList: string[];
  hasRegulations: boolean;
  allRegulationsHaveDocuments: boolean;
  regulationsWithoutDocuments: string[];
};

@Component({
  selector: 'shared-pages-innovation-section-info',
  templateUrl: './section-info.component.html'
})
export class PageInnovationSectionInfoComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  sectionId: string;

  assessmentType = '';
  sectionLabel = '';

  baseUrl: string;
  search?: string;

  // IR/sections data
  sectionSummaryData: SectionSummaryDataType;
  evidenceData: EvidenceDataType;
  regulationsData: RegulationsDataType;
  sectionInfoData: MappedObjectType = {};

  // pagination
  sectionsIdsPaginationList: string[];
  previousSection: null | { id: string; title: string } = null;
  nextSection: null | { id: string; title: string } = null;

  // Flags
  shouldShowDocuments = false;
  lastSection = false;
  isInnovationInCreatedStatus = false;

  isEvidenceSection = false;
  isRegulationsSection = false;
  isSectionComplete = false;

  customNotificationLinks: CustomNotificationEntrypointComponentLinksType[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService,
    private irv3translate: IrV3TranslatePipe
  ) {
    super();

    this.innovation = this.ctx.innovation.info();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    this.assessmentType =
      this.innovation.assessment && this.innovation.assessment.majorVersion > 1 ? 'reassessment' : 'assessment';

    this.baseUrl = `${this.ctx.user.userUrlBasePath()}/innovations/${this.innovation.id}`;
    this.search = this.activatedRoute.snapshot.queryParams.search;

    this.isInnovationInCreatedStatus = this.innovation.status === InnovationStatusEnum.CREATED;

    this.sectionsIdsPaginationList = this.ctx.schema.getSubSectionsIds();

    // init empty vars
    this.evidenceData = this.returnEmptyEvidenceData();
    this.sectionSummaryData = this.returnEmptySectionSummaryData();
    this.regulationsData = this.returnEmptyRegulationsData();
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

    this.isEvidenceSection = this.sectionId === innovationsSubSections.EVIDENCE_OF_EFFECTIVENESS;
    this.isRegulationsSection = this.sectionId === innovationsSubSections.REGULATIONS_AND_STANDARDS;

    const sectionIdentification = this.getSectionMetadata(this.sectionId);

    this.sectionLabel = sectionIdentification.label;
    this.setPageTitle(sectionIdentification.title),
      {
        width: 'full',
        hint: sectionIdentification.hint
      };
    this.setBackLink('Innovation Record', `${this.baseUrl}/record`);

    const section = this.ctx.schema.getIrSchemaSectionV3(this.sectionId);

    this.sectionSummaryData.sectionInfo.id = section.id;
    this.sectionSummaryData.sectionInfo.title = section.title;
    this.sectionSummaryData.sectionInfo.wizard = section.wizard;

    // Status not created or archived as created or it's a section with files.
    this.shouldShowDocuments =
      !!this.innovation.submittedAt ||
      this.ctx.schema.getInnovationSectionsWithFiles().includes(this.sectionSummaryData.sectionInfo.id);

    forkJoin({
      sectionInfo: this.ctx.innovation.getSectionInfo$(this.innovation.id, this.sectionId),
      sectionDocuments: this.shouldShowDocuments
        ? this.getDocumentsByContext('INNOVATION_SECTION', this.sectionId)
        : of(null),
      evidenceDocuments: this.isEvidenceSection ? this.getDocumentsByContext('INNOVATION_EVIDENCE') : of(null),
      regulationsDocuments: this.isRegulationsSection ? this.getDocumentsByContext('INNOVATION_REGULATIONS') : of(null),
      allSections:
        this.ctx.user.isInnovator() && this.innovation.status === InnovationStatusEnum.CREATED
          ? this.ctx.innovation.getSectionsSummary$(this.innovation.id)
          : of(null)
    }).subscribe({
      next: response => {
        // data for regulations table
        this.sectionInfoData = response.sectionInfo.data;

        // set mandatory documents data
        const sectionDocuments = response.sectionDocuments?.data ?? [];
        this.sectionSummaryData.documentsList = sectionDocuments;

        const wizard = this.sectionSummaryData.sectionInfo.wizard;
        wizard.setAnswers(response.sectionInfo.data).runRules();
        const data = wizard.runInboundParsing().parseSummary();

        this.sectionSummaryData.summaryList = data.filter(item => !item.evidenceId);

        this.sectionSummaryData.sectionInfo.status = {
          id: response.sectionInfo.status,
          label: this.translate(`shared.catalog.innovation.support_status.${response.sectionInfo.status}.name`)
        };
        this.sectionSummaryData.sectionInfo.isNotStarted = ['NOT_STARTED', 'UNKNOWN'].includes(
          this.sectionSummaryData.sectionInfo.status.id
        );
        this.sectionSummaryData.sectionInfo.date = response.sectionInfo.submittedAt;
        this.sectionSummaryData.sectionInfo.submittedBy = response.sectionInfo.submittedBy;
        this.sectionSummaryData.sectionInfo.openTasksCount = response.sectionInfo.tasksIds
          ? response.sectionInfo.tasksIds.length
          : 0;

        const validInformation = wizard.validateData();
        this.isSectionComplete = this.sectionSummaryData.sectionInfo.status.id === 'DRAFT' && validInformation.valid;

        // Special business rule around section 2.2. EVIDENCE_OF_EFFECTIVENESS
        if (this.isEvidenceSection) {
          // only show documents if legacy section documents are present
          this.shouldShowDocuments = !!response.sectionDocuments?.count;

          const evidenceSupportingDocuments = response.evidenceDocuments?.data ?? [];
          const evidenceData = response.sectionInfo.data.evidences
            ? (response.sectionInfo.data.evidences as { id: string; name: string; summary: string }[]).map(item => ({
                evidenceId: item.id,
                label: item.name,
                value: item.summary
              }))
            : [];

          this.sectionSummaryData.evidencesList = evidenceData;

          this.evidenceData.evidenceSupportingDocumentsList = evidenceSupportingDocuments;
          this.evidenceData.evidencesWithoutDocuments = UtilsHelper.evidenceWithoutDocuments(
            this.sectionSummaryData.evidencesList,
            evidenceSupportingDocuments
          );
          this.evidenceData.hasEvidences = !!(
            section.evidences &&
            response.sectionInfo.data.hasEvidence &&
            response.sectionInfo.data.hasEvidence === 'YES'
          );
          this.evidenceData.hasAddedEvidence = this.sectionSummaryData.evidencesList.length > 0;
          this.evidenceData.allEvidencesHaveDocuments = this.evidenceData.evidencesWithoutDocuments.length === 0;

          // extra rules for Evidence Section in order to be able to mark as complete
          this.isSectionComplete =
            this.isSectionComplete &&
            this.evidenceData.hasEvidences &&
            this.evidenceData.hasAddedEvidence &&
            this.evidenceData.allEvidencesHaveDocuments;

          // only add errors for innovators
          if (this.ctx.user.isInnovator()) {
            this.handleMissingEvidenceAlerts();
          }
        }

        // Special business rules around section 5.1 REGULATIONS_AND_STANDARDS
        if (this.isRegulationsSection) {
          // only show documents if legacy section documents are present
          this.shouldShowDocuments = !!response.sectionDocuments?.count;

          this.regulationsData.regulationsDocumentsList = response.regulationsDocuments?.data ?? [];

          this.regulationsData.regulationsList =
            (response.sectionInfo.data as RegulationsSectionAnswersType).standards?.map(s => s.type) ?? [];

          this.regulationsData.hasRegulations =
            response.sectionInfo.data.hasRegulationKnowledge &&
            ['YES_ALL', 'YES_SOME'].includes(response.sectionInfo.data.hasRegulationKnowledge);

          this.regulationsData.regulationsWithoutDocuments = UtilsHelper.regulationsWithoutDocuments(
            this.regulationsData.regulationsList,
            this.regulationsData.regulationsDocumentsList
          );

          this.regulationsData.allRegulationsHaveDocuments =
            this.regulationsData.regulationsWithoutDocuments.length === 0;

          // extra rules for Regulations section in order to be able to mark as complete
          this.isSectionComplete =
            this.isSectionComplete &&
            this.regulationsData.hasRegulations &&
            this.regulationsData.allRegulationsHaveDocuments;

          // add error if any regulation is missing document, and only for innovators
          if (
            this.ctx.user.isInnovator() &&
            this.regulationsData.hasRegulations &&
            // response.sectionInfo.data.standards &&
            !!response.sectionInfo.data.standards.length &&
            !this.regulationsData.allRegulationsHaveDocuments
          ) {
            this.handleMissingRegulationsAlerts();
          }
        }

        if (this.isSectionComplete) {
          this.sectionSummaryData.sectionInfo.submitButton.show = true;
          if (this.innovation.status !== InnovationStatusEnum.CREATED) {
            this.sectionSummaryData.sectionInfo.submitButton.label = 'Save updates';
          }
        } else {
          this.sectionSummaryData.sectionInfo.submitButton.show = false;
        }

        this.getPreviousAndNextPagination();

        this.customNotificationLinks = [
          {
            label: 'Notify me when this section of the innovation record is updated',
            action: NotificationEnum.INNOVATION_RECORD_UPDATED,
            section: this.sectionId
          }
        ];

        // If the user is an innovator and the innovation is in CREATED status, we need to check if all other sections are submitted.
        this.lastSection = response.allSections
          ? !response.allSections
              .flatMap(s => s.sections)
              .some(s => s.status != InnovationSectionStatusEnum.SUBMITTED && s.id !== this.sectionId)
          : false;
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  private getPreviousAndNextPagination(): void {
    const currentSectionIndex = this.sectionsIdsPaginationList.indexOf(this.sectionId);
    const previousSectionId = this.sectionsIdsPaginationList[currentSectionIndex - 1] || null;
    const nextSectionId = this.sectionsIdsPaginationList[currentSectionIndex + 1] || null;

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
        this.setRedirectAlertSuccess(`You have completed section ${this.sectionLabel}`);
        if (
          this.innovation.status === InnovationStatusEnum.CREATED ||
          this.innovation.status === InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT
        ) {
          if (this.lastSection) {
            this.redirectTo(`/innovator/innovations/${this.innovation.id}/submission-ready`);
          } else {
            this.sectionSummaryData.sectionInfo.status = {
              id: InnovationSectionStatusEnum.SUBMITTED,
              label: this.translate(
                `shared.catalog.innovation.support_status.${InnovationSectionStatusEnum.SUBMITTED}.name`
              )
            };
            this.sectionSummaryData.sectionInfo.submitButton.show = false;
            this.sectionSummaryData.sectionInfo.nextSectionId = this.getNextSectionId();
          }
        } else {
          this.redirectTo(`/${this.baseUrl}/record/sections/${this.sectionSummaryData.sectionInfo.id}/submitted`);
        }
      },
      error: () => this.setAlertUnknownError()
    });
  }

  private getNextSectionId(): string | null {
    const currentSectionIndex = this.sectionsIdsPaginationList.indexOf(this.sectionSummaryData.sectionInfo.id);

    return this.sectionsIdsPaginationList[currentSectionIndex + 1] || null;
  }

  private getDocumentsByContext(
    contextType: 'INNOVATION_SECTION' | 'INNOVATION_EVIDENCE' | 'INNOVATION_REGULATIONS',
    contextId?: string
  ) {
    return this.innovationDocumentsService.getDocumentList(this.innovation.id, {
      skip: 0,
      take: 100,
      order: { createdAt: 'ASC' },
      filters: {
        contextTypes: [contextType],
        ...(contextId && { contextId }),
        fields: ['description']
      }
    });
  }

  private getSectionMetadata(sectionId: string) {
    const identification = this.ctx.schema.getIrSchemaSectionIdentificationV3(sectionId);

    return {
      label: identification
        ? `${identification.group.number}.${identification.section.number} '${identification.section.title}'`
        : '',
      title: identification?.section.title ?? '',
      hint: identification ? `${identification.group.number}. ${identification.group.title}` : ''
    };
  }

  private handleMissingEvidenceAlerts(): void {
    // add warning callout if answered YES but has not added evidence
    if (this.evidenceData.hasEvidences && !this.evidenceData.hasAddedEvidence) {
      this.setAlertError('There is a problem', {
        message: 'In order to mark this section as complete, you need to add at least one evidence.',
        width: 'full'
      });
    }

    // add error if any evidence is missing document
    if (this.evidenceData.hasAddedEvidence && !this.evidenceData.allEvidencesHaveDocuments) {
      const errorItemsList = this.evidenceData.evidencesWithoutDocuments.map(e => ({
        title: e.label,
        callback: `${this.baseUrl}/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/${e.evidenceId})`
      }));

      this.setAlertError('There is a problem', {
        message: 'You must add a supporting document for this evidence.',
        itemsList: errorItemsList,
        width: 'full'
      });
    }
  }

  private handleMissingRegulationsAlerts(): void {
    const errorItemsList = this.regulationsData.regulationsWithoutDocuments.map(e => ({
      title: this.irv3translate.transform(e, 'items', 'standards'),
      callback: `${this.baseUrl}/documents/new?regulationId=${e}`
    }));
    this.setAlertError('There is a problem', {
      message: 'Each certification must include at least one supporting document to complete this section.',
      itemsList: errorItemsList,
      width: 'full'
    });
  }

  private returnEmptySectionSummaryData(): SectionSummaryDataType {
    return {
      sectionInfo: this.returnEmptySectionInfoData(),
      summaryList: [],
      evidencesList: [],
      documentsList: []
    };
  }
  private returnEmptyEvidenceData(): EvidenceDataType {
    return {
      evidenceSupportingDocumentsList: [],
      evidencesWithoutDocuments: [],
      hasEvidences: false,
      hasAddedEvidence: false,
      allEvidencesHaveDocuments: false
    };
  }
  private returnEmptyRegulationsData(): RegulationsDataType {
    return {
      regulationsDocumentsList: [],
      regulationsList: [],
      regulationsWithoutDocuments: [],
      hasRegulations: false,
      allRegulationsHaveDocuments: false
    };
  }

  private returnEmptySectionInfoData(): SectionInfoType {
    return {
      id: '',
      nextSectionId: null,
      title: '',
      status: { id: InnovationSectionStatusEnum.NOT_STARTED, label: '' },
      submitButton: { show: false, label: 'Mark section complete' },
      isNotStarted: false,
      wizard: new WizardIRV3EngineModel({}),
      allStepsList: {},
      date: '',
      submittedBy: null,
      openTasksCount: 0
    };
  }
}
