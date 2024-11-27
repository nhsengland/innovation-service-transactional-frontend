import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

import { SUPPORT_SUMMARY_MILESTONES } from './wizard-support-summary-progress-update-milestones/constants';

@Component({
  selector: 'shared-pages-innovation-support-support-summary-progress-update-wrapper',
  templateUrl: './support-summary-progress-update-wrapper.component.html'
})
export class PageInnovationSupportSummaryProgressUpdateWrapperComponent extends CoreComponent {
  userOrgHasMilestones = false;

  constructor() {
    super();

    this.userOrgHasMilestones = Object.keys(SUPPORT_SUMMARY_MILESTONES).includes(
      this.ctx.user.getUserContext()?.organisation?.acronym || ''
    );
  }
}
