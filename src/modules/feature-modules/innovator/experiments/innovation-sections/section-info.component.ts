import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { ContextInnovationType } from '@modules/stores/context/context.types';

import { InnovationSectionEnum, INNOVATION_SECTION_STATUS } from '@modules/stores/innovation';
import { LocalStorageHelper } from '@app/base/helpers';
import { SECTION_2_1 } from './section-2-1.config';
import { SECTION_2_2 } from './section-2-2.config';

@Component({
  selector: 'app-innovator-experiments-innovation-section-info',
  templateUrl: './section-info.component.html'
})
export class ExperimentsInnovationSectionInfoComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' | 'assessment' | 'admin' = '';
  innovation: ContextInnovationType;
  sectionId: string;

  section: {
    id: InnovationSectionEnum;
    nextSectionId: null | string,
    title: string;
    status: { id: keyof typeof INNOVATION_SECTION_STATUS, label: string };
    isNotStarted: boolean;
    showSubmitButton: boolean;
    showSubmitUpdatesButton: boolean;
    hasEvidences: boolean;
    wizard: WizardEngineModel;
    date: string;
    submittedBy: null | {
      name: string,
      isOwner: boolean,
    },
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

    this.module = 'innovator';
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
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
    // this.subscriptions.push(
    //   this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.initializePage())
    // );

  }


  // private getNextSectionId(): string | null {

  //   const sectionsIdsList = INNOVATION_SECTIONS.flatMap(sectionsGroup => sectionsGroup.sections.map(section => section.id));
  //   const currentSectionIndex = sectionsIdsList.indexOf(this.section.id);

  //   return sectionsIdsList[currentSectionIndex + 1] || null;

  // }

  // private getPreviousAndNextPagination(): void {
  //   const sectionsIdsList = INNOVATION_SECTIONS.flatMap(sectionsGroup => sectionsGroup.sections.map(section => section.id));
  //   const currentSectionIndex = sectionsIdsList.indexOf(this.section.id);
  //   const previousSectionIndex = sectionsIdsList[currentSectionIndex - 1] || null;
  //   const nextSectionIndex = sectionsIdsList[currentSectionIndex + 1] || null;

  //   this.previousSection = {
  //     id: previousSectionIndex,
  //     title: `${getSectionNumber(previousSectionIndex)} ${this.stores.innovation.getSectionTitle(previousSectionIndex)}`,
  //     show: previousSectionIndex !== null
  //   };

  //   this.nextSection = {
  //     id: nextSectionIndex,
  //     title: `${getSectionNumber(nextSectionIndex)} ${this.stores.innovation.getSectionTitle(nextSectionIndex)}`,
  //     show: nextSectionIndex !== null
  //   };
  // }

  private initializePage(): void {

    this.setPageStatus('LOADING');

    // const section = this.stores.innovation.getSection(this.activatedRoute.snapshot.params.sectionId);
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

    switch (this.sectionId) {
      case '2_1':
        this.setPageTitle('Detailed understanding of needs and benefits', { hint: `Value proposition` });
        this.section.wizard = SECTION_2_1.wizard;
        break;

      case '2_2':
        this.setPageTitle('Evidence of impact and benefit', { hint: `Value proposition` });
        this.section.wizard = SECTION_2_2.wizard;
        break;

      default:
        this.section.wizard = new WizardEngineModel({});
        console.error('Section experiment NOT FOUND!');
        break;
    }




    if (this.module !== '') {
      this.setBackLink('Innovation Record', `${this.module}/innovations/${this.innovation.id}/record`);
    }

    // this.stores.innovation.getSectionInfo$(this.innovation.id, this.section.id).subscribe({
    // next: response => {
    this.section.status = { id: 'DRAFT', label: 'Draft' };
    this.section.isNotStarted = ['NOT_STARTED', 'UNKNOWN'].includes(this.section.status.id);
    // this.section.date = response.submittedAt;
    // this.section.submittedBy = response.submittedBy;

    // this.getPreviousAndNextPagination();

    const currentAnswers = LocalStorageHelper.getObjectItem(`experimentSection${this.sectionId}`) ?? {} as any;

    if (this.sectionId === '2_2') {
      const evidences = LocalStorageHelper.getObjectItem(`experimentSection2_2_evidence`);
      if (evidences) {
        currentAnswers['evidences'] = [{
          id: 'abc',
          evidenceType: evidences.evidenceType,
          clinicalEvidenceType: evidences.clinicalEvidenceType,
          description: evidences.description,
          summary: evidences.summary,
        }];
      }
    }

    this.section.wizard.setAnswers(this.section.wizard.runInboundParsing(currentAnswers)).runRules();

    if (this.sectionId === '2_2' && this.section.wizard.currentAnswers.hasEvidence === 'YES') {
      this.section.hasEvidences = true;
    }

    console.log(this.section.wizard.currentAnswers);

    // const validInformation = this.section.wizard.validateData();
    const nActions = 0;

    // if (this.section.status.id === 'DRAFT' && validInformation.valid) {
    //   this.section.showSubmitButton = nActions === 0;
    //   this.section.showSubmitUpdatesButton = nActions > 0;
    // }

    this.summaryList = this.section.wizard.runSummaryParsing();

    console.log(this.summaryList);

    this.setPageStatus('READY');
    //   }
    // });

  }

  onSubmitSection(): void {

    this.stores.innovation.submitSections$(this.innovation.id, this.section.id).subscribe({
      next: () => {
        this.section.status = { id: 'SUBMITTED', label: 'Submitted' };
        this.section.showSubmitButton = false;
        // this.section.nextSectionId = this.getNextSectionId();
        this.setAlertSuccess('Your answers have been confirmed for this section');
      },
      error: () => this.setAlertUnknownError()
    });

  }
}
