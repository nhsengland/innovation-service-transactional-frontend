import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { SUPPORT_SUMMARY_MILESTONES } from '../innovation/support/wizard-support-summary-progress-update-milestones/constants';

@Component({
  selector: 'shared-pages-progress-categories-wrapper',
  templateUrl: './progress-categories-wrapper.component.html'
})
export class PageProgressCategoriesWrapperComponent extends CoreComponent implements OnInit {
  organisationId: string;

  milestone: {
    name: string;
    description: string;
    subcategories?: {
      name: string;
      description: string;
    }[];
  }[] = [];

  milestoneType?: 'ONE_LEVEL' | 'TWO_LEVEL';

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService
  ) {
    super();

    this.organisationId = this.activatedRoute.snapshot.params.organisationId;
  }

  ngOnInit(): void {
    this.organisationsService.getOrganisationInfo(this.organisationId, { onlyActiveUsers: true }).subscribe({
      next: organisation => {
        const userOrgHasMilestones = Object.keys(SUPPORT_SUMMARY_MILESTONES).includes(organisation.acronym);

        if (!userOrgHasMilestones) {
          this.redirectTo(this.previousUrl || `/${this.ctx.user.userUrlBasePath()}/dashboard`);
        }

        this.milestoneType = SUPPORT_SUMMARY_MILESTONES[organisation.acronym].some(
          org => org.subcategories !== undefined
        )
          ? 'TWO_LEVEL'
          : 'ONE_LEVEL';

        this.milestone = SUPPORT_SUMMARY_MILESTONES[organisation.acronym];

        this.setPageTitle(`${organisation.name} progress categories`);
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }
}
