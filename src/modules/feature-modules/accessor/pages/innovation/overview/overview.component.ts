import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { categoriesItems } from '@modules/stores/innovation/sections/catalogs.config';
import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'app-accessor-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: ContextInnovationType;

  isQualifyingAccessorRole = false;

  innovationSupport: {
    organisationUnit: string,
    status: InnovationSupportStatusEnum,
  } = { organisationUnit: '', status: InnovationSupportStatusEnum.UNASSIGNED };

  innovationSummary: { label: string; value: null | string; }[] = [];

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Overview');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.context.getInnovation();
    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

  }


  ngOnInit(): void {

    this.innovationsService.getInnovationInfo(this.innovationId).subscribe(response => {

      this.innovationSupport = {
        organisationUnit: this.stores.authentication.getAccessorOrganisationUnitName(),
        status: this.innovation.support?.status || InnovationSupportStatusEnum.UNASSIGNED
      };
      this.innovationSummary = [
        { label: 'Innovator name', value: response.owner.name },
        { label: 'Company name', value: response.owner.organisations ? response.owner.organisations[0].name : '' },
        { label: 'Company size', value: response.owner.organisations ? response.owner.organisations[0].size : '' },
        { label: 'Location', value: `${response.countryName}${response.postCode ? ', ' + response.postCode : ''}` },
        { label: 'Description', value: response.description },
        { label: 'Categories', value: response.categories.map(v => v === 'OTHER' ? response.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label).join('\n') }
      ];

      this.stores.context.dismissNotification(NotificationContextTypeEnum.INNOVATION, this.innovationId);

      if (this.innovation.support?.id) {
        this.stores.context.dismissNotification(NotificationContextTypeEnum.SUPPORT, this.innovation.support.id);
      }

      this.setPageStatus('READY');

    });

  }

}
