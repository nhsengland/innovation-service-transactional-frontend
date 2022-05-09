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
    id: string,
    name: string,
    touType: string,
    summary: string,
    releasedAt?: string,
    createdAt: string
  }>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: ServiceUsersService
  ) {

    super();
    this.setPageTitle('Terms of use');

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'versionCreationSuccess':
        this.alert = { type: 'SUCCESS', title: 'You\'ve successfully created new version.' };
        break;
      case 'versionUpdatedSuccess':
        this.alert = { type: 'SUCCESS', title: 'You\'ve successfully updated  version.' };
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
        this.terms.setData(response.data, response.count);
        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch organisations information',
          message: 'Please try again or contact us for further help'
        };
      }
    );
  }

  onPageChange(event: { pageNumber: number }): void {
    this.terms.setPage(event.pageNumber);
    this.getTerms();
  }

}
