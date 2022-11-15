import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { categoriesItems } from '@modules/stores/innovation/sections/catalogs.config';
import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationInfoDTO } from '@modules/shared/services/innovations.dtos';


@Component({
  selector: 'app-assessment-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: null | InnovationInfoDTO = null;

  innovationSummary: { label: string; value: null | string; }[] = [];
  innovatorSummary: { label: string; value: string; }[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Overview');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

  }


  ngOnInit(): void {

    this.innovationsService.getInnovationInfo(this.innovationId).subscribe(response => {

      this.innovation = response;

      this.innovationSummary = [
        { label: 'Company', value: response.owner.organisations ? response.owner.organisations[0].name : '' },
        { label: 'Company size', value: response.owner.organisations ? response.owner.organisations[0].size : '' },
        { label: 'Location', value: `${response.countryName}${response.postCode ? ', ' + response.postCode : ''}` },
        { label: 'Description', value: response.description },
        { label: 'Categories', value: response.categories.map(v => v === 'OTHER' ? response.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label).join('\n') }
      ];

      this.innovatorSummary = [
        { label: 'Name', value: response.owner.name },
        { label: 'Email address', value: response.owner.email || '' },
        { label: 'Phone number', value: response.owner.mobilePhone || '' }
      ];

      this.stores.context.dismissNotification(NotificationContextTypeEnum.INNOVATION, this.innovationId);

      this.setPageStatus('READY');

    });

  }

}
