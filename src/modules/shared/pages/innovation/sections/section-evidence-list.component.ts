import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { InnovationService } from '@modules/core/services/innovation.service';
import {
  InnovationDocumentsListOutDTO,
  InnovationDocumentsService
} from '@modules/shared/services/innovation-documents.service';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { ContextInnovationType } from '@modules/stores';
import { GetInnovationEvidenceDTO } from '@modules/stores/ctx/innovation/innovation.models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'shared-pages-innovation-section-evidence-list',
  templateUrl: './section-evidence-list.component.html'
})
export class PageInnovationSectionEvidenceListComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  documentsList: InnovationDocumentsListOutDTO['data'] = [];
  evidenceList: GetInnovationEvidenceDTO[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovation = this.ctx.innovation.info();
  }

  ngOnInit(): void {
    forkJoin([
      this.innovationsService.getSectionEvidenceList(this.innovation.id),
      this.innovationDocumentsService.getDocumentList(this.innovation.id, {
        skip: 0,
        take: 50,
        order: { createdAt: 'ASC' },
        filters: {
          contextTypes: ['INNOVATION_EVIDENCE'],
          // contextId: this.evidenceId,
          fields: ['description']
        }
      })
    ]).subscribe(([evidenceList, documentsList]) => {
      this.evidenceList = evidenceList;
      this.documentsList = documentsList.data;

      console.log('SERVER evidenceList: ', evidenceList);
      console.log('evidenceList: ', this.evidenceList);
      for (const evidence of evidenceList) {
        console.log('\t-id: ', evidence.id);
        console.log('\t-evidenceType: ', evidence.evidenceType);
        console.log('\t-clinicalEvidenceType: ', evidence.clinicalEvidenceType);
        console.log('\t-description: ', evidence.description);
        console.log('\t-summary: ', evidence.summary);
        console.log('\n\n');
      }
      console.log('documentsList: ', this.documentsList);

      this.setPageTitle('Supporting documents', { hint: '', width: '2.thirds' });

      this.setPageStatus('READY');
    });
  }
}
