import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

import { InnovationDocumentsListOutDTO } from '@modules/shared/services/innovation-documents.service';
import { INNOVATION_SECTION_STATUS } from '@modules/stores/innovation';
import { SectionInfoType } from './section-info.component';
import {
  EvidenceV3Type,
  WizardSummaryV3Type
} from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';

export type SectionSummaryInputData = {
  sectionInfo: SectionInfoType;
  summaryList: WizardSummaryV3Type[];
  evidencesList: EvidenceV3Type[];
  documentsList: InnovationDocumentsListOutDTO['data'];
};

export type SectionStepsList = {
  label: string;
  description?: string | undefined;
  conditional?: boolean | undefined;
}[];

@Component({
  selector: 'shared-innovation-summary',
  templateUrl: './section-summary.component.html'
})
export class InnovationSectionSummaryComponent extends CoreComponent implements OnInit {
  @Input({ required: true }) sectionData!: SectionSummaryInputData;
  @Input() title?: string;

  sectionInfo: Partial<SectionInfoType> & {
    id: string;
    openTasksCount: number;
    status: {
      id: keyof typeof INNOVATION_SECTION_STATUS;
      label: string;
    };
  };
  summaryList: WizardSummaryV3Type[] = [];
  evidencesList: EvidenceV3Type[] = [];
  documentsList: InnovationDocumentsListOutDTO['data'] = [];

  allSteps: SectionStepsList = [];

  sectionSubmittedText: string = '';

  baseUrl: string;
  isSectionDetailsPage: string | undefined;

  innovation: ContextInnovationType;

  displayChangeButtonList: number[] = [];

  // Flags
  isInnovatorType: boolean;
  isAccessorType: boolean;
  isAssessmentType: boolean;

  search?: string;

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.search = this.activatedRoute.snapshot.queryParams.search;

    this.innovation = this.ctx.innovation.info();

    this.sectionInfo = {
      id: '',
      openTasksCount: 0,
      status: { id: 'UNKNOWN', label: '' }
    };

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

    for (const [index, item] of this.summaryList.entries()) {
      this.displayChangeButtonList.push(index);
      if (!this.checkItemHasValue(item) && !item.isNotMandatory) {
        break;
      }
    }

    this.allSteps = this.stores.schema.getIrSchemaSectionAllStepsList(this.sectionInfo.id);

    this.setPageStatus('READY');
  }

  onClickChange(editStepNumber: number): void {
    this.router.navigateByUrl(`${this.baseUrl}/record/sections/${this.sectionInfo.id}/edit/${editStepNumber}`);
  }

  onStartSection(sectionId: string): void {
    this.router.navigateByUrl(`${this.baseUrl}/record/sections/${sectionId}/edit`);
  }

  checkItemHasValue(item: WizardSummaryV3Type): boolean {
    if (item.value) {
      return Array.isArray(item.value) && item.value.length === 0 ? false : true;
    }
    return false;
  }
}
