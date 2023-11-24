import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CoreComponent } from "@app/base";
import { InnovationStatisticsEnum } from "@modules/shared/services/statistics.enum";
import { StatisticsService } from "@modules/shared/services/statistics.service";
import { ContextInnovationType } from "@modules/stores";
import { InnovationSectionEnum, InnovationStatusEnum } from "@modules/stores/innovation";
import { INNOVATION_SECTIONS } from "@modules/stores/innovation/innovation-record/202304/main.config";
import { InnovationSectionsListType } from "@modules/stores/innovation/innovation-record/ir-versions.types";
import { SectionsSummaryModel } from "@modules/stores/innovation/innovation.models";
import { forkJoin } from "rxjs";

type ProgressBarType = '1:active' | '2:warning' | '3:inactive';

@Component({
    selector: 'shared-pages-innovation-all-sections-info',
    templateUrl: './section-info-all.component.html'
  })
  export class PageInnovationAllSectionsInfoComponent extends CoreComponent implements OnInit{
    
    innovationsSectionsList: InnovationSectionsListType = INNOVATION_SECTIONS

    innovationId: string;

    baseUrl: string;
    documentUrl: string;
    pdfDocumentUrl: string;

    innovation: ContextInnovationType;
    pendingExportRequests = 0;
    innovationSections: SectionsSummaryModel = [];
    sections: { progressBar: ProgressBarType[], submitted: number, draft: number, notStarted: number, withOpenTasksCount: number, openTasksCount: number } = { progressBar: [], submitted: 0, draft: 0, notStarted: 0,  withOpenTasksCount: 0, openTasksCount: 0};

    // Flags.
    isInnovatorType: boolean;
    isAccessorType: boolean;
    isAssessmentType: boolean;
    
    isInnovationInCreatedStatus: boolean;
    showSupportingTeamsShareRequestSection: boolean;
    showInnovatorShareRequestSection: boolean;

    allSectionsSubmitted = false;

    constructor(
      private activatedRoute: ActivatedRoute,
      private statisticsService: StatisticsService
    ){
      super()
      this.innovation = this.stores.context.getInnovation();

      this.innovationId = this.activatedRoute.snapshot.params.innovationId;

      this.baseUrl = `/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}`;
      this.documentUrl = `${this.CONSTANTS.APP_ASSETS_URL}/NHS-innovation-service-record.docx`;
      this.pdfDocumentUrl = `${this.CONSTANTS.APP_URL}/exports/${this.innovationId}/pdf?role=${this.stores.authentication.getUserContextInfo()?.roleId}`;
      
      // Flags
      this.isInnovatorType = this.stores.authentication.isInnovatorType();
      this.isAccessorType = this.stores.authentication.isAccessorType();
      this.isAssessmentType = this.stores.authentication.isAssessmentType();
      this.isInnovationInCreatedStatus = this.innovation.status === InnovationStatusEnum.CREATED;
      this.showSupportingTeamsShareRequestSection = this.stores.authentication.isAccessorType() || this.stores.authentication.isAssessmentType();
      this.showInnovatorShareRequestSection = this.stores.authentication.isInnovatorType() && !this.isInnovationInCreatedStatus;
      
    }

    ngOnInit(): void {
        
      this.setPageStatus('LOADING');

      this.setBackLink('Innovation Record', `${this.baseUrl}/record`);
      this.setPageTitle('All sections questions and answers', { hint: 'Innovation record'});

      
      forkJoin([
        this.stores.innovation.getSectionsSummary$(this.activatedRoute.snapshot.params.innovationId),
        ... this.isInnovatorType ? [this.statisticsService.getInnovationStatisticsInfo(this.innovationId, { statistics: [InnovationStatisticsEnum.PENDING_EXPORT_REQUESTS_COUNTER] })] : [],
      ]).subscribe({
        next: ([response, statistics]) => {
  
          this.innovationSections = response;
          this.pendingExportRequests = this.isInnovatorType ? statistics.PENDING_EXPORT_REQUESTS_COUNTER.count : 0;
  
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
          this.sections.withOpenTasksCount = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.openTasksCount > 0).length, 0);
          this.sections.openTasksCount = this.innovationSections.reduce((acc: number, item) => acc + item.sections.reduce((acc: number, section) => acc + section.openTasksCount, 0), 0);
  
          this.allSectionsSubmitted = this.sections.submitted === this.sections.progressBar.length;
  
          this.setPageStatus('READY');
          console.log(this.sections.progressBar)
        },
        error: () => {
          this.setPageStatus('ERROR');
          this.setAlertUnknownError();
        }
  
      });
    }
  }