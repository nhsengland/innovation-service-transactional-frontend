import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-innovator-pages-recommend-needs-reassessment',
  templateUrl: './recommend-needs-reassessment.html'
})
export class PageInnovationRecommendNeedsReassessment extends CoreComponent {
  innovationId: string;
  baseUrl: string;

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.baseUrl = `/innovator/innovations/${this.innovationId}`;

    this.setPageTitle('We recommend you submit for needs reassessment');
    this.setBackLink('Go back', `${this.baseUrl}/how-to-proceed`);

    this.setPageStatus('READY');
  }

  handleCancel() {
    this.redirectTo(`${this.baseUrl}`);
  }

  onContinue() {
    this.redirectTo(`${this.baseUrl}/how-to-proceed/needs-reassessment-send`, {
      entryPoint: 'recommendNeedsReassessment'
    });
  }
}
