import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { AssessmentService, getInnovationInfoEndpointDTO } from '../../../services/assessment.service';

import { categoriesItems } from '@modules/stores/innovation/sections/catalogs.config';
import { NotificationContextTypeEnum } from '@modules/stores/environment/environment.enums';


@Component({
  selector: 'app-assessment-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: getInnovationInfoEndpointDTO | undefined;

  innovationSummary: { label: string; value: null | string; }[] = [];
  innovatorSummary: { label: string; value: string; }[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService
  ) {

    super();
    this.setPageTitle('Overview');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

  }


  ngOnInit(): void {
    this.assessmentService.getInnovationInfo(this.innovationId).subscribe(
      response => {

        this.innovation = response;

        this.innovationSummary = [
          { label: 'Company', value: response.summary.company },
          { label: 'Company size', value: response.summary.companySize },
          { label: 'Location', value: `${response.summary.countryName}${response.summary.postCode ? ', ' + response.summary.postCode : ''}` },
          { label: 'Description', value: response.summary.description },
          { label: 'Categories', value: response.summary.categories.map(v => v === 'OTHER' ? response.summary.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label).join('\n') }
        ];

        this.innovatorSummary = [
          { label: 'Name', value: response.contact.name },
          { label: 'Email address', value: response.contact.email },
          { label: 'Phone number', value: response.contact.phone || '' }
        ];

        this.stores.environment.dismissNotification(NotificationContextTypeEnum.INNOVATION, this.innovationId);

        this.setPageStatus('READY');

      },
      error => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch information',
          message: 'Please try again or contact us for further help'
        };
      }
    );

  }

}
