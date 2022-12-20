import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import { categoriesItems } from '@modules/stores/innovation/sections/catalogs.config';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { InnovationGroupedStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { InnovationInfoDTO } from '@modules/shared/services/innovations.dtos';
import { DatePipe } from '@angular/common';


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
        { label: 'Company', value: innovation.owner.organisations ? innovation.owner.organisations[0].name : '' },
        { label: 'Location', value: `${innovation.countryName}${innovation.postCode ? ', ' + innovation.postCode : ''}` },
        { label: 'Description', value: innovation.description },
        { label: 'Categories', value: innovation.categories.map(v => v === 'OTHER' ? innovation.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label).join('\n') }
      ];

      this.innovatorDetails = [
        { label: 'Name', value: innovation.owner.name },
        { label: 'Last login', value: this.datePipe.transform(innovation.owner.lastLoginAt ?? '', this.translate('app.date_formats.long_date_time')) },
        { label: 'Email address', value: innovation.owner.email ?? '' },
        { label: 'Phone number', value: innovation.owner.mobilePhone ?? '' },
      ]

      const occurrences = (innovation.supports ?? []).map(item => item.status)
        .filter(status => [InnovationSupportStatusEnum.ENGAGING, InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED].includes(status))
        .reduce((acc, status) => (
          acc[status] ? ++acc[status].count : acc[status] = { count: 1, text: this.translate('shared.catalog.innovation.support_status.' + status + '.name').toLowerCase() }, acc),
          {} as { [a in InnovationSupportStatusEnum]: { count: number, text: string } });

      this.innovation.organisationsStatusDescription = Object.entries(occurrences).map(([status, item]) => `${item.count} ${item.text}`).join(', ');
      
      this.innovation = {
        ...this.innovation,
        groupedStatus: this.getGroupedStatus(innovation),
        organisationsStatusDescription: Object.entries(occurrences).map(([_, item]) => `${item.count} ${item.text}`).join(', ')
      }

      this.stores.context.dismissNotification(this.innovationId, {contextTypes: [NotificationContextTypeEnum.INNOVATION]}); // TODO: Verify notifications from admin

      this.setPageStatus('READY');

    });

  }

  getSupportStatusCount(supports: InnovationSupportStatusEnum[], status: keyof typeof InnovationSupportStatusEnum) {
    const statuses = supports.filter(cur => cur === status);
    return statuses.length;
  }

  private getGroupedStatus(innovation: InnovationInfoDTO) {
    return this.stores.innovation.getGroupedInnovationStatus(
      innovation.status,
      (innovation.supports ?? []).map(support => support.status),
      innovation.assessment?.reassessmentCount ?? 0
    );
  }
}
