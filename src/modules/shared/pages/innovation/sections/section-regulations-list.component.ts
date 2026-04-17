import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { UtilsHelper } from '@app/base/helpers';
import { MappedObjectType } from '@app/base/types';
import { RegulationsSectionAnswersType } from '@modules/shared/components/regulations-table/section-regulations-documents-table.component';
import {
  InnovationDocumentsListOutDTO,
  InnovationDocumentsService
} from '@modules/shared/services/innovation-documents.service';
import { ContextInnovationType } from '@modules/stores';
import { innovationsSubSections } from '@modules/stores/innovation/innovation-record/ir-versions.config';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-innovator-pages-innovation-regulations-list',
  templateUrl: './section-regulations-list.component.html'
})
export class InnovationRegulationsListPageComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  sectionId: string;

  sectionInfoData: RegulationsSectionAnswersType = { standards: [] };

  regulationsDocuments: InnovationDocumentsListOutDTO['data'] = [];

  regulationsList: string[] = [];
  allRegulationsHaveDocuments: boolean = false;

  baseUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService
  ) {
    super();

    this.innovation = this.ctx.innovation.info();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    this.baseUrl = `/${this.ctx.user.userUrlBasePath()}/innovations/${this.innovation.id}/record/sections/${innovationsSubSections.REGULATIONS_AND_STANDARDS}`;
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');

    if (!this.ctx.user.isInnovator()) {
      this.redirectTo(this.baseUrl);
      return;
    }

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
      this.sectionInfoData = sectionInfo.data as RegulationsSectionAnswersType;
      this.regulationsDocuments = regulationDocumentResponse.data;
      this.regulationsList = this.sectionInfoData.standards?.map(i => i.type) ?? [];

      this.allRegulationsHaveDocuments =
        UtilsHelper.regulationsWithoutDocuments(this.regulationsList, this.regulationsDocuments).length === 0;

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
