import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

import { WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { InnovationDocumentsListOutDTO, InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';
import { INNOVATION_SECTION_STATUS, InnovationSectionEnum, InnovationStatusEnum } from '@modules/stores/innovation';
import { getInnovationRecordConfig, innovationSectionsWithFiles } from '@modules/stores/innovation/innovation-record/ir-versions.config';


@Component({
  selector: 'shared-pages-innovation-section-info',
  templateUrl: './section-info.component.html'
})
export class PageInnovationSectionInfoComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType;

  section: {
    id: InnovationSectionEnum,
    nextSectionId: null | string,
    title: string,
    status: { id: keyof typeof INNOVATION_SECTION_STATUS, label: string },
    isNotStarted: boolean,
    submitButton: { show: boolean, label: string },
    hasEvidences: boolean,
    wizard: WizardEngineModel,
    date: string,
    submittedBy: null | { name: string, isOwner?: boolean },
    openTasksCount: number
  };

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService
  ) {

    super();

    this.innovation = this.stores.context.getInnovation();

    this.section = {
      id: this.activatedRoute.snapshot.params.sectionId,
      nextSectionId: null,
      title: '',
      status: { id: 'UNKNOWN', label: '' },
      isNotStarted: false,
      submitButton: { show: false, label: "Confirm section answers" },
      hasEvidences: false,
      wizard: new WizardEngineModel({}),
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

    this.initializePage();

    // This router subscription is needed for the button to go to the next step.
    // As is it the same component, we can't use the routerLink directive alone.
    this.subscriptions.push(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.initializePage())
    );

  }


  private getNextSectionId(): string | null {

    const currentSectionIndex = this.sectionsIdsList.indexOf(this.section.id);

    return this.sectionsIdsList[currentSectionIndex + 1] || null;

  }

  private getPreviousAndNextPagination(): void {

    const currentSectionIndex = this.sectionsIdsList.indexOf(this.section.id);
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

  private initializePage(): void {

    this.setPageStatus('LOADING');

    const sectionId = this.activatedRoute.snapshot.params.sectionId;
    const sectionIdentification = this.stores.innovation.getInnovationRecordSectionIdentification(sectionId);

    this.sectionSubmittedText =  sectionIdentification ? `You have submitted section ${sectionIdentification?.group.number}.${sectionIdentification?.section.number} '${sectionIdentification?.section.title}'.` : '';

    const section = this.stores.innovation.getInnovationRecordSection(sectionId);

    this.section.id = sectionId;
    this.section.title = section.title;
    this.section.wizard = section.wizard;
    this.shouldShowDocuments =
      this.innovation.status !== InnovationStatusEnum.CREATED ||
      (this.innovation.status === InnovationStatusEnum.CREATED && innovationSectionsWithFiles.includes(section.id));

    this.setPageTitle(this.section.title, { hint: sectionIdentification ? `${sectionIdentification.group.number}. ${sectionIdentification.group.title}` : '' });
    this.setBackLink('Innovation Record', `${this.baseUrl}/record`);

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

      this.getPreviousAndNextPagination();

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

      this.setPageStatus('READY');

    })

  }

  onSubmitSection(): void {

    this.stores.innovation.submitSections$(this.innovation.id, this.section.id).subscribe({
      next: () => {

        if (this.innovation.status === InnovationStatusEnum.CREATED || this.innovation.status === InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT) {
          this.section.status = { id: 'SUBMITTED', label: 'Submitted' };
          this.section.submitButton.show = false;
          this.section.nextSectionId = this.getNextSectionId();
          this.setAlertSuccess('Your answers have been confirmed for this section', { message: this.section.nextSectionId ? 'Go to next section or return to the full innovation record' : undefined });
        } else {
          this.setRedirectAlertSuccess(this.sectionSubmittedText);
          this.redirectTo(`/${this.baseUrl}/innovations/${this.innovation.id}/record/sections/${this.section.id}/submitted`);
        }

      },
      error: () => this.setAlertUnknownError()
    });

  }

}
