import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { AssessmentService, getInnovationInfoEndpointDTO } from '../../../services/assessment.service';

import { categoriesItems } from '@stores-module/innovation/sections/catalogs.config';


@Component({
  selector: 'app-assessment-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: getInnovationInfoEndpointDTO | undefined;

  innovationSummary: { label: string; value: string; }[] = [];
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
          { label: 'Location', value: `${response.summary.countryName}${response.summary.postCode ? ', ' + response.summary.postCode : ''}` },
          { label: 'Description', value: response.summary.description },
          { label: 'Categories', value: response.summary.categories.map(v => v === 'OTHER' ? response.summary.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label).join('<br />') }
        ];

        this.innovatorSummary = [
          { label: 'Name', value: response.contact.name },
          { label: 'Email address', value: response.contact.email },
          { label: 'Phone number', value: response.contact.phone || '' }
        ];

      },
      error => {
        this.logger.error(error);
      }
    );

  }

}
