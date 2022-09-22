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
  tou: { summary: string, name: string } = { summary: '', name: '' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: ServiceUsersService
  ) {

    super();
    this.id = this.activatedRoute.snapshot.params['id'];

  }


  ngOnInit(): void {

    this.userService.getTermsById(this.id).subscribe({
      next: response => {

        this.tou = {
          summary: response.summary || 'This version was released without a summary of the changes',
          name: response.name
        };

        this.setPageTitle(this.tou.name);
        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertDataLoadError();
      }
    });

  }

}
