import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { MappedObjectType } from '@app/base/types';
import {
  InnovationDocumentsListOutDTO,
  InnovationDocumentsService
} from '@modules/shared/services/innovation-documents.service';
import { ContextInnovationType } from '@modules/stores';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-innovator-pages-innovation-regulations-list',
  templateUrl: './section-regulations-list.component.html'
})
export class InnovationRegulationsListPageComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  sectionId: string;

  sectionInfoData: MappedObjectType = {};

  regulationsDocuments: InnovationDocumentsListOutDTO['data'] = [];

  baseUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService
  ) {
    super();

    this.innovation = this.ctx.innovation.info();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    this.baseUrl = `/innovator/innovations/${this.innovation.id}/record/sections/REGULATIONS_AND_STANDARDS`;
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');

    forkJoin([
      this.ctx.innovation.getSectionInfo$(this.innovation.id, this.sectionId),
      this.innovationDocumentsService.getDocumentList(this.innovation.id, {
        skip: 0,
        take: 100,
        order: { createdAt: 'ASC' },
        filters: {
          contextTypes: ['INNOVATION_REGULATIONS'],
          fields: ['description']
        }
      })
    ]).subscribe(([sectionInfo, regulationDocumentResponse]) => {
      console.log('**section info', sectionInfo);
      this.sectionInfoData = sectionInfo.data;
      this.regulationsDocuments = regulationDocumentResponse.data;

      console.log('hasRegulationKnowledge', this.sectionInfoData.hasRegulationKnowledge);
      // Redirect to overview if user should not have access to this page
      if (
        this.sectionId !== 'REGULATIONS_AND_STANDARDS' ||
        !this.sectionInfoData.hasRegulationKnowledge ||
        (this.sectionInfoData.hasRegulationKnowledge &&
          ['NO', 'NOT_RELEVANT'].includes(this.sectionInfoData.hasRegulationKnowledge))
      ) {
        this.router.navigateByUrl(`/innovator/innovations/${this.innovation.id}/record`);
      }

      this.setPageTitle('Supporting documents', { width: '2.thirds' });
      this.setBackLink('Go back');
      this.setPageStatus('READY');
    });
  }
}
