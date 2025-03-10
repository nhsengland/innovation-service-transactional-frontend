import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

import {
  EvidenceV3Type,
  WizardSummaryV3Type
} from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';
import { InnovationDocumentsListOutDTO } from '@modules/shared/services/innovation-documents.service';
import { InnovationSectionStatusEnum } from '@modules/stores';
import { SectionInfoType } from './section-info.component';

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
    status: { id: InnovationSectionStatusEnum; label: string };
  };
  summaryList: WizardSummaryV3Type[] = [];
  evidencesList: EvidenceV3Type[] = [];
  documentsList: InnovationDocumentsListOutDTO['data'] = [];

  allSteps: SectionStepsList = [];

  sectionSubmittedText = '';

  baseUrl: string;
  isSectionDetailsPage: string | undefined;

  innovation: ContextInnovationType;

  displayChangeButtonList: number[] = [];

  search?: string;

  isInnovationInCreatedStatus = false;

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.search = this.activatedRoute.snapshot.queryParams.search;

    this.innovation = this.ctx.innovation.info();
    this.isInnovationInCreatedStatus = this.innovation.status === 'CREATED';

    this.sectionInfo = {
      id: '',
      openTasksCount: 0,
      status: { id: InnovationSectionStatusEnum.NOT_STARTED, label: '' }
    };

    this.baseUrl = `${this.ctx.user.userUrlBasePath()}/innovations/${this.innovation.id}`;
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

    this.allSteps = this.ctx.schema.getIrSchemaSectionAllStepsList(this.sectionInfo.id);

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
