import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
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

  innovationSupport: {
    organisationUnit: string;
    accessors: string;
  } = { organisationUnit: '', accessors: '' };

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  summaryAlert: { type: '' | 'error' | 'warning' | 'success', title: string, message: string };

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;

    this.summaryAlert = { type: '', title: '', message: '' };

  }


  ngOnInit(): void {

    const queryResult = this.activatedRoute.snapshot.queryParams.result;

    if (queryResult) {

      this.summaryAlert = {
        type: 'success',
        title: 'Support status updated',
        message: 'You\'ve updated your support status and posted a comment to the innovator.'
      };
    }

    if (this.innovation.support.id) {

      this.accessorService.getInnovationSupportInfo(this.innovationId, this.innovation.support.id).subscribe(
        response => {

          this.innovationSupport = {
            organisationUnit: this.stores.authentication.getAccessorOrganisationUnitName(),
            accessors: (response.accessors || []).map(item => item.name).join(', ')
          };

        },
        error => {
          this.logger.error(error);
        }
      );

    }
  }

}
