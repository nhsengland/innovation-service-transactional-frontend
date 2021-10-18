import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import { RoutingHelper } from '@modules/core';
import { INNOVATION_SUPPORT_STATUS, InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';
import { categoriesItems } from '@stores-module/innovation/sections/catalogs.config';

import { NotificationContextType, NotificationService } from '@modules/shared/services/notification.service';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  innovationId: string;
  innovation: InnovationDataResolverType;

  isQualifyingAccessorRole = false;

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
    this.setPageTitle('Overview');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;
    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

  }


  ngOnInit(): void {

    this.accessorService.getInnovationInfo(this.innovationId).subscribe(
      response => {

        this.innovationSupport = {
          organisationUnit: this.stores.authentication.getAccessorOrganisationUnitName(),
          status: response.support?.status || 'UNASSIGNED'
        };

        this.innovationSummary = [
          { label: 'Innovator name', value: response.contact.name },
          { label: 'Company name', value: response.summary.company },
          { label: 'Location', value: `${response.summary.countryName}${response.summary.postCode ? ', ' + response.summary.postCode : ''}` },
          { label: 'Description', value: response.summary.description },
          { label: 'Categories', value: response.summary.categories.map(v => v === 'OTHER' ? response.summary.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label).join('\n') }
        ];

        this.setPageStatus('READY');

      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch innovation record information',
          message: 'Please try again or contact us for further help'
        };
      }
    );

    this.notificationService.dismissNotification(this.innovationId, NotificationContextType.INNOVATION).subscribe();
  }

}
