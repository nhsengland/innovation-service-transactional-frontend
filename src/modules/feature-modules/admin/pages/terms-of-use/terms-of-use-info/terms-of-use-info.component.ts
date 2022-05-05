import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { AlertType } from '@app/base/models';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


@Component({
  selector: 'app-admin-pages-terms-of-use-info',
  templateUrl: './terms-of-use-info.component.html'
})
export class PageAdminTermsOfUseInfoComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };
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
