import { Component, Input, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { WizardSummaryV3Type } from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';
import { InnovationDocumentsListOutDTO } from '@modules/shared/services/innovation-documents.service';
import { ContextInnovationType, UserRoleEnum } from '@modules/stores';
import { InnovationSectionInfoDTO } from '@modules/stores/ctx/innovation/innovation.models';

export type RegulationsSectionAnswersType = {
  hasRegulationKnowledge?: 'YES_ALL' | 'YES_SOME' | 'NO' | 'NOT_RELEVANT';
  standards?: { type: string; hasMet?: string }[];
};

@Component({
  selector: 'shared-innovation-regulations-docs-table',
  templateUrl: './section-regulations-documents-table.component.html'
})
export class InnovationRegulationsDocumentsTableComponent extends CoreComponent implements OnInit {
  @Input({ required: true }) sectionInfo?: InnovationSectionInfoDTO['data'];
  @Input({ required: true }) sectionRegulationsDocuments?: InnovationDocumentsListOutDTO['data'];

  innovation: ContextInnovationType;
  baseUrl: string;
  selectedRegulations: string[] = [];

  regulationsDocuments: Record<string, InnovationDocumentsListOutDTO['data']> = {};

  constructor() {
    super();

    this.innovation = this.ctx.innovation.info();
    this.baseUrl = `/${this.ctx.user.userUrlBasePath()}/innovations/${this.innovation.id}`;
  }
  ngOnInit(): void {
    this.selectedRegulations = (this.sectionInfo as RegulationsSectionAnswersType).standards?.map(i => i.type) ?? [];

    const documents = this.sectionRegulationsDocuments ?? [];

    this.regulationsDocuments = this.selectedRegulations.reduce<Record<string, InnovationDocumentsListOutDTO['data']>>(
      (acc, r) => {
        acc[r] = documents.filter(i => i.context.id === r);
        return acc;
      },
      {}
    );

    // console.log('regulationsDocuments', this.regulationsDocuments);
  }

  certificationsHasDocuments(id: string): boolean {
    return !!this.regulationsDocuments[id].length;
  }
}
