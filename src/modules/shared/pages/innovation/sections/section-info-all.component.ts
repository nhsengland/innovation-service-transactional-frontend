import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import {
  InnovationDocumentsListOutDTO,
  InnovationDocumentsService
} from '@modules/shared/services/innovation-documents.service';
import { ContextInnovationType } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation';
import {
  INNOVATION_SECTION_STATUS,
  InnovationAllSectionsInfoDTO,
  SectionsSummaryModel
} from '@modules/stores/innovation/innovation.models';
import { forkJoin } from 'rxjs';
import { SectionInfoType } from './section-info.component';
import { ViewportScroller } from '@angular/common';
import {
  EvidenceV3Type,
  WizardIRV3EngineModel,
  WizardSummaryV3Type
} from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';

type ProgressBarType = '1:active' | '2:warning' | '3:inactive';

@Component({
  selector: 'shared-pages-innovation-all-sections-info',
  templateUrl: './section-info-all.component.html'
})
export class PageInnovationAllSectionsInfoComponent extends CoreComponent implements OnInit {
  innovationsSectionsList = this.stores.schema.getIrSchemaSectionsListV3();

  innovationsSubSectionsList: string[] = this.stores.schema.getIrSchemaSubSectionsIdsListV3();

  innovationId: string;

  baseUrl: string;
  documentUrl: string;
  pdfDocumentUrl: string;
  assessmentUrl: string;

  innovation: ContextInnovationType;
  innovationSections: SectionsSummaryModel = [];
  sections: {
    progressBar: ProgressBarType[];
    submitted: number;
    draft: number;
    notStarted: number;
    withOpenTasksCount: number;
    openTasksCount: number;
  } = { progressBar: [], submitted: 0, draft: 0, notStarted: 0, withOpenTasksCount: 0, openTasksCount: 0 };

  // Flags.
  isInnovatorType: boolean;
  isAccessorType: boolean;
  isAssessmentType: boolean;
  isAdmin: boolean;

  isInnovationInCreatedStatus: boolean;
  isInnovationInArchivedStatus: boolean;
  showSupportingTeamsShareRequestSection: boolean;
  showInnovatorShareRequestSection: boolean;

  allSectionsSubmitted = false;

  sectionIdFragment: string | null;

  assessmentQueryParam?: string;
  editPageQueryParam?: string;

  allSectionsData: {
    [key: string]: {
      sectionInfo: SectionInfoType;
      summaryList: WizardSummaryV3Type[];
      evidencesList: EvidenceV3Type[];
      documentsList: InnovationDocumentsListOutDTO['data'];
    };
  } = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService,
    private viewportScroller: ViewportScroller
  ) {
    super();

    this.innovation = this.stores.context.getInnovation();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.sectionIdFragment = this.activatedRoute.snapshot.fragment;
    this.assessmentQueryParam = this.activatedRoute.snapshot.queryParams.assessment;
    this.editPageQueryParam = this.activatedRoute.snapshot.queryParams.editPage;

    this.baseUrl = `/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}`;
    this.documentUrl = `${this.CONSTANTS.APP_ASSETS_URL}/NHS-innovation-service-record.docx`;
    this.pdfDocumentUrl = `${this.CONSTANTS.APP_URL}/exports/${
      this.innovationId
    }/pdf?role=${this.stores.authentication.getUserContextInfo()?.roleId}`;
    this.assessmentUrl = `${this.baseUrl}/assessments/${this.innovation.assessment?.id}`;

    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();
    this.isAdmin = this.stores.authentication.isAdminRole();
    this.isInnovationInCreatedStatus = this.innovation.status === InnovationStatusEnum.CREATED;
    this.isInnovationInArchivedStatus = this.innovation.status === InnovationStatusEnum.ARCHIVED;
    this.showSupportingTeamsShareRequestSection =
      this.stores.authentication.isAccessorType() || this.stores.authentication.isAssessmentType();
    this.showInnovatorShareRequestSection =
      this.stores.authentication.isInnovatorType() && !this.isInnovationInCreatedStatus;
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');

    this.setGoBackLink();
    this.setPageTitle('All sections questions and answers', { hint: 'Innovation record' });

    this.getSectionsData();
  }

  getSectionsData() {
    let summaryList: WizardSummaryV3Type[];
    let evidencesList: EvidenceV3Type[];
    let documentsList: InnovationDocumentsListOutDTO['data'];

    forkJoin([
      this.stores.innovation.getAllSectionsInfo$(this.innovation.id),
      this.innovationDocumentsService.getDocumentList(this.innovation.id, {
        skip: 0,
        take: 100,
        order: { createdAt: 'ASC' },
        filters: { contextTypes: ['INNOVATION_SECTION'], fields: ['description'] }
      }),
      this.stores.innovation.getSectionsSummary$(this.activatedRoute.snapshot.params.innovationId)
    ]).subscribe(([sectionsResponse, documentsResponse, summary]) => {
      const allSections = this.stores.schema.getIrSchemaNumberedSubSectionsList();

      for (const curSection of allSections) {
        const responseItem: InnovationAllSectionsInfoDTO[number] = sectionsResponse.find(
          s => s.section.section === curSection.value
        ) ?? {
          data: {},
          section: { section: curSection.value, status: 'NOT_STARTED', openTasksCount: 0 }
        };

        const sectionInfo: SectionInfoType = {
          id: '',
          nextSectionId: null,
          title: '',
          status: { id: 'UNKNOWN', label: '' },
          submitButton: { show: false, label: 'Confirm section answers' },
          isNotStarted: false,
          hasEvidences: false,
          wizard: new WizardIRV3EngineModel({}),
          allStepsList: {},
          date: '',
          submittedBy: null,
          openTasksCount: 0
        };
        const sectionEvidenceData = responseItem.data.evidences
          ? (responseItem.data.evidences as { id: string; name: string; summary: string }[]).map(item => ({
              evidenceId: item.id,
              label: item.name,
              value: item.summary
            }))
          : [];
        const section = this.stores.schema.getIrSchemaSectionV3(responseItem.section.section);

        sectionInfo.id = section.id;
        sectionInfo.title = section.title;
        sectionInfo.wizard = section.wizard;

        sectionInfo.status = {
          id: responseItem.section.status as keyof typeof INNOVATION_SECTION_STATUS,
          label:
            INNOVATION_SECTION_STATUS[responseItem.section.status as keyof typeof INNOVATION_SECTION_STATUS]?.label ||
            ''
        };
        sectionInfo.isNotStarted = ['NOT_STARTED', 'UNKNOWN'].includes(sectionInfo.status.id);
        sectionInfo.date = responseItem.section.submittedAt ?? '';
        sectionInfo.submittedBy = responseItem.section.submittedBy
          ? {
              name: responseItem.section.submittedBy?.name,
              displayTag: responseItem.section.submittedBy?.displayTag
            }
          : null;
        sectionInfo.openTasksCount = responseItem.section.openTasksCount ? responseItem.section.openTasksCount : 0;

        // Special business rule around section 2.2.
        sectionInfo.hasEvidences = !!(
          section.evidences &&
          responseItem.data.hasEvidence &&
          responseItem.data.hasEvidence === 'YES'
        );

        sectionInfo.wizard.setAnswers(responseItem.data).runRules();

        const validInformation = sectionInfo.wizard.validateData();

        if (sectionInfo.status.id === 'DRAFT' && validInformation.valid) {
          sectionInfo.submitButton.show = true;
          if (
            this.innovation.status !== InnovationStatusEnum.CREATED &&
            this.innovation.status !== InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT
          ) {
            sectionInfo.submitButton.label = 'Submit updates';
          }
        }

        const data = sectionInfo.wizard.runInboundParsing().parseSummary();
        summaryList = data.filter(item => !item.evidenceId);
        evidencesList = sectionEvidenceData;
        documentsList = documentsResponse.data.filter(document => {
          return document.context.id === responseItem.section.section;
        });
        this.allSectionsData[sectionInfo.id] = {
          evidencesList: evidencesList,
          sectionInfo: sectionInfo,
          summaryList: summaryList,
          documentsList: documentsList
        };
      }

      this.setSectionsStatistics(summary);

      this.setPageStatus('READY');

      this.scrollToSectionWhenFragmentExists();
    });
  }

  setSectionsStatistics(summary: SectionsSummaryModel) {
    this.innovationSections = summary;

    this.sections.progressBar = this.innovationSections.reduce((acc: ProgressBarType[], item) => {
      return [
        ...acc,
        ...item.sections.map(s => {
          switch (s.status) {
            case 'SUBMITTED':
              return '1:active';
            case 'DRAFT':
              return '2:warning';
            case 'NOT_STARTED':
            default:
              return '3:inactive';
          }
        })
      ];
    }, []);

    this.sections.notStarted = this.innovationSections.reduce(
      (acc: number, item) => acc + item.sections.filter(s => s.status === 'NOT_STARTED').length,
      0
    );
    this.sections.draft = this.innovationSections.reduce(
      (acc: number, item) => acc + item.sections.filter(s => s.status === 'DRAFT').length,
      0
    );
    this.sections.submitted = this.innovationSections.reduce(
      (acc: number, item) => acc + item.sections.filter(s => s.status === 'SUBMITTED').length,
      0
    );
    this.sections.withOpenTasksCount = this.innovationSections.reduce(
      (acc: number, item) => acc + item.sections.filter(s => s.openTasksCount > 0).length,
      0
    );
    this.sections.openTasksCount = this.innovationSections.reduce(
      (acc: number, item) => acc + item.sections.reduce((acc: number, section) => acc + section.openTasksCount, 0),
      0
    );

    this.allSectionsSubmitted = this.sections.submitted === this.sections.progressBar.length;
  }

  scrollToSectionWhenFragmentExists() {
    setTimeout(() => {
      if (this.sectionIdFragment && this.sectionIdFragment in this.innovationsSubSectionsList) {
        const section = document.getElementById(this.sectionIdFragment);
        if (section) {
          this.viewportScroller.scrollToAnchor(this.sectionIdFragment);
        }
      }
    });
  }

  setGoBackLink(): void {
    if (this.isAssessmentType && this.assessmentQueryParam) {
      let goBackUrl = undefined;
      switch (this.assessmentQueryParam) {
        case 'editReason':
          goBackUrl = `${this.assessmentUrl}/edit/reason`;
          break;
        case 'edit':
          goBackUrl = `${this.assessmentUrl}/edit${this.editPageQueryParam ? `/${this.editPageQueryParam}` : ''}`;
          break;
        case 'overview':
          goBackUrl = `${this.assessmentUrl}`;
          break;
      }

      if (goBackUrl) {
        this.setBackLink('Back to needs (re)assessment', goBackUrl);
      }
    } else if (this.isInnovatorType || !this.isInnovationInArchivedStatus) {
      this.setBackLink('Innovation Record', `${this.baseUrl}/record`);
    }
  }
}
