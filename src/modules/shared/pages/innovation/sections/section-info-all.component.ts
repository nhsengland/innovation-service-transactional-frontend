import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import {
  InnovationDocumentsListOutDTO,
  InnovationDocumentsService
} from '@modules/shared/services/innovation-documents.service';
import { ContextInnovationType } from '@modules/stores';
import { InnovationSectionEnum, InnovationStatusEnum } from '@modules/stores/innovation';
import { InnovationSections } from '@modules/stores/innovation/innovation-record/202209/catalog.types';
import { INNOVATION_SECTIONS } from '@modules/stores/innovation/innovation-record/202304/main.config';
import { getAllSectionsList } from '@modules/stores/innovation/innovation-record/ir-versions.config';
import { InnovationSectionsListType } from '@modules/stores/innovation/innovation-record/ir-versions.types';
import {
  INNOVATION_SECTION_STATUS,
  InnovationAllSectionsInfoDTO,
  SectionsSummaryModel
} from '@modules/stores/innovation/innovation.models';
import { forkJoin } from 'rxjs';
import { SectionInfoType } from './section-info.component';
import { SectionSummaryInputData } from './section-summary.component';

type ProgressBarType = '1:active' | '2:warning' | '3:inactive';

@Component({
  selector: 'shared-pages-innovation-all-sections-info',
  templateUrl: './section-info-all.component.html'
})
export class PageInnovationAllSectionsInfoComponent extends CoreComponent implements OnInit {
  innovationsSectionsList: InnovationSectionsListType = INNOVATION_SECTIONS;

  innovationsSubSectionsList: string[] = INNOVATION_SECTIONS.flatMap(el => el.sections.flatMap(section => section.id));

  innovationId: string;

  baseUrl: string;
  documentUrl: string;
  pdfDocumentUrl: string;

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

  isInnovationInCreatedStatus: boolean;
  showSupportingTeamsShareRequestSection: boolean;
  showInnovatorShareRequestSection: boolean;

  allSectionsSubmitted = false;

  allSectionsData: {
    [key in InnovationSectionEnum]?: {
      sectionInfo: SectionInfoType;
      summaryList: WizardSummaryType[];
      evidencesList: WizardSummaryType[];
      documentsList: InnovationDocumentsListOutDTO['data'];
    };
  } = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService
  ) {
    super();

    this.innovation = this.stores.context.getInnovation();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.baseUrl = `/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}`;
    this.documentUrl = `${this.CONSTANTS.APP_ASSETS_URL}/NHS-innovation-service-record.docx`;
    this.pdfDocumentUrl = `${this.CONSTANTS.APP_URL}/exports/${
      this.innovationId
    }/pdf?role=${this.stores.authentication.getUserContextInfo()?.roleId}`;

    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();
    this.isInnovationInCreatedStatus = this.innovation.status === InnovationStatusEnum.CREATED;
    this.showSupportingTeamsShareRequestSection =
      this.stores.authentication.isAccessorType() || this.stores.authentication.isAssessmentType();
    this.showInnovatorShareRequestSection =
      this.stores.authentication.isInnovatorType() && !this.isInnovationInCreatedStatus;
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');

    this.setBackLink('Innovation Record', `${this.baseUrl}/record`);
    this.setPageTitle('All sections questions and answers', { hint: 'Innovation record' });

    this.getSectionsData();
  }

  getSectionsData() {
    let summaryList: WizardSummaryType[];
    let evidencesList: WizardSummaryType[];
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
      const allSections = getAllSectionsList();

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
          wizard: new WizardEngineModel({}),
          allStepsList: {},
          date: '',
          submittedBy: null,
          openTasksCount: 0
        };

        const section = this.stores.innovation.getInnovationRecordSection(responseItem.section.section);

        sectionInfo.id = section.id;
        sectionInfo.title = section.title;
        sectionInfo.wizard = section.wizard;
        sectionInfo.allStepsList = section.allStepsList ? section.allStepsList : {};

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

        if (
          this.stores.authentication.isAccessorType() &&
          this.innovation.status === 'IN_PROGRESS' &&
          sectionInfo.status.id === 'DRAFT'
        ) {
          // If accessor, only view information if section is submitted.
          summaryList = [];
        } else {
          // Special business rule around section 2.2.
          sectionInfo.hasEvidences = !!(
            section.evidences &&
            responseItem.data.hasEvidence &&
            responseItem.data.hasEvidence === 'YES'
          );

          sectionInfo.wizard.setAnswers(sectionInfo.wizard.runInboundParsing(responseItem.data)).runRules();

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

          const data = sectionInfo.wizard.runSummaryParsing();
          summaryList = data.filter(item => !item.evidenceId);
          evidencesList = data.filter(item => item.evidenceId);
        }

        documentsList = documentsResponse.data.filter(document => {
          return document.context.id === responseItem.section.section;
        });

        this.allSectionsData[sectionInfo.id as InnovationSectionEnum] = {
          evidencesList: evidencesList,
          sectionInfo: sectionInfo,
          summaryList: summaryList,
          documentsList: documentsList
        };
      }

      this.setSectionsStatistics(summary);

      this.setPageStatus('READY');
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
}
