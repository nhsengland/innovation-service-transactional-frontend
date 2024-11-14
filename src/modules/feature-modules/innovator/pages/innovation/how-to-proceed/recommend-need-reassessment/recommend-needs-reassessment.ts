import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { FormFieldActionsEnum } from '../how-to-proceed.component';

@Component({
  selector: 'app-innovator-pages-recommend-needs-reassessment',
  templateUrl: './recommend-needs-reassessment.html'
})
export class PageInnovationRecommendNeedsReassessmentComponent extends CoreComponent {
  innovationId: string;
  baseUrl: string;

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.baseUrl = `/innovator/innovations/${this.innovationId}`;

    this.setPageTitle('We recommend you submit for needs reassessment', { width: '2.thirds', size: 'l' });
    this.setBackLink('Go back', this.onGoBack.bind(this));

    this.setPageStatus('READY');
  }

  handleCancel() {
    this.redirectTo(`${this.baseUrl}/overview`);
  }

  onContinue() {
    this.redirectTo(`${this.baseUrl}/how-to-proceed/needs-reassessment-send`, {
      entryPoint: 'recommendNeedsReassessment'
    });
  }

  onGoBack() {
    this.redirectTo(`${this.baseUrl}/how-to-proceed`, { action: FormFieldActionsEnum.NEED_MORE_SUPPORT_NOW });
  }
}
