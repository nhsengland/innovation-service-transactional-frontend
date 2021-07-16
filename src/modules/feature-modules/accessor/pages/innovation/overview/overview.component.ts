import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { NotificationContextType, NotificationService } from '@modules/shared/services/notification.service';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';
import { categoriesItems } from '@stores-module/innovation/sections/catalogs.config';

import { AccessorService, getInnovationInfoEndpointDTO } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: getInnovationInfoEndpointDTO | undefined;

  innovationSupport: {
    organisationUnit: string;
    status: keyof typeof INNOVATION_SUPPORT_STATUS;
  } = { organisationUnit: '', status: 'UNASSIGNED' };

  innovationSummary: { label: string; value: string; }[] = [];

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService,
    private notificationService: NotificationService,
  ) {
    super();
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
  }


  ngOnInit(): void {

    this.accessorService.getInnovationInfo(this.innovationId).subscribe(
      response => {

        this.innovation = response;

        this.innovationSupport = {
          organisationUnit: this.stores.authentication.getAccessorOrganisationUnitName(),
          status: response.support?.status || 'UNASSIGNED'
        };

        this.innovationSummary = [
          { label: 'Innovator name', value: response.contact.name },
          { label: 'Company name', value: response.summary.company },
          { label: 'Location', value: `${response.summary.countryName}${response.summary.postCode ? ', ' + response.summary.postCode : ''}` },
          { label: 'Description', value: response.summary.description },
          { label: 'Categories', value: response.summary.categories.map(v => v === 'OTHER' ? response.summary.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label).join('<br />') }
        ];

      },
      error => {
        this.logger.error(error);
      }
    );

    this.notificationService.dismissNotification(this.innovationId, NotificationContextType.INNOVATION).subscribe();
  }

}
