import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import { RoutingHelper } from '@modules/core';
import { WizardEngineModel, SummaryParsingType } from '@modules/shared/forms';

import { InnovationDataResolverType, InnovationSectionsIds, INNOVATION_SECTION_STATUS } from '@stores-module/innovation/innovation.models';


@Component({
  selector: 'shared-pages-innovation-section-view',
  templateUrl: './section-view.component.html'
})
export class InnovationSectionViewComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' = '';
  innovationId: string;
  innovation: InnovationDataResolverType;
  sectionId: InnovationSectionsIds;
  
  showNextSectionButton: boolean = false;

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
    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'sectionUpdateSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'You have confirmed your answers for this section',
          message: 'Go to next section or return to innovation record',            
        };
        this.showNextSectionButton = true;
        break;

      case 'sectionUpdateError':
        this.alert = {
          type: 'ERROR',
          title: 'An error occurred when saving your section',
          message: 'Please try again or contact us for further help.'
        };
        break;

      case 'evidenceUpdateSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'Your evidence has been saved',
          message: 'You need to submit this section for review to notify your supporting accessor(s).'
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
          title: 'An error occurred when saving your evidence',
          message: 'Please try again or contact us for further help.'
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

    this.setPageStatus('LOADING');

    this.stores.innovation.getSectionInfo$(this.module, this.innovationId, this.section.id).subscribe(
      response => {

        this.section.status = response.section.status;
        this.section.isNotStarted = ['NOT_STARTED', 'UNKNOWN'].includes(this.section.status);
        this.section.showSubmitButton = ['DRAFT'].includes(this.section.status);

        if (this.module === 'accessor' && this.innovation.status === 'IN_PROGRESS' && this.section.status === 'DRAFT') {
          // If accessor, only view information if section is submitted.
          this.summaryList = [];
        } else {
          this.summaryList = this.wizard.runSummaryParsing( this.wizard.runInboundParsing(response.data));
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


  getEditUrl(stepNumber: number): string {
    return `edit/${stepNumber}`;
  }

  nextSection(){
    
  }

  onSubmitSection(): void {

    this.stores.innovation.submitSections$(this.innovationId, [this.section.id]).subscribe(
      () => {

        this.getSectionInfo();

        this.alert = {
          type: 'SUCCESS',
          title: 'Your section has been submitted',
          setFocus: true
        };

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
