import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
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
export class InnovationSectionSummaryComponent extends CoreComponent implements OnInit, OnChanges {

  @Input() innovation!: ContextInnovationType;
  @Input() sectionId: string | undefined;

  sectionInfo: {
    id: string,
    nextSectionId: null | string,
    title: string,
    status: { id: keyof typeof INNOVATION_SECTION_STATUS, label: string },
    submitButton: { show: boolean, label: string },
    isNotStarted: boolean,
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
  isSectionDetailsPage: string | undefined = undefined;


  // Flags
  isInnovatorType: boolean;
  isAccessorType: boolean;
  isAssessmentType: boolean;
  shouldShowDocuments = false;

  paramSubscription: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService
  ) {

    super();

    this.innovation = this.innovation ?? this.stores.context.getInnovation();

    this.sectionInfo = {
      id: '',
      nextSectionId: null,
      title: '',
      status: { id: 'UNKNOWN', label: '' },
      submitButton: { show: false, label: "Confirm section answers" },
      isNotStarted: false,
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

    this.innovation = this.innovation ?? this.stores.context.getInnovation();
  }

  ngOnInit(): void {

    this.setPageStatus('LOADING');

    this.initializePage();

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializePage();
  }

  private initializePage(): void {

    this.sectionId = this.sectionId || '';
    this.isSectionDetailsPage = this.activatedRoute.snapshot.params.sectionId;

    const sectionIdentification = this.stores.innovation.getInnovationRecordSectionIdentification(this.sectionId);

    this.sectionSubmittedText =  sectionIdentification ? `You have submitted section ${sectionIdentification?.group.number}.${sectionIdentification?.section.number} '${sectionIdentification?.section.title}'` : '';

    const section = this.stores.innovation.getInnovationRecordSection(this.sectionId);

    this.sectionInfo.id = section.id;
    this.sectionInfo.title = section.title;
    this.sectionInfo.wizard = section.wizard;
    this.sectionInfo.allStepsList = section.allStepsList ? section.allStepsList : {};

    this.shouldShowDocuments =
      this.innovation.status !== InnovationStatusEnum.CREATED ||
      (this.innovation.status === InnovationStatusEnum.CREATED && innovationSectionsWithFiles.includes(this.sectionInfo.id));

    forkJoin([
      this.stores.innovation.getSectionInfo$(this.innovation.id, this.sectionInfo.id),
      !this.shouldShowDocuments ? of(null) : this.innovationDocumentsService.getDocumentList(this.innovation.id, {
        skip: 0,
        take: 50,
        order: { createdAt: 'ASC' },
        filters: { contextTypes: ['INNOVATION_SECTION'], contextId: this.sectionInfo.id, fields: ['description'] }
      })
    ]).subscribe(([sectionInfo, documents]) => {

      this.sectionInfo.status = { id: sectionInfo.status, label: INNOVATION_SECTION_STATUS[sectionInfo.status]?.label || '' };
      this.sectionInfo.isNotStarted = ['NOT_STARTED', 'UNKNOWN'].includes(this.sectionInfo.status.id);
      this.sectionInfo.date = sectionInfo.submittedAt;
      this.sectionInfo.submittedBy = sectionInfo.submittedBy;
      this.sectionInfo.openTasksCount = sectionInfo.tasksIds ? sectionInfo.tasksIds.length : 0;

      if (this.stores.authentication.isAccessorType() && this.innovation.status === 'IN_PROGRESS' && this.sectionInfo.status.id === 'DRAFT') {
        // If accessor, only view information if section is submitted.
        this.summaryList = [];
      } else {

        // Special business rule around section 2.2.
        this.sectionInfo.hasEvidences = !!(section.evidences && sectionInfo.data.hasEvidence && sectionInfo.data.hasEvidence === 'YES');

        this.sectionInfo.wizard.setAnswers(this.sectionInfo.wizard.runInboundParsing(sectionInfo.data)).runRules();

        const validInformation = this.sectionInfo.wizard.validateData();

        if (this.sectionInfo.status.id === 'DRAFT' && validInformation.valid) {
          this.sectionInfo.submitButton.show = true;
          if (this.innovation.status !== InnovationStatusEnum.CREATED && this.innovation.status !== InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT) {
            this.sectionInfo.submitButton.label = "Submit updates"
          }
        }

        const data = this.sectionInfo.wizard.runSummaryParsing();
        this.summaryList = data.filter(item => !item.evidenceId);
        this.evidencesList = data.filter(item => item.evidenceId);

      }

      // Documents.
      this.documentsList = documents?.data ?? [];

      this.setPageStatus('READY');

    })

  }

  private getNextSectionId(): string | null {

    const currentSectionIndex = this.sectionsIdsList.indexOf(this.sectionInfo.id);

    return this.sectionsIdsList[currentSectionIndex + 1] || null;

  }

  onSubmitSection(): void {

    this.stores.innovation.submitSections$(this.innovation.id, this.sectionInfo.id).subscribe({
      next: () => {

        if (this.innovation.status === InnovationStatusEnum.CREATED || this.innovation.status === InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT) {
          this.sectionInfo.status = { id: 'SUBMITTED', label: 'Submitted' };
          this.sectionInfo.submitButton.show = false;
          this.sectionInfo.nextSectionId = this.getNextSectionId();
          this.setAlertSuccess('Your answers have been confirmed for this section', { message: this.sectionInfo.nextSectionId ? 'Go to next section or return to the full innovation record' : undefined });
        } else {
          this.setRedirectAlertSuccess(this.sectionSubmittedText);
          this.redirectTo(`/${this.baseUrl}/record/sections/${this.sectionInfo.id}/submitted`);
        }

      },
      error: () => this.setAlertUnknownError()
    });

  }
  
}