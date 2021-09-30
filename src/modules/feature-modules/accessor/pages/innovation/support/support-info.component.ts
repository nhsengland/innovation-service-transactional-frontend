import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import { RoutingHelper } from '@modules/core';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-support-info',
  templateUrl: './support-info.component.html'
})
export class InnovationSupportInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: InnovationDataResolverType;

  alert: AlertType = { type: null };

  innovationSupport: {
    organisationUnit: string;
    accessors: string;
    status: string;
  } = { organisationUnit: '', accessors: '', status: '' };

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  isQualifyingAccessorRole = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();
    this.setPageTitle('Support status');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;

    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'supportUpdateSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'Support status updated',
          message: 'You\'ve updated your support status and posted a comment to the innovator.'
        };
        break;
      case 'supportOrganisationSuggestSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'Organisation suggestions sent',
          message: 'Your suggestions were saved and notifications sent.'
        };
        break;
      default:
        break;
    }

  }


  ngOnInit(): void {

    this.innovationSupport.organisationUnit = this.stores.authentication.getAccessorOrganisationUnitName();

    if (!this.innovation.support?.id) {

      this.setPageStatus('READY');

    } else  {
      this.accessorService.getInnovationSupportInfo(this.innovationId, this.innovation.support.id).subscribe(
        response => {

          this.innovationSupport.accessors = (response.accessors).map(item => item.name).join(', ');
          this.innovationSupport.status = response.status;

          this.setPageStatus('READY');

        },
        () => {
          this.setPageStatus('ERROR');
          this.alert = {
            type: 'ERROR',
            title: 'Unable to fetch support information',
            message: 'Please try again or contact us for further help'
          };
        }
      );
    }

  }

}
