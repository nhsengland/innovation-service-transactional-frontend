import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/types';
import { RoutingHelper } from '@app/base/helpers';
import { INNOVATION_SUPPORT_STATUS, InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';
import { categoriesItems } from '@modules/stores/innovation/sections/catalogs.config';
import { NotificationContextTypeEnum } from '@modules/stores/environment/environment.enums';

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

  innovationSummary: { label: string; value: null | string; }[] = [];

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
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
          { label: 'Company size', value: response.summary.companySize },
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

    this.stores.environment.dismissNotification(NotificationContextTypeEnum.INNOVATION, this.innovationId);

  }

}
