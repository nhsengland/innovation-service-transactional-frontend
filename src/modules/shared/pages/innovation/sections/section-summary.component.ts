import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

import { WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { InnovationDocumentsListOutDTO } from '@modules/shared/services/innovation-documents.service';
import { INNOVATION_SECTION_STATUS, InnovationStatusEnum } from '@modules/stores/innovation';
import { innovationSectionsWithFiles } from '@modules/stores/innovation/innovation-record/ir-versions.config';
import { InnovationSectionStepLabels, } from '@modules/stores/innovation/innovation-record/ir-versions.types';
import { SectionInfoType } from './section-info.component';


export type SectionSummaryInputData = {
  sectionInfo: SectionInfoType, 
  summaryList: WizardSummaryType[], 
  evidencesList: WizardSummaryType[], 
  documentsList: InnovationDocumentsListOutDTO['data']
}

@Component({
    selector: 'shared-innovation-summary',
    templateUrl: './section-summary.component.html'
})
export class InnovationSectionSummaryComponent extends CoreComponent implements OnInit {
  
  @Input({required: true}) sectionData!: SectionSummaryInputData;

  sectionInfo: Partial<SectionInfoType> & {
    id: string, 
    openTasksCount: number,
    status: {
      id: keyof typeof INNOVATION_SECTION_STATUS;
      label: string;
    },
  };
  summaryList: WizardSummaryType[] = []
  evidencesList: WizardSummaryType[] = []
  documentsList: InnovationDocumentsListOutDTO['data'] = [];


  sectionSubmittedText: string = '';
  
  baseUrl: string;
  isSectionDetailsPage: string | undefined;
  
  innovation: ContextInnovationType;

  // Flags
  isInnovatorType: boolean;
  isAccessorType: boolean;
  isAssessmentType: boolean;
  shouldShowDocuments = false;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {

    super();

    this.innovation = this.stores.context.getInnovation();

    this.sectionInfo = {
      id: '',
      openTasksCount: 0,
      status: { id: 'UNKNOWN', label: '' }
    }
    
    this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}`;

    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();

  }

  ngOnInit(): void {

    this.isSectionDetailsPage = this.activatedRoute.snapshot.params.sectionId;

    this.sectionInfo = this.sectionData.sectionInfo;
    this.summaryList = this.sectionData.summaryList;
    this.evidencesList = this.sectionData.evidencesList;
    this.documentsList = this.sectionData.documentsList;

    this.shouldShowDocuments =
      this.innovation.status !== InnovationStatusEnum.CREATED ||
      (this.innovation.status === InnovationStatusEnum.CREATED && innovationSectionsWithFiles.includes(this.sectionData!.sectionInfo!.id));

    this.setPageStatus('READY');

  }

}