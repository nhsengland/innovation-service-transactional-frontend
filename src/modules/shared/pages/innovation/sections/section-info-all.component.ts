import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CoreComponent } from "@app/base";
import { StatisticsService } from "@modules/shared/services/statistics.service";
import { ContextInnovationType } from "@modules/stores";
import { InnovationStatusEnum } from "@modules/stores/innovation";
import { INNOVATION_SECTIONS } from "@modules/stores/innovation/innovation-record/202304/main.config";
import { InnovationSectionsListType } from "@modules/stores/innovation/innovation-record/ir-versions.types";
import { INNOVATION_SECTION_STATUS, InnovationSectionInfoDTO, SectionsSummaryModel } from "@modules/stores/innovation/innovation.models";
import { Observable, combineLatest, forkJoin, of } from "rxjs";
import { SectionInfoType } from "./section-info.component";
import { WizardEngineModel, WizardSummaryType } from "@modules/shared/forms";
import { InnovationDocumentsListOutDTO, InnovationDocumentsService } from "@modules/shared/services/innovation-documents.service";
import { innovationSectionsWithFiles } from "@modules/stores/innovation/innovation-record/ir-versions.config";
import { InnovationSections } from "@modules/stores/innovation/innovation-record/202209/catalog.types";
import { SectionSummaryInputData } from "./section-summary.component";

type ProgressBarType = '1:active' | '2:warning' | '3:inactive';

@Component({
    selector: 'shared-pages-innovation-all-sections-info',
    templateUrl: './section-info-all.component.html'
  })
  export class PageInnovationAllSectionsInfoComponent extends CoreComponent implements OnInit{
    
    innovationsSectionsList: InnovationSectionsListType = INNOVATION_SECTIONS;
    innovationsSubSectionsList: string[] = INNOVATION_SECTIONS.flatMap(el => el.sections.flatMap(section => section.id ));

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

    allSectionsData: { [k in InnovationSections as string]?: { sectionInfo?: SectionInfoType, summaryList?: WizardSummaryType[], evidencesList?: WizardSummaryType[], documentsList?: InnovationDocumentsListOutDTO['data'] } } = {};


    constructor(
      private activatedRoute: ActivatedRoute,
      private innovationDocumentsService: InnovationDocumentsService
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

    fetchSectionsData(){

      let summaryList: WizardSummaryType[];
      let evidencesList: WizardSummaryType[];
      let documentsList: InnovationDocumentsListOutDTO['data'];
      

      const reqsSectionInfo: Observable<InnovationSectionInfoDTO>[] = [];
      const reqsDocuments: Observable<InnovationDocumentsListOutDTO>[] = [];
      
      // here I populate the arrays
      this.innovationsSubSectionsList.forEach((section) => {   

        let shouldShowDocuments =
        this.innovation.status !== InnovationStatusEnum.CREATED ||
          (this.innovation.status === InnovationStatusEnum.CREATED && innovationSectionsWithFiles.includes(section));


        reqsSectionInfo.push(this.stores.innovation.getSectionInfo$(this.innovation.id, section)) ;
        !shouldShowDocuments ? of(null) : reqsDocuments.push(this.innovationDocumentsService.getDocumentList(this.innovation.id, {
          skip: 0,
          take: 50,
          order: { createdAt: 'ASC' },
          filters: { contextTypes: ['INNOVATION_SECTION'], contextId: section, fields: ['description'] }
        }));
      })

      combineLatest([forkJoin([...reqsSectionInfo]),forkJoin([...reqsDocuments])]).subscribe(
        ([sectionsResponse, documentsResponse]) =>{

          sectionsResponse.forEach((item, index) => { 

            const sectionInfo: SectionInfoType = {
              id: '',
              nextSectionId: null,
              title: '',
              status: { id: 'UNKNOWN', label: '' },
              submitButton: { show: false, label: "Confirm section answers" },
              isNotStarted: false,
              hasEvidences: false,
              wizard: new WizardEngineModel({}),
              allStepsList: {},
              date: '',
              submittedBy: null,
              openTasksCount: 0
            };
  
            const section = this.stores.innovation.getInnovationRecordSection(item.section);
            
            sectionInfo.id = section.id;
            sectionInfo.title = section.title;
            sectionInfo.wizard = section.wizard;
            sectionInfo.allStepsList = section.allStepsList ? section.allStepsList : {};
  
            sectionInfo.status = { id: item.status, label: INNOVATION_SECTION_STATUS[item.status]?.label || '' };
            sectionInfo.isNotStarted = ['NOT_STARTED', 'UNKNOWN'].includes(sectionInfo.status.id);
            sectionInfo.date = item.submittedAt;
            sectionInfo.submittedBy = item.submittedBy;
            sectionInfo.openTasksCount = item.tasksIds ? item.tasksIds.length : 0;
  
  
            if (this.stores.authentication.isAccessorType() && this.innovation.status === 'IN_PROGRESS' && sectionInfo.status.id === 'DRAFT') {
              // If accessor, only view information if section is submitted.
              summaryList = [];
            } else {
      
              // Special business rule around section 2.2.
              sectionInfo.hasEvidences = !!(section.evidences && item.data.hasEvidence && item.data.hasEvidence === 'YES');
      
              sectionInfo.wizard.setAnswers(sectionInfo.wizard.runInboundParsing(item.data)).runRules();
      
              const validInformation = sectionInfo.wizard.validateData();
      
              if (sectionInfo.status.id === 'DRAFT' && validInformation.valid) {
                sectionInfo.submitButton.show = true;
                if (this.innovation.status !== InnovationStatusEnum.CREATED && this.innovation.status !== InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT) {
                  sectionInfo.submitButton.label = "Submit updates"
                }
              }
      
              const data = sectionInfo.wizard.runSummaryParsing();
              summaryList = data.filter(item => !item.evidenceId);
              evidencesList = data.filter(item => item.evidenceId);
              documentsList = documentsResponse[index]?.data ?? [];

              this.allSectionsData[item.section] = {};
              this.allSectionsData[item.section]!.evidencesList = evidencesList;
              this.allSectionsData[item.section]!.sectionInfo = sectionInfo;
              this.allSectionsData[item.section]!.summaryList = summaryList;
              this.allSectionsData[item.section]!.documentsList = documentsList;
            }
              
          } )

          this.setPageStatus('READY')
        }
      )
      
    }

    ngOnInit(): void {
        
      this.setPageStatus('LOADING');

      this.setBackLink('Innovation Record', `${this.baseUrl}/record`);
      this.setPageTitle('All sections questions and answers', { hint: 'Innovation record'});
      this.fetchSectionsData();

    }

    getSectionSummaryData(section: string): SectionSummaryInputData {
      return { 
        sectionInfo: this.allSectionsData[section]!.sectionInfo!, 
        summaryList: this.allSectionsData[section]!.summaryList!, 
        evidencesList: this.allSectionsData[section]!.evidencesList!,
        documentsList: this.allSectionsData[section]!.documentsList! }
    }
  }