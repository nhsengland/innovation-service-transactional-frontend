import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


@Component({
  selector: 'app-admin-pages-terms-of-use-terms-of-use-list',
  templateUrl: './terms-of-use-list.component.html'
})
export class PageTermsOfUseListComponent extends CoreComponent implements OnInit {

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
        this.setAlertSuccess('You\'ve successfully created new version.');
        break;
      case 'versionUpdatedSuccess':
        this.setAlertSuccess('You\'ve successfully updated version.');
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
    this.userService.getListOfTerms(this.terms.getAPIQueryParams()).subscribe({
      next: (response) => {
        this.terms.setData(response.data, response.count);
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertError('Unable to fetch terms of use', { message: 'Please try again or contact us for further help'})
      }
    });
  }

  onPageChange(event: { pageNumber: number }): void {
    this.terms.setPage(event.pageNumber);
    this.getTerms();
  }

}
