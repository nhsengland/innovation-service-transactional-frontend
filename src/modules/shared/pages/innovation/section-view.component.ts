import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import { WizardEngineModel, SummaryParsingType } from '@modules/shared/forms';

import { InnovationSectionsIds, INNOVATION_SECTION_STATUS } from '@stores-module/innovation/innovation.models';


@Component({
  selector: 'shared-pages-innovation-section-view',
  templateUrl: './section-view.component.html'
})
export class InnovationSectionViewComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' = '';
  innovationId: string;
  sectionId: InnovationSectionsIds;

  alert: AlertType = { type: null };

  section: {
    id: InnovationSectionsIds;
    title: string;
    status: keyof typeof INNOVATION_SECTION_STATUS;
    isNotStarted: boolean;
    showSubmitButton: boolean;
    hasEvidences: boolean;
  };

  wizard: WizardEngineModel;

  summaryList: SummaryParsingType[];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.setPageTitle('Section details');

    this.module = this.activatedRoute.snapshot.data.module;
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'sectionUpdateSuccess':
        this.alert = {
          type: 'WARNING',
          title: 'Your section has been saved',
          message: 'You need to submit this section before you can submit your Innovation Record for needs assessment.'
        };
        break;

      case 'sectionUpdateError':
        this.alert = {
          type: 'ERROR',
          title: 'An error occured when saving your section',
          message: 'Please, try again or contact us for further help'
        };
        break;

      case 'evidenceUpdateSuccess':
        this.alert = {
          type: 'WARNING',
          title: 'Your evidence has been saved',
          message: 'You need to submit this section for review to notify your supporting accessor(s)'
        };
        break;

      case 'evidenceDeleteSuccess':
        this.alert = {
          type: 'WARNING',
          title: 'Your evidence has been deleted',
          message: ''
        };
        break;

      case 'evidenceUpdateError':
      case 'evidenceDeleteError':
        this.alert = {
          type: 'ERROR',
          title: 'An error occured when saving your evidence',
          message: 'Please, try again or contact us for further help'
        };
        break;

      default:
        break;
    }


    const section = this.stores.innovation.getSection(this.sectionId);

    this.section = {
      id: this.sectionId,
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
    this.stores.innovation.getSectionInfo$(this.module, this.innovationId, this.section.id).subscribe(
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

        this.alert = {
          type: 'WARNING',
          title: 'Your section has been submitted',
          setFocus: true
        };

      },
      () => {

        this.alert = {
          type: 'ERROR',
          title: 'An error occured when submitting your section',
          message: 'Please, try again or contact us for further help',
          setFocus: true
        };

      }
    );

  }

}
