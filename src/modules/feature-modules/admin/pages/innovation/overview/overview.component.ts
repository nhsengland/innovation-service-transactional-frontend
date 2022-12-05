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
  innovation: ContextInnovationType & { groupedStatus?: InnovationGroupedStatusEnum, supportStatuses?: InnovationSupportStatusEnum[] };

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

    this.innovationsService.getInnovationInfo(this.innovationId).subscribe(response => {

      this.innovationSupport = {
        organisationUnit: this.stores.authentication.getAccessorOrganisationUnitName(),
        status: this.innovation.support?.status || InnovationSupportStatusEnum.UNASSIGNED
      };

      this.innovationSummary = [
        { label: 'Company name', value: response.owner.organisations ? response.owner.organisations[0].name : '' },
        { label: 'Location', value: `${response.countryName}${response.postCode ? ', ' + response.postCode : ''}` },
        { label: 'Description', value: response.description },
        { label: 'Categories', value: response.categories.map(v => v === 'OTHER' ? response.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label).join('\n') }
      ];

      this.innovatorDetails = [
        { label: 'Innovator name', value: response.owner.name },
        { label: 'Last login', value: this.datePipe.transform(response.owner.lastLoginAt ?? '', this.translate('app.date_formats.long_date_time')) },
        { label: 'Email address', value: response.owner.email ?? '' },
        { label: 'Phone number', value: response.owner.mobilePhone ?? '' },
      ]

      this.innovation = {
        ...this.innovation,
        groupedStatus: this.getGroupedStatus(response),
        supportStatuses: (response.supports ?? []).map(support => support.status),
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
