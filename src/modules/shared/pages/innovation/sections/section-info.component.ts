import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

import { WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { InnovationDocumentsListOutDTO, InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';
import { getInnovationRecordConfig, innovationSectionsWithFiles } from '@modules/stores/innovation/innovation-record/ir-versions.config';
import { INNOVATION_SECTION_STATUS, InnovationStatusEnum } from '@modules/stores/innovation';
import { InnovationSectionStepLabels } from '@modules/stores/innovation/innovation-record/ir-versions.types';
import { SectionSummaryInputData } from './section-summary.component';

export type SectionInfoType = {
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


@Component({
  selector: 'shared-pages-innovation-section-info',
  templateUrl: './section-info.component.html'
})
export class PageInnovationSectionInfoComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType;
  sectionId: string = '';

  sectionSubmittedText: string = '';

  sectionsIdsList: string[];
  summaryList: WizardSummaryType[] = [];
  evidencesList: WizardSummaryType[] = [];
  documentsList: InnovationDocumentsListOutDTO['data'] = [];

  previousSection: null | { id: string, title: string } = null;
  nextSection: null | { id: string, title: string } = null;

  baseUrl: string;

  // Flags
  isInnovatorType: boolean;
  isAccessorType: boolean;
  isAssessmentType: boolean;
  shouldShowDocuments = false;

  sectionInfo: SectionInfoType;
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService
  ) {

    super();

    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.innovation = this.stores.context.getInnovation();

    this.sectionsIdsList = getInnovationRecordConfig().flatMap(sectionsGroup => sectionsGroup.sections.map(section => section.id));

    this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}`;

    
    
    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();

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

  }

  ngOnInit(): void {
    
    this.initializePage();

    // This router subscription is needed for the button to go to the next step.
    // As is it the same component, we can't use the routerLink directive alone.
    
    this.subscriptions.push(

      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.initializePage())

    );
    
  }
  

  private initializePage(): void {

    this.setPageStatus('LOADING');

    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    const sectionIdentification = this.stores.innovation.getInnovationRecordSectionIdentification(this.sectionId);
    this.sectionSubmittedText =  sectionIdentification ? `You have submitted section ${sectionIdentification?.group.number}.${sectionIdentification?.section.number} '${sectionIdentification?.section.title}'` : '';
        
    this.setPageTitle(this.translate(sectionIdentification!.section.title), { hint: sectionIdentification ? `${sectionIdentification.group.number}. ${sectionIdentification.group.title}` : '' });
    this.setBackLink('Innovation Record', `${this.baseUrl}/record`);
    
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
      
      this.getPreviousAndNextPagination();

      this.documentsList = documents?.data ?? [];

      this.setPageStatus('READY');
    })


  }

  private getPreviousAndNextPagination(): void {

    const currentSectionIndex = this.sectionsIdsList.indexOf(this.sectionId);
    const previousSectionId = this.sectionsIdsList[currentSectionIndex - 1] || null;
    const nextSectionId = this.sectionsIdsList[currentSectionIndex + 1] || null;

    if (previousSectionId) {
      const previousSection = this.stores.innovation.getInnovationRecordSectionIdentification(previousSectionId);
      this.previousSection = { id: previousSectionId, title: previousSection ? `${previousSection.group.number}.${previousSection.section.number} ${previousSection.section.title}` : '' };
    } else {
      this.previousSection = null;
    }

    if (nextSectionId) {
      const nextSection = this.stores.innovation.getInnovationRecordSectionIdentification(nextSectionId);
      this.nextSection = { id: nextSectionId, title: nextSection ? `${nextSection.group.number}.${nextSection.section.number} ${nextSection.section.title}` : '' };
    } else {
      this.nextSection = null;
    }

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

  private getNextSectionId(): string | null {

    const currentSectionIndex = this.sectionsIdsList.indexOf(this.sectionInfo.id);

    return this.sectionsIdsList[currentSectionIndex + 1] || null;

  }

  getSectionSummaryData(): SectionSummaryInputData {
    return { 
      sectionInfo: this.sectionInfo, 
      summaryList: this.summaryList, 
      evidencesList: this.evidencesList, 
      documentsList: this.documentsList 
    }
  }
}
