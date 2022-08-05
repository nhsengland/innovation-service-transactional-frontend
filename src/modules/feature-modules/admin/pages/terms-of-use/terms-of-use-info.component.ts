import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


@Component({
  selector: 'app-admin-pages-terms-of-use-terms-of-use-info',
  templateUrl: './terms-of-use-info.component.html'
})
export class PageTermsOfUseInfoComponent extends CoreComponent implements OnInit {

  id: string;
  tou: {
    summary: string,
    name: string
  } = { summary: '', name: '' };

  constructor(
    private userService: ServiceUsersService,
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.id = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.userService.getTermsById(this.id).subscribe(
      response => {
        this.tou = {
          summary: response.summary,
          name: response.name
        };
        this.setPageTitle(this.tou.name);
        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch the necessary information',
          message: 'Please try again or contact us for further help'
        };
      }
    );
  }

}
