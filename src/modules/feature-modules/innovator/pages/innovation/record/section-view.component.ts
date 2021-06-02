import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { WizardEngineModel, SummaryParsingType } from '@modules/shared/forms';

import { InnovationSectionsIds, INNOVATION_SECTION_STATUS } from '@stores-module/innovation/innovation.models';


@Component({
  selector: 'app-innovator-pages-innovation-section-view',
  templateUrl: './section-view.component.html'
})
export class InnovationSectionViewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  section: {
    id: InnovationSectionsIds;
    title: string;
    status: keyof typeof INNOVATION_SECTION_STATUS;
    isNotStarted: boolean;
    showSubmitButton: boolean;
    hasEvidences: boolean;
  };

  wizard: WizardEngineModel;

  summaryAlert: { type: '' | 'error' | 'warning', title: string, message: string };
  summaryList: SummaryParsingType[];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'sectionUpdateSuccess':
        this.summaryAlert = {
          type: 'warning',
          title: 'Your section has been saved',
          message: 'You need to submit this section for review to notify your supporting accessor(s)'
        };
        break;

      case 'sectionUpdateError':
        this.summaryAlert = {
          type: 'error',
          title: 'An error occured when saving your section',
          message: 'Please, try again or contact us for further help'
        };
        break;

      case 'evidenceUpdateSuccess':
        this.summaryAlert = {
          type: 'warning',
          title: 'Your evidence has been saved',
          message: 'You need to submit this section for review to notify your supporting accessor(s)'
        };
        break;

      case 'evidenceDeleteSuccess':
        this.summaryAlert = {
          type: 'warning',
          title: 'Your evidence has been deleted',
          message: ''
        };
        break;

      case 'evidenceUpdateError':
      case 'evidenceDeleteError':
        this.summaryAlert = {
          type: 'error',
          title: 'An error occured when saving your evidence',
          message: 'Please, try again or contact us for further help'
        };
        break;

      default:
        this.summaryAlert = { type: '', title: '', message: '' };
        break;
    }



    const section = this.stores.innovation.getSection(this.activatedRoute.snapshot.params.sectionId);
    this.section = {
      id: this.activatedRoute.snapshot.params.sectionId,
      title: section?.title || '',
      status: 'UNKNOWN',
      isNotStarted: false,
      showSubmitButton: false,
      hasEvidences: !!section?.evidences?.steps.length
    };

    this.wizard = section?.wizard || new WizardEngineModel({});

    this.summaryList = [];

  }


  ngOnInit(): void {

    this.getSectionInfo();

  }


  getSectionInfo(): void {
    this.stores.innovation.getSectionInfo$(this.innovationId, this.section.id).subscribe(
      response => {
        this.summaryList = this.wizard.runSummaryParsing(response.data);
        this.section.status = response.section.status;
        this.section.isNotStarted = ['NOT_STARTED', 'UNKNOWN'].includes(this.section.status);
        this.section.showSubmitButton = ['DRAFT'].includes(this.section.status);
      },
      () => {
        this.logger.error('Error fetching data');
      });

  }


  getEditUrl(stepNumber: number): string {
    return `edit/${stepNumber}`;
  }



  onSubmitSection(): void {

    this.stores.innovation.submitSections$(this.innovationId, [this.section.id]).subscribe(
      () => {

        this.getSectionInfo();

        this.summaryAlert = {
          type: 'warning',
          title: 'Your section has been submitted',
          message: ''
        };

      },
      () => {

        this.summaryAlert = {
          type: 'error',
          title: 'An error occured when submitting your section',
          message: 'Please, try again or contact us for further help'
        };

      }
    );

  }

}
