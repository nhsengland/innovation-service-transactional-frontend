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
    status: string;
  } = { organisationUnit: '', accessors: '' , status: '' };

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

    // Is this a redirect from the update innovation support status?
    if (queryResult && queryResult === 'updated') {

      // Yes. It is.
      // Update the summary
      this.summaryAlert = {
        type: 'success',
        title: 'Support status updated',
        message: 'You\'ve updated your support status and posted a comment to the innovator.'
      };
    }
    //   // Refetch the Innovation now with a new support entry
    //   // and update the support.id and support.status information.
    //   //if (!this.innovation.support.id) {
    //     this.accessorService.getInnovationInfo(this.innovationId).subscribe(
    //       response => {
    //         this.innovation.support.id = response.support?.id;
    //         this.innovation.support.status = response.support?.status || 'UNNASSIGNED';
    //         this.loadSupportInfo(this.innovation.support.id || '');
    //       }
    //     );
    //   //}
    // }

    // // When a first time support is created, the support.id is undefined.
    // // This only runs on innovations with a support.id
    // if (this.innovation.support.id) {
    //   this.loadSupportInfo(this.innovation.support.id);
    // }


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
