import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

import { WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { InnovationSectionEnum, INNOVATION_SECTION_STATUS } from '@modules/stores/innovation';


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
    showSubmitButton: boolean,
    showSubmitUpdatesButton: boolean,
    hasEvidences: boolean,
    wizard: WizardEngineModel,
    date: string,
    submittedBy: null | { name: string, isOwner: boolean }
  };

  summaryList: WizardSummaryType[] = [];
  sectionsIdsList: string[];

  previousSection: null | { id: string, title: string } = null;
  nextSection: null | { id: string, title: string } = null;


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.innovation = this.stores.context.getInnovation();

    this.section = {
      id: this.activatedRoute.snapshot.params.sectionId,
      nextSectionId: null,
      title: '',
      status: { id: 'UNKNOWN', label: '' },
      isNotStarted: false,
      showSubmitButton: false,
      showSubmitUpdatesButton: false,
      hasEvidences: false,
      wizard: new WizardEngineModel({}),
      date: '',
      submittedBy: null
    };

    this.sectionsIdsList = this.stores.innovation.getInnovationRecordConfig().flatMap(sectionsGroup => sectionsGroup.sections.map(section => section.id));

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
      this.previousSection = { id: previousSectionId, title: `${previousSection.group.number}.${previousSection.section.number} ${previousSection.section.title}` };
    } else {
      this.previousSection = null;
    }

    if (nextSectionId) {
      const nextSection = this.stores.innovation.getInnovationRecordSectionIdentification(nextSectionId);
      this.nextSection = { id: nextSectionId, title: `${nextSection.group.number}.${nextSection.section.number} ${nextSection.section.title}` };
    } else {
      this.nextSection = null;
    }

  }

  private initializePage(): void {

    this.setPageStatus('LOADING');

    const sectionId = this.activatedRoute.snapshot.params.sectionId;
    const sectionIdentification =  this.stores.innovation.getInnovationRecordSectionIdentification(sectionId);
    const section = this.stores.innovation.getInnovationRecordSection(sectionId);
    this.section = {
      id: sectionId,
      nextSectionId: null,
      title: section?.title || '',
      status: { id: 'UNKNOWN', label: '' },
      isNotStarted: false,
      showSubmitButton: false,
      showSubmitUpdatesButton: false,
      hasEvidences: !!section?.evidences?.steps.length,
      wizard: section?.wizard || new WizardEngineModel({}),
      date: '',
      submittedBy: null
    };

    this.setPageTitle(this.section.title, { hint: `${sectionIdentification.group.number}. ${sectionIdentification.group.title}` });
    this.setBackLink('Innovation Record', `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}/record`);

    this.stores.innovation.getSectionInfo$(this.innovation.id, this.section.id).subscribe({
      next: response => {
        this.section.status = { id: response.status, label: INNOVATION_SECTION_STATUS[response.status]?.label || '' };
        this.section.isNotStarted = ['NOT_STARTED', 'UNKNOWN'].includes(this.section.status.id);
        this.section.date = response.submittedAt;
        this.section.submittedBy = response.submittedBy;

        this.getPreviousAndNextPagination();

        if (this.stores.authentication.isAccessorType() && this.innovation.status === 'IN_PROGRESS' && this.section.status.id === 'DRAFT') {
          // If accessor, only view information if section is submitted.
          this.summaryList = [];
        } else {

          this.section.wizard.setAnswers(this.section.wizard.runInboundParsing(response.data)).runRules();

          const validInformation = this.section.wizard.validateData();
          const nActions = response.actionsIds?.length ?? 0;

          if (this.section.status.id === 'DRAFT' && validInformation.valid) {
            this.section.showSubmitButton = nActions === 0;
            this.section.showSubmitUpdatesButton = nActions > 0;
          }

          this.summaryList = this.section.wizard.runSummaryParsing();

        }

        this.setPageStatus('READY');

      }
    });

  }

  onSubmitSection(): void {

    this.stores.innovation.submitSections$(this.innovation.id, this.section.id).subscribe({
      next: () => {
        this.section.status = { id: 'SUBMITTED', label: 'Submitted' };
        this.section.showSubmitButton = false;
        this.section.nextSectionId = this.getNextSectionId();
        this.setAlertSuccess('Your answers have been confirmed for this section', { message: this.section.nextSectionId ? 'Go to next section or return to the full innovation record' : undefined });
      },
      error: () => this.setAlertUnknownError()
    });

  }

}
