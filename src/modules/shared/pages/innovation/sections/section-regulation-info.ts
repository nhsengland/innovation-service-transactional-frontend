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

        this.setPageTitle(`Documents for ${this.irv3translate.transform(this.regulationId, 'items', 'standards')}`, {
          width: 'full'
        });

        this.setBackLink('Go back');
        this.setPageStatus('READY');
      });
  }
}
