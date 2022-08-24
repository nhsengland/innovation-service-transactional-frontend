import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { INNOVATION_STATUS, SectionsSummaryModel } from '@modules/stores/innovation/innovation.models';
import { EnvironmentInnovationType } from '@modules/stores/environment/environment.types';


type ProgressBarType = '1:active' | '2:warning' | '3:inactive';


@Component({
  selector: 'shared-pages-innovation-record',
  templateUrl: './innovation-record.component.html'
})
export class PageInnovationRecordComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' | 'assessment' = '';
  baseUrl = '';
  documentUrl = '';
  pdfDocumentUrl = '';

  innovation: EnvironmentInnovationType;

  innovationId: string;
  innovationName: string;
  innovationStatus: keyof typeof INNOVATION_STATUS = '';
  innovationSections: SectionsSummaryModel[] = [];

  sections: {
    progressBar: ProgressBarType[];
    submitted: number;
    draft: number;
    notStarted: number;
  } = { progressBar: [], submitted: 0, draft: 0, notStarted: 0 };

  innovationSectionStatus = this.stores.innovation.INNOVATION_SECTION_STATUS;
  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;


  isInnovationInCreatedStatus(): boolean {
    return this.innovationStatus === 'CREATED';
  }

  isInAssessmentStatus(): boolean {
    return this.stores.innovation.isAssessmentStatus(this.innovationStatus);
  }

  allSectionsSubmitted(): boolean {
    return this.sections.submitted === this.sections.progressBar.length;
  }


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.setPageTitle('Innovation record');

    this.module = this.activatedRoute.snapshot.data.module;
    this.baseUrl = `/${this.module}/innovations/${this.activatedRoute.snapshot.params.innovationId}/record/sections`;
    this.documentUrl = `${this.CONSTANTS.APP_ASSETS_URL}/NHS-innovation-service-record.docx`;
    this.pdfDocumentUrl = `${this.CONSTANTS.APP_URL}/exports/${this.activatedRoute.snapshot.params.innovationId}/pdf`;
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovationName = '';
    this.innovation = this.stores.environment.getInnovation();
  }


  ngOnInit(): void {

    this.stores.innovation.getSectionsSummary$(this.activatedRoute.snapshot.params.innovationId).subscribe(
      response => {

        this.innovationName = response.innovation.name;
        this.innovationStatus = response.innovation.status;
        this.innovationSections = response.sections;

        this.sections.progressBar = this.innovationSections.reduce((acc: ProgressBarType[], item) => {
          return [...acc, ...item.sections.map(s => {
            switch (s.status) {
              case 'SUBMITTED': return '1:active';
              case 'DRAFT': return '2:warning';
              case 'NOT_STARTED':
              default:
                return '3:inactive';
            }
          })];
        }, []);

        this.sections.notStarted = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'NOT_STARTED').length, 0);
        this.sections.draft = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'DRAFT').length, 0);
        this.sections.submitted = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'SUBMITTED').length, 0);

        this.setPageStatus('READY');

      },
      error => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch innovation record information',
          message: 'Please try again or contact us for further help'
        };
      }
    );

  }


  onSubmitInnovation(): void {

    this.stores.innovation.submitInnovation$(this.innovationId).subscribe(
      response => {

        this.innovationStatus = response.status;

        this.alert = {
          type: 'SUCCESS',
          title: 'You have successfully submitted your record for needs assessment',
          message: 'You can expect the service team to get in touch within one week.',
          setFocus: true
        };

      },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'An error occurred when submitting your innovation',
          message: 'Please try again or contact us for further help',
          setFocus: true
        };
      }
    );

  }

}
