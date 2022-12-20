import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';

@Component({
  selector: 'app-assessment-pages-innovation-assessor',
  templateUrl: './change-assessor.component.html',
})
export class InnovationChangeAssessorComponent extends CoreComponent  implements OnInit {
  innovationId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService 
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
  }

  ngOnInit(): void {
    this.setPageTitle('Assign a new needs assessor to support this innovation');
    this.setBackLink('Go Back', `/accessor/innovations/${this.innovationId}/overview`, `Innovation Overview page`);
    this.setPageStatus('READY');
  }

}
