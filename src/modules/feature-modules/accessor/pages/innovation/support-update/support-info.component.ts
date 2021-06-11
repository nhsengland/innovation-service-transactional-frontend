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

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;

  }


  ngOnInit(): void {

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
