import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

import { WizardSummaryType } from '@modules/shared/forms';
import { InnovationDocumentsListOutDTO } from '@modules/shared/services/innovation-documents.service';
import { INNOVATION_SECTION_STATUS } from '@modules/stores/innovation';
import { stepsLabels } from '@modules/stores/innovation/innovation-record/202304/section-2-2-evidences.config';
import { SectionInfoType } from './section-info.component';
import { WizardSummaryV3Type } from '@modules/shared/forms/engine/models/wizard-irv3-engine.model';
import { getSectionAllStepsList } from '@modules/stores/innovation/innovation-record/202405/ir-v3.helpers';

export type SectionSummaryInputData = {
  sectionInfo: SectionInfoType;
  summaryList: WizardSummaryV3Type[];
  evidencesList: WizardSummaryV3Type[];
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
  evidencesList: WizardSummaryV3Type[] = [];
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

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovation = this.stores.context.getInnovation();

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
      if (!item.value && !item.isNotMandatory) {
        break;
      }
    }

    this.allSteps = getSectionAllStepsList(this.sectionInfo.id);

    // add conditional questions regarding evidences for 2.2
    if (this.sectionInfo.id === 'EVIDENCE_OF_EFFECTIVENESS') {
      const evidencesToAdd: SectionStepsList = [];
      this.allSteps.push(...Object.values(stepsLabels));
    }
    // add conditional questions special cases regarding 4.1
    if (this.sectionInfo.id === 'TESTING_WITH_USERS') {
      const questionToAdd = { label: 'Describe the testing and feedback for each testing', conditional: true };
      this.allSteps.splice(4, 0, questionToAdd);
    }
    // add conditional questions special cases regarding 5.1
    if (this.sectionInfo.id === 'REGULATIONS_AND_STANDARDS') {
      const questionToAdd = { label: 'Do you have a certification for each standard?', conditional: true };
      this.allSteps.splice(2, 0, questionToAdd);
    }
    // add conditional questions special cases regarding 5.2
    if (this.sectionInfo.id === 'INTELLECTUAL_PROPERTY') {
      const questionToAdd = { label: 'Patent number(s)', conditional: true };
      this.allSteps.splice(1, 0, questionToAdd);
    }

    this.setPageStatus('READY');
  }

  onClickChange(editStepNumber: number): void {
    this.router.navigateByUrl(`${this.baseUrl}/record/sections/${this.sectionInfo.id}/edit/${editStepNumber}`);
  }

  onStartSection(sectionId: string): void {
    this.router.navigateByUrl(`${this.baseUrl}/record/sections/${sectionId}/edit`);
  }
}
