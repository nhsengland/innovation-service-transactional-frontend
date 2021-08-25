import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import { RoutingHelper } from '@modules/core';

import { InnovationDataType } from '@modules/feature-modules/accessor/resolvers/innovation-data.resolver';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-support-info',
  templateUrl: './support-info.component.html'
})
export class InnovationSupportInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: InnovationDataType;

  alert: AlertType = { type: null };

  innovationSupport: {
    organisationUnit: string;
    accessors: string;
    status: string;
  } = { organisationUnit: '', accessors: '' , status: '' };

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

  }


  ngOnInit(): void {


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

    this.accessorService.getInnovationInfo(this.innovationId).subscribe(
      response => {
        this.innovation.support.id = response.support?.id;
        this.innovation.support.status = response.support?.status || 'UNASSIGNED';
        this.loadSupportInfo(this.innovation.support.id || '');
      }
    );
  }

  loadSupportInfo(supportId: string): void {

    this.accessorService.getInnovationSupportInfo(this.innovationId, supportId).subscribe(
      response => {
        this.innovationSupport = {
          organisationUnit: this.stores.authentication.getAccessorOrganisationUnitName(),
          accessors: (response.accessors || []).map(item => item.name).join(', '),
          status: response.status,
        };
      },
      error => {
        this.logger.error(error);
      }
    );
  }
}
