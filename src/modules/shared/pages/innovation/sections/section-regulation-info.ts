import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { IrV3TranslatePipe } from '@modules/shared/pipes/ir-v3-translate.pipe';
import {
  InnovationDocumentsListOutDTO,
  InnovationDocumentsService
} from '@modules/shared/services/innovation-documents.service';
import { ContextInnovationType, UserRoleEnum } from '@modules/stores';

@Component({
  selector: 'shared-pages-innovation-section-regulation-info',
  templateUrl: 'section-regulation-info.html'
})
export class PageInnovationSectionRegulationInfoComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  sectionId: string;
  regulationId: string;

  baseUrl: string;

  regulationsDocumentsList: InnovationDocumentsListOutDTO['data'] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService,
    private irv3translate: IrV3TranslatePipe
  ) {
    super();

    this.innovation = this.ctx.innovation.info();

    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.regulationId = this.activatedRoute.snapshot.params.regulationId;

    this.baseUrl = `/innovator/innovations/${this.innovation.id}`;
  }

  ngOnInit(): void {
    console.log('regulationId', this.activatedRoute.snapshot.paramMap.get('regulationId'));

    this.innovationDocumentsService
      .getDocumentList(this.innovation.id, {
        skip: 0,
        take: 100,
        order: { createdAt: 'ASC' },
        filters: {
          contextTypes: ['INNOVATION_REGULATIONS'],
          contextId: this.regulationId,
          fields: ['description']
        }
      })
      .subscribe(documents => {
        this.regulationsDocumentsList = documents.data;

        this.regulationsDocumentsList = [
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
          }
        ];

        this.setPageTitle(`Documents for ${this.irv3translate.transform(this.regulationId, 'items', 'standards')}`, {
          width: 'full'
        });

        this.setBackLink('Go back');
        this.setPageStatus('READY');
      });
  }
}
