import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import { irVersionsMainCategoryItems } from '@modules/stores/innovation/innovation-record/ir-versions.config';

import { DatePipe } from '@angular/common';
import { UtilsHelper } from '@app/base/helpers';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { InnovationCollaboratorStatusEnum, InnovationGroupedStatusEnum } from '@modules/stores/innovation/innovation.enums';


@Component({
  selector: 'app-admin-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: ContextInnovationType & { organisationsStatusDescription?: string, groupedStatus?: InnovationGroupedStatusEnum };

  innovationSupport: {
    organisationUnit: string,
    status: InnovationSupportStatusEnum,
  } = { organisationUnit: '', status: InnovationSupportStatusEnum.UNASSIGNED };

  innovationSummary: { label: string; value: null | string; }[] = [];

  innovatorDetails: { label: string; value: null | string; }[] = [];

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  innovationCollaborators: {
    id: string;
    status: InnovationCollaboratorStatusEnum;
    name?: string;
    email?: string;
    role?: string;
  }[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private datePipe: DatePipe
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.context.getInnovation();

    this.setPageTitle('Overview', { hint: `Innovation ${this.innovation.name}`});
  }


  ngOnInit(): void {

    this.innovationsService.getInnovationInfo(this.innovationId).subscribe(innovation => {

      this.innovationSupport = {
        organisationUnit: this.stores.authentication.getAccessorOrganisationUnitName(),
        status: this.innovation.support?.status || InnovationSupportStatusEnum.UNASSIGNED
      };

      this.innovationSummary = [
        { label: 'Company', value: innovation.owner?.organisation?.name ?? 'No company' },
        ...innovation.owner?.organisation?.size ? [
          { label: 'Company size', value: innovation.owner?.organisation?.size ?? '' }
        ] : [],
        { label: 'Description', value: innovation.description },
        { label: 'Categories', value: innovation.categories.map(v => v === 'OTHER' ? innovation.otherCategoryDescription : irVersionsMainCategoryItems.find(item => item.value === v)?.label).join('\n') }
      ];

      this.innovatorDetails = [
        { label: 'Owner', value: innovation.owner?.name ?? '[deleted account]' },
        { label: 'Last login', value: this.datePipe.transform(innovation.owner?.lastLoginAt ?? '', this.translate('app.date_formats.long_date_time')) },
        { label: 'Contact preference', value: UtilsHelper.getContactPreferenceValue(innovation.owner?.contactByEmail, innovation.owner?.contactByPhone, innovation.owner?.contactByPhoneTimeframe) || '' },
        { label: 'Contact details', value: innovation.owner?.contactDetails || '' },
        { label: 'Email address', value: innovation.owner?.email ?? '' },
        { label: 'Phone number', value: innovation.owner?.mobilePhone ?? '' },
      ]

      const occurrences = (innovation.supports ?? []).map(item => item.status)
        .filter(status => [InnovationSupportStatusEnum.ENGAGING].includes(status))
        .reduce((acc, status) => (
          acc[status] ? ++acc[status].count : acc[status] = { count: 1, text: this.translate('shared.catalog.innovation.support_status.' + status + '.name').toLowerCase() }, acc),
          {} as { [a in InnovationSupportStatusEnum]: { count: number, text: string } });

      this.innovation.organisationsStatusDescription = Object.entries(occurrences).map(([status, item]) => `${item.count} ${item.text}`).join(', ');

      this.innovation = {
        ...this.innovation,
        groupedStatus: innovation.groupedStatus,
        organisationsStatusDescription: Object.entries(occurrences).map(([_, item]) => `${item.count} ${item.text}`).join(', ')
      }

      this.stores.context.dismissNotification(this.innovationId, {contextTypes: [NotificationContextTypeEnum.INNOVATION]}); // TODO: Verify notifications from admin

      this.setPageStatus('READY');

    });

    this.innovationsService.getInnovationCollaboratorsList(this.innovationId, ["active"])
      .subscribe((innovationCollaborators) => {
      this.innovationCollaborators = innovationCollaborators.data;
    });
  }

  getSupportStatusCount(supports: InnovationSupportStatusEnum[], status: keyof typeof InnovationSupportStatusEnum) {
    const statuses = supports.filter(cur => cur === status);
    return statuses.length;
  }

}
