import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'app-accessor-pages-innovation-support-info',
  templateUrl: './support-info.component.html'
})
export class InnovationSupportInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: ContextInnovationType;

  innovationSupport: {
    organisationUnit: string,
    accessors: string,
    status: InnovationSupportStatusEnum
  } = { organisationUnit: '', accessors: '', status: InnovationSupportStatusEnum.UNASSIGNED };

  isQualifyingAccessorRole = false;
  hasAccess = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Support status');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = this.stores.context.getInnovation();

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
          
          this.hasAccess = response.engagingAccessors.some(i => i.id === this.stores.authentication.getUserId());

          this.setPageStatus('READY');

        }
      });

    }

  }

}
