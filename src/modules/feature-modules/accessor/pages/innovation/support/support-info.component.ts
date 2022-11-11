import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@app/base/helpers';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';


@Component({
  selector: 'app-accessor-pages-innovation-support-info',
  templateUrl: './support-info.component.html'
})
export class InnovationSupportInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: InnovationDataResolverType;

  innovationSupport: {
    organisationUnit: string;
    accessors: string;
    status: string;
  } = { organisationUnit: '', accessors: '', status: '' };

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  isQualifyingAccessorRole = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Support status');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = RoutingHelper.getRouteData<{ innovationData: InnovationDataResolverType }>(this.activatedRoute).innovationData;

    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

  }


  ngOnInit(): void {

    this.innovationSupport.organisationUnit = this.stores.authentication.getAccessorOrganisationUnitName();

    if (!this.innovation.support?.id) {

      this.setPageStatus('READY');

    } else {

      this.innovationsService.getInnovationSupportInfo(this.innovationId, this.innovation.support.id).subscribe({
        next: response => {

          this.innovationSupport.accessors = response.engagingAccessors.map(item => item.name).join(', ');
          this.innovationSupport.status = response.status;

          this.setPageStatus('READY');

        }
      });

    }

  }

}
