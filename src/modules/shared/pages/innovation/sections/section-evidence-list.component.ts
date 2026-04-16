import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@modules/stores';

@Component({
  selector: 'app-innovator-pages-innovation-evidences-list',
  templateUrl: './section-evidence-list.component.html'
})
export class InnovationEvidenceListComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  sectionId: string;
  baseUrl: string;

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovation = this.ctx.innovation.info();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    this.baseUrl = `/innovator/innovations/${this.innovation.id}/record/sections/EVIDENCE_OF_EFFECTIVENESS`;
  }

  ngOnInit(): void {
    // Redirect to overview if user should not have access to this page
    if (this.sectionId !== 'EVIDENCE_OF_EFFECTIVENESS') {
      this.redirectTo(`/innovator/innovations/${this.innovation.id}/record/sections`);
    }

    this.setPageTitle('Evidence', { width: '2.thirds' });
    this.setBackLink('Go back');
    this.setPageStatus('READY');
  }
}
