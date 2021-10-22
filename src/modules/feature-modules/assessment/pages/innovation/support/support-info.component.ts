import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import { RoutingHelper } from '@modules/core';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';

// import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';
import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';

@Component({
  selector: 'app-assessment-pages-innovation-support-info',
  templateUrl: './support-info.component.html'
})
export class InnovationSupportInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: InnovationDataResolverType;

  alert: AlertType = { type: null };

  innovationSupport: {
    organisationUnit: string;
    accessors: string;
    status: string;
  } = { organisationUnit: '', accessors: '', status: '' };

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  // isQualifyingAccessorRole = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService
  ) {

    super();
    this.setPageTitle('Support status');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;

    // this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

  }


  ngOnInit(): void {

    this.innovationSupport.organisationUnit = this.stores.authentication.getAccessorOrganisationUnitName();

    if (!this.innovation.support?.id) {

      this.setPageStatus('READY');

    } else {
      this.assessmentService.getInnovationSupportInfo(this.innovationId, this.innovation.support.id).subscribe(
        response => {

          this.innovationSupport.accessors = (response.accessors).map(item => item.name).join(', ');
          this.innovationSupport.status = response.status;

          this.setPageStatus('READY');

        },
        () => {
          this.setPageStatus('ERROR');
          this.alert = {
            type: 'ERROR',
            title: 'Unable to fetch support information',
            message: 'Please try again or contact us for further help'
          };
        }
      );
    }

  }

}
