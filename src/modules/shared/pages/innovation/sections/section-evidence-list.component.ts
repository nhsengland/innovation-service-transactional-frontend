import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { AlertOptions } from '@app/base/core.component';
import { UtilsHelper } from '@app/base/helpers';
import { InnovationService } from '@modules/core/services/innovation.service';
import {
  InnovationDocumentsListOutDTO,
  InnovationDocumentsService
} from '@modules/shared/services/innovation-documents.service';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { ContextInnovationType } from '@modules/stores';
import { DocumentInfoType, GetInnovationEvidenceDTO } from '@modules/stores/ctx/innovation/innovation.models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'shared-pages-innovation-section-evidence-list',
  templateUrl: './section-evidence-list.component.html'
})
export class PageInnovationSectionEvidenceListComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  documentsList: InnovationDocumentsListOutDTO['data'] = [];
  evidenceList: GetInnovationEvidenceDTO[] = [];

  saveButton = { isActive: true, label: 'Save and continue' };

  baseUrl: string;

  hasEvidenceAndDocuments: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovation = this.ctx.innovation.info();
    this.baseUrl = `${this.ctx.user.userUrlBasePath()}/innovations/${this.innovation.id}`;
  }

  ngOnInit(): void {
    console.log('this.baseUrl', this.baseUrl);
    forkJoin([
      this.ctx.innovation.getSectionInfo$(this.innovation.id, 'EVIDENCE_OF_EFFECTIVENESS'),
      this.innovationsService.getSectionEvidenceList(this.innovation.id),
      this.innovationDocumentsService.getDocumentList(this.innovation.id, {
        skip: 0,
        take: 50,
        order: { createdAt: 'ASC' },
        filters: {
          contextTypes: ['INNOVATION_EVIDENCE'],
          fields: ['description']
        }
      })
    ]).subscribe(([sectionInfo, evidenceList, documentsList]) => {
      // force redirect if not allowed here
      if (sectionInfo.data.hasEvidence !== 'YES') {
        this.redirectTo(`${this.baseUrl}/record/sections/EVIDENCE_OF_EFFECTIVENESS/`);
      }

      this.documentsList = documentsList.data;

      //map evidence files to evidence list
      this.evidenceList = evidenceList.map(evidence => {
        const files: DocumentInfoType[] = documentsList.data
          .filter(d => d.context.id === evidence.id)
          .map(d => ({ id: d.file.id, displayFileName: d.file.name, size: d.file.size, url: d.file.url }));
        return { ...evidence, files: files };
      });

      // this.hasEvidenceAndDocuments = UtilsHelper.allEvidenceHaveDocuments(evidenceList);

      this.setPageTitle('Supporting documents', { hint: '', width: '2.thirds' });

      console.log('evidenceList', evidenceList);

      if (this.evidenceList.length === 0) {
        this.setAlertError('You must add a supporting document for this evidence.', {
          itemsList: [
            {
              title: 'Add evidence',
              callback: `${this.baseUrl}/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/new/1`
            }
          ]
        });
      }

      if (this.evidenceList.length > 0 && !this.hasEvidenceAndDocuments) {
        const incompleteEvidenceList = this.evidenceList.filter(e => !e.files.length);

        const itemsList = incompleteEvidenceList.map(i => ({
          title: i.evidenceSubmitType ?? i.description ?? '',
          callback: `${this.baseUrl}/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/${i.id}`
        }));

        this.setAlertError('You must add a supporting document for this evidence.', {
          itemsList: itemsList
        });
      }

      this.setPageStatus('READY');
    });
  }
}
