import { Component, Input, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { WizardSummaryV3Type } from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';
import { InnovationDocumentsListOutDTO } from '@modules/shared/services/innovation-documents.service';
import { UserRoleEnum } from '@modules/stores';
import { InnovationSectionInfoDTO } from '@modules/stores/ctx/innovation/innovation.models';

export type RegulationsSectionAnswersType = {
  standards: { type: string; hasMet?: string }[];
};

@Component({
  selector: 'shared-innovation-regulations-docs-table',
  templateUrl: './section-regulations-documents-table.component.html'
})
export class InnovationRegulationsDocumentsTableComponent extends CoreComponent implements OnInit {
  @Input({ required: true }) sectionInfo?: InnovationSectionInfoDTO['data'];
  @Input({ required: true }) sectionRegulationsDocuments?: InnovationDocumentsListOutDTO['data'];

  selectedRegulations: string[] = [];

  regulationsDocuments: Record<string, InnovationDocumentsListOutDTO['data']> = {};

  constructor() {
    super();
    // console.log('constructor');
  }
  ngOnInit(): void {
    console.log('***************************'),
      console.log('sectionInfo', this.sectionInfo),
      console.log('sectionRegulationsDocuments', this.sectionRegulationsDocuments),
      console.log('***************************'),
      (this.sectionRegulationsDocuments = [
        {
          id: '70F3423E-F36B-1410-81DC-00126D93E71E',
          context: {
            id: 'CE_UKCA_CLASS_I',
            type: 'INNOVATION_EVIDENCE',
            name: 'Evidence of clinical or care outcomes',
            label: 'Innovation evidence',
            description: 'Evidence of clinical or care outcomes'
          },
          name: 'sdas',
          description: 'asdasd',
          createdAt: '2026-03-23T18:08:22.826Z',
          createdBy: {
            name: 'Pablo',
            role: UserRoleEnum.INNOVATOR,
            isOwner: true,
            description: 'Pablo, Innovator (Owner)'
          },
          file: {
            id: '2f6b2644-0ba5-4915-983d-1f70e9274dd8.xlsx',
            name: 'test.xlsx',
            size: 6193,
            extension: 'xlsx',
            url: 'https://nhsenhsaacinnovdev.blob.core.windows.net/fileupload/2f6b2644-0ba5-4915-983d-1f70e9274dd8.xlsx?sv=2025-05-05&spr=https%2Chttp&st=2026-04-14T16%3A37%3A10Z&se=2026-04-14T16%3A52%3A10Z&sr=b&sp=r&sig=VEpRPVGaGV1Y5XFJmbOZLKcqq3%2BMGEwPXmEeeXwOd3U%3D&rscd=filename%3Dtest.xlsx'
          }
        },
        {
          id: '71F3423E-F36B-1410-81DC-00126D93E71E',
          context: {
            id: 'CE_UKCA_CLASS_I',
            type: 'INNOVATION_EVIDENCE',
            name: 'Evidence of clinical or care outcomes',
            label: 'Innovation evidence',
            description: 'Evidence of clinical or care outcomes'
          },
          name: 'gffghfgh',
          description: 'uyjtrhrtg',
          createdAt: '2026-03-24T19:12:03.753Z',
          createdBy: {
            name: 'Pablo',
            role: UserRoleEnum.INNOVATOR,
            isOwner: true,
            description: 'Pablo, Innovator (Owner)'
          },
          file: {
            id: '1c43f95f-96f7-413a-a867-0ec2d86cfafd.xlsx',
            name: 'test.xlsx',
            size: 6193,
            extension: 'xlsx',
            url: 'https://nhsenhsaacinnovdev.blob.core.windows.net/fileupload/1c43f95f-96f7-413a-a867-0ec2d86cfafd.xlsx?sv=2025-05-05&spr=https%2Chttp&st=2026-04-14T16%3A37%3A10Z&se=2026-04-14T16%3A52%3A10Z&sr=b&sp=r&sig=WXONDgFBRMDa%2BH5O7raLfsgmzyqM4kmBnmlql1ZDBv0%3D&rscd=filename%3Dtest.xlsx'
          }
        },
        {
          id: 'A4F3423E-F36B-1410-81DC-00126D93E71E',
          context: {
            id: 'CQC',
            type: 'INNOVATION_EVIDENCE',
            name: 'Evidence of clinical or care outcomes',
            label: 'Innovation evidence',
            description: 'Evidence of clinical or care outcomes'
          },
          name: 'asd',
          createdAt: '2026-04-02T09:14:31.753Z',
          createdBy: {
            name: 'Pablo',
            role: UserRoleEnum.INNOVATOR,
            isOwner: true,
            description: 'Pablo, Innovator (Owner)'
          },
          file: {
            id: 'b9214e70-81f7-42a4-93ef-dbbc197f5361.xlsx',
            name: 'test.xlsx',
            size: 6193,

            extension: 'xlsx',
            url: 'https://nhsenhsaacinnovdev.blob.core.windows.net/fileupload/b9214e70-81f7-42a4-93ef-dbbc197f5361.xlsx?sv=2025-05-05&spr=https%2Chttp&st=2026-04-14T16%3A37%3A10Z&se=2026-04-14T16%3A52%3A10Z&sr=b&sp=r&sig=uGiH216XBrdNZ%2BvsKnAI9WYDEWsAt65rDTBWPCkZ1sE%3D&rscd=filename%3Dtest.xlsx'
          }
        }
      ]);

    //   console.log(
    //     '(this.sectionInfo as RegulationsSectionAnswersType)',
    //     this.sectionInfo as RegulationsSectionAnswersType
    //   );
    // console.log('***************************'),
    this.selectedRegulations = (this.sectionInfo as RegulationsSectionAnswersType).standards.map(i => i.type);
    // console.log('sectionInfo', this.sectionInfo);
    // console.log('selectedRegulations', this.selectedRegulations);
    this.regulationsDocuments = this.selectedRegulations.reduce<
      Record<string, typeof this.sectionRegulationsDocuments>
    >((acc, r) => {
      acc[r] = this.sectionRegulationsDocuments!.filter(i => i.context.id === r);
      return acc;
    }, {});

    // console.log('regulationsDocuments', this.regulationsDocuments);
  }

  certificationsHasDocuments(id: string): boolean {
    return !!this.regulationsDocuments[id].length;
  }
}
