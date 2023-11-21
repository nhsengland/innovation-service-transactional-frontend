import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

import { WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { InnovationDocumentsListOutDTO, InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';
import { INNOVATION_SECTION_STATUS, InnovationSectionEnum, InnovationStatusEnum } from '@modules/stores/innovation';
import { getInnovationRecordConfig, innovationSectionsWithFiles } from '@modules/stores/innovation/innovation-record/ir-versions.config';
import { InnovationSectionStepLabels, InnovationSectionsVersions } from '@modules/stores/innovation/innovation-record/ir-versions.types';



@Component({
    selector: 'shared-innovation-summary',
    templateUrl: './section-summary.component.html'
})
export class InnovationSectionSummaryComponent extends CoreComponent implements OnInit {

  @Input() innovation: ContextInnovationType = this.stores.context.getInnovation();
  @Input() sectionId: InnovationSectionEnum | InnovationSectionsVersions = InnovationSectionEnum.INNOVATION_DESCRIPTION;

  section: {
    id: InnovationSectionEnum,
    nextSectionId: null | string,
    title: string,
    status: { id: keyof typeof INNOVATION_SECTION_STATUS, label: string },
    isNotStarted: boolean,
    submitButton: { show: boolean, label: string },
    hasEvidences: boolean,
    wizard: WizardEngineModel,
    allStepsList: InnovationSectionStepLabels,
    date: string,
    submittedBy: null | { name: string, isOwner?: boolean },
    openTasksCount: number
  };

  sectionSubmittedText: string = '';

  sectionsIdsList: string[];
  summaryList: WizardSummaryType[] = [];
  evidencesList: WizardSummaryType[] = [];
  documentsList: InnovationDocumentsListOutDTO['data'] = [];

  baseUrl: string;
  isSectionDetailsPage: string | undefined = this.activatedRoute.snapshot.params.sectionId;


  // Flags
  isInnovatorType: boolean;
  isAccessorType: boolean;
  isAssessmentType: boolean;
  shouldShowDocuments = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService
  ) {

    super();

    this.innovation = this.innovation ?? this.stores.context.getInnovation();

    this.section = {
      id: this.sectionId as InnovationSectionEnum,
      nextSectionId: null,
      title: '',
      status: { id: 'UNKNOWN', label: '' },
      isNotStarted: false,
      submitButton: { show: false, label: "Confirm section answers" },
      hasEvidences: false,
      wizard: new WizardEngineModel({}),
      allStepsList: {},
      date: '',
      submittedBy: null,
      openTasksCount: 0
    };

    this.sectionsIdsList = getInnovationRecordConfig().flatMap(sectionsGroup => sectionsGroup.sections.map(section => section.id));

    this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}`;

    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();

  }

  ngOnInit(): void {
    
    console.log('route: ' + this.activatedRoute.snapshot.params.sectionId)
    this.initializePage();


  }

  private initializePage(): void {

    this.setPageStatus('LOADING');

    const sectionIdentification = this.stores.innovation.getInnovationRecordSectionIdentification(this.sectionId);

    this.sectionSubmittedText =  sectionIdentification ? `You have submitted section ${sectionIdentification?.group.number}.${sectionIdentification?.section.number} '${sectionIdentification?.section.title}'` : '';

    const section = this.stores.innovation.getInnovationRecordSection(this.sectionId);

    this.section.id = this.sectionId as InnovationSectionEnum;
    this.section.title = section.title;
    this.section.wizard = section.wizard;
    this.section.allStepsList = section.allStepsList ? section.allStepsList : {};

    this.shouldShowDocuments =
      this.innovation.status !== InnovationStatusEnum.CREATED ||
      (this.innovation.status === InnovationStatusEnum.CREATED && innovationSectionsWithFiles.includes(section.id));


    forkJoin([
      this.stores.innovation.getSectionInfo$(this.innovation.id, this.section.id),
      !this.shouldShowDocuments ? of(null) : this.innovationDocumentsService.getDocumentList(this.innovation.id, {
        skip: 0,
        take: 50,
        order: { createdAt: 'ASC' },
        filters: { contextTypes: ['INNOVATION_SECTION'], contextId: this.section.id, fields: ['description'] }
      })
    ]).subscribe(([sectionInfo, documents]) => {

      this.section.status = { id: sectionInfo.status, label: INNOVATION_SECTION_STATUS[sectionInfo.status]?.label || '' };
      this.section.isNotStarted = ['NOT_STARTED', 'UNKNOWN'].includes(this.section.status.id);
      this.section.date = sectionInfo.submittedAt;
      this.section.submittedBy = sectionInfo.submittedBy;
      this.section.openTasksCount = sectionInfo.tasksIds ? sectionInfo.tasksIds.length : 0;

      if (this.stores.authentication.isAccessorType() && this.innovation.status === 'IN_PROGRESS' && this.section.status.id === 'DRAFT') {
        // If accessor, only view information if section is submitted.
        this.summaryList = [];
      } else {

        // Special business rule around section 2.2.
        this.section.hasEvidences = !!(section.evidences && sectionInfo.data.hasEvidence && sectionInfo.data.hasEvidence === 'YES');

        this.section.wizard.setAnswers(this.section.wizard.runInboundParsing(sectionInfo.data)).runRules();

        const validInformation = this.section.wizard.validateData();

        if (this.section.status.id === 'DRAFT' && validInformation.valid) {
          this.section.submitButton.show = true;
          if (this.innovation.status !== InnovationStatusEnum.CREATED && this.innovation.status !== InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT) {
            this.section.submitButton.label = "Submit updates"
          }
        }

        const data = this.section.wizard.runSummaryParsing();
        this.summaryList = data.filter(item => !item.evidenceId);
        this.evidencesList = data.filter(item => item.evidenceId);

      }

      // Documents.
      this.documentsList = documents?.data ?? [];

      // this.setPageStatus('READY');

    })

  }
  
}