import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';
import { TableModel } from '@app/base/models';


@Component({
  selector: 'app-admin-pages-terms-of-use-list',
  templateUrl: './list-terms-of-use.component.html'
})
export class PageAdminTermsOfUseListComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };
  terms: TableModel<{
    name: string,
    createdAt: string,
    updatedAt: string
  }>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: ServiceUsersService
  ) {

    super();
    this.setPageTitle('Terms of use');

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'updateOrganisationSuccess':
        this.alert = { type: 'SUCCESS', title: 'You\'ve successfully updated the organisation.' };
        break;
      default:
        break;
    }

    this.terms = new TableModel({});
  }

  ngOnInit(): void {
    this.getTerms();
  }

  getTerms(): void {
    this.setPageStatus('LOADING');
    this.userService.getListOfTerms(this.terms.getAPIQueryParams()).subscribe(
      (response) => { 
        this.terms.setData(response, response.length);
        console.log(this.terms);
        this.setPageStatus('READY');
      },
      () => { 
        this.setPageStatus('ERROR');
        this.alert = { 
          type: 'ERROR',  
          title: 'Unable to fetch organisations information',
          message: 'Please try again or contact us for further help'
        } 
      }
    )
  }
  onPageChange(event: { pageNumber: number }): void {

    this.terms.setPage(event.pageNumber);
    // this.getInnovationsList();
    this.getTerms();
  }

}
