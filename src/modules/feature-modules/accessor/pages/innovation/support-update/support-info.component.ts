import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';

import { AccessorService, getInnovationInfoEndpointDTO } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-support-info',
  templateUrl: './support-info.component.html'
})
export class InnovationSupportInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;

  innovation: getInnovationInfoEndpointDTO | undefined;

  innovationSupport: {
    organisationUnit: string;
    status: keyof typeof INNOVATION_SUPPORT_STATUS;
    accessors: string;
  } = { organisationUnit: '', status: 'UNNASSIGNED', accessors: '' };

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

  }


  ngOnInit(): void {

    this.accessorService.getInnovationInfo(this.innovationId).subscribe(
      response => {

        this.innovation = response;

        this.innovationSupport = {
          organisationUnit: response.support?.organisationUnit.name || '',
          status: response.support?.status || 'UNNASSIGNED',
          accessors: (response.support?.accessors || []).map(item => item.name).join(', ')
        };

      },
      error => {
        this.logger.error(error);
      }
    );

  }

}
