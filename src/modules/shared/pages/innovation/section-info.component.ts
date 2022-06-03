import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';

import { WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { ContextInnovationType } from '@modules/stores/context/context.models';

import { INNOVATION_SECTIONS } from '@modules/stores/innovation/innovation.config';

import { InnovationSectionsIds, INNOVATION_SECTION_STATUS } from '@stores-module/innovation/innovation.models';


@Component({
  selector: 'shared-pages-innovation-section-info',
  templateUrl: './section-info.component.html'
})
export class InnovationSectionInfoComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  module: '' | 'innovator' | 'accessor' = '';
  innovation: ContextInnovationType;

  section: {
    id: InnovationSectionsIds;
    nextSectionId: null | string,
    title: string;
    status: { id: keyof typeof INNOVATION_SECTION_STATUS, label: string };
    isNotStarted: boolean;
    showSubmitButton: boolean;
    hasEvidences: boolean;
    wizard: WizardEngineModel;
  };

  summaryList: WizardSummaryType[] = [];


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.setPageTitle('Section details');

    this.module = this.activatedRoute.snapshot.data.module;
    this.innovation = this.stores.context.getInnovation();

    this.section = {
      id: this.activatedRoute.snapshot.params.sectionId,
      nextSectionId: null,
      title: '',
      status: { id: 'UNKNOWN', label: '' },
      isNotStarted: false,
      showSubmitButton: false,
      hasEvidences: false,
      wizard: new WizardEngineModel({})
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
      hasEvidences: !!section?.evidences?.steps.length,
      wizard: section?.wizard || new WizardEngineModel({})
    };

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'sectionUpdateSuccess':
        this.section.nextSectionId = this.getNextSectionId();
        this.alert = { type: 'SUCCESS', title: 'Your answers have been confirmed for this section', message: this.section.nextSectionId ? 'Go to next section or return to the full innovation record' : undefined };
        break;

      case 'sectionUpdateError':
        this.alert = { type: 'ERROR', title: 'An error occurred when saving your section', message: 'Please try again or contact us for further help.' };
        break;

      case 'evidenceUpdateSuccess':
        this.alert = { type: 'SUCCESS', title: 'Your evidence has been saved', message: 'You need to submit this section for review to notify your supporting accessor(s).' };
        break;

      case 'evidenceDeleteSuccess':
        this.alert = { type: 'WARNING', title: 'Your evidence has been deleted' };
        break;

      case 'evidenceUpdateError':
      case 'evidenceDeleteError':
        this.alert = { type: 'ERROR', title: 'An error occurred when saving your evidence', message: 'Please try again or contact us for further help.' };
        break;

      default:
        this.alert = { type: null };
        break;
    }


    this.stores.innovation.getSectionInfo$(this.module, this.innovation.id, this.section.id).subscribe(
      response => {

        this.section.status = { id: response.section.status, label: INNOVATION_SECTION_STATUS[response.section.status]?.label || '' };
        this.section.isNotStarted = ['NOT_STARTED', 'UNKNOWN'].includes(this.section.status.id);
        this.section.showSubmitButton = ['DRAFT'].includes(this.section.status.id);

        if (this.module === 'accessor' && this.innovation.status === 'IN_PROGRESS' && this.section.status.id === 'DRAFT') {
          // If accessor, only view information if section is submitted.
          this.summaryList = [];
        } else {
          this.summaryList = this.section.wizard.runSummaryParsing(this.section.wizard.runInboundParsing(response.data));
        }

        this.setPageStatus('READY');

      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch innovation section information',
          message: 'Please try again or contact us for further help'
        };
      });

  }

  onSubmitSection(): void {

    this.stores.innovation.submitSections$(this.innovation.id, [this.section.id]).subscribe(
      () => {

        this.section.status = { id: 'SUBMITTED', label: 'Submitted' };
        this.section.showSubmitButton = false;
        this.section.nextSectionId = this.getNextSectionId();
        this.alert = { type: 'SUCCESS', title: 'Your answers have been confirmed for this section', message: this.section.nextSectionId ? 'Go to next section or return to the full innovation record' : undefined };

      },
      () => {

        this.alert = {
          type: 'ERROR',
          title: 'An error occurred when submitting your section',
          message: 'Please try again or contact us for further help',
          setFocus: true
        };

      }
    );

  }

}
