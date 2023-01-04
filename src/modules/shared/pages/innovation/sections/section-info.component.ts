import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { ContextInnovationType } from '@modules/stores/context/context.types';

import { getSectionNumber, INNOVATION_SECTIONS } from '@modules/stores/innovation/innovation.config';

import { InnovationSectionEnum, INNOVATION_SECTION_STATUS } from '@modules/stores/innovation';
import { RoutingHelper } from '@app/base/helpers';

@Component({
  selector: 'shared-pages-innovation-section-info',
  templateUrl: './section-info.component.html'
})
export class PageInnovationSectionInfoComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' | 'assessment' | 'admin' = '';
  innovation: ContextInnovationType;

  section: {
    id: InnovationSectionEnum;
    nextSectionId: null | string,
    title: string;
    status: { id: keyof typeof INNOVATION_SECTION_STATUS, label: string };
    isNotStarted: boolean;
    showSubmitButton: boolean;
    actions: number;
    hasEvidences: boolean;
    wizard: WizardEngineModel;
    date: string;
  };

  summaryList: WizardSummaryType[] = [];
  previousSection: {
    id: string;
    title: string;
    show: boolean;
  };

  nextSection: {
    id: string;
    title: string;
    show: boolean;
  };

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.module = RoutingHelper.getRouteData<any>(this.activatedRoute.root).module;
    this.innovation = this.stores.context.getInnovation();
    
    this.section = {
      id: this.activatedRoute.snapshot.params.sectionId,
      nextSectionId: null,
      title: '',
      status: { id: 'UNKNOWN', label: '' },
      isNotStarted: false,
      showSubmitButton: false,
      actions: 0,
      hasEvidences: false,
      wizard: new WizardEngineModel({}),
      date: ''
    };

    this.previousSection = {
      id: '',
      title: '',
      show: false
    };
  
    this.nextSection = {
      id: '',
      title: '',
      show: false
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


  private getNextSectionId(): string | null {

    const sectionsIdsList = INNOVATION_SECTIONS.flatMap(sectionsGroup => sectionsGroup.sections.map(section => section.id));
    const currentSectionIndex = sectionsIdsList.indexOf(this.section.id);

    return sectionsIdsList[currentSectionIndex + 1] || null;

  }

  private getPreviousAndNextPagination(): void {
    const sectionsIdsList = INNOVATION_SECTIONS.flatMap(sectionsGroup => sectionsGroup.sections.map(section => section.id));
    const currentSectionIndex = sectionsIdsList.indexOf(this.section.id);
    const previousSectionIndex = sectionsIdsList[currentSectionIndex - 1] || null;
    const nextSectionIndex = sectionsIdsList[currentSectionIndex + 1] || null;

    this.previousSection = {
      id: previousSectionIndex,
      title: `${getSectionNumber(previousSectionIndex)} ${this.stores.innovation.getSectionTitle(previousSectionIndex)}`,
      show: previousSectionIndex !== null
    };

    this.nextSection = {
      id: nextSectionIndex,
      title: `${getSectionNumber(nextSectionIndex)} ${this.stores.innovation.getSectionTitle(nextSectionIndex)}`,
      show: nextSectionIndex !== null
    };
  }

  private initializePage(): void {

    this.setPageStatus('LOADING');

    const section = this.stores.innovation.getSection(this.activatedRoute.snapshot.params.sectionId);
    this.section = {
      id: this.activatedRoute.snapshot.params.sectionId,
      nextSectionId: null,
      title: section?.title || '',
      status: { id: 'UNKNOWN', label: '' },
      isNotStarted: false,
      showSubmitButton: false,
      actions: 0,
      hasEvidences: !!section?.evidences?.steps.length,
      wizard: section?.wizard || new WizardEngineModel({}),
      date: ''
    };

    this.setPageTitle(this.section.title, { hint: `${this.stores.innovation.getSectionParentNumber(this.section.id)}. ${this.stores.innovation.getSectionParentTitle(this.section.id)}`});
    
    if(this.module !== '') {
      this.setBackLink('Innovation Record', `${this.module}/innovations/${this.innovation.id}/record`);
    }
    
    this.stores.innovation.getSectionInfo$(this.innovation.id, this.section.id).subscribe({
      next: response => {
        this.section.status = { id: response.status, label: INNOVATION_SECTION_STATUS[response.status]?.label || '' };
        this.section.isNotStarted = ['NOT_STARTED', 'UNKNOWN'].includes(this.section.status.id);
        this.section.date = response.submittedAt;
      
        this.getPreviousAndNextPagination();

        if (this.module === 'accessor' && this.innovation.status === 'IN_PROGRESS' && this.section.status.id === 'DRAFT') {
          // If accessor, only view information if section is submitted.
          this.summaryList = [];
        } else {
          this.section.wizard.setAnswers(this.section.wizard.runInboundParsing(response.data)).runRules();

          const validInformation = this.section.wizard.validateData();
          this.section.showSubmitButton = response.actionsIds?.length  === 0 && validInformation.valid && ['DRAFT'].includes(this.section.status.id);
          this.section.actions = response.actionsIds?.length ?? 0;

          
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
