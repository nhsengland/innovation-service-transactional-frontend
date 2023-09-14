import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { AdminUsersService } from '@modules/feature-modules/admin/services/users.service';


@Component({
  selector: 'app-admin-pages-terms-of-use-terms-of-use-info',
  templateUrl: './terms-of-use-info.component.html'
})
export class PageTermsOfUseInfoComponent extends CoreComponent implements OnInit {

  id: string;
  tou: { summary: string, name: string } = { summary: '', name: '' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: AdminUsersService
  ) {

    super();
    this.id = this.activatedRoute.snapshot.params['id'];

    this.setBackLink('Go back', '/admin/terms-conditions');
  }


  ngOnInit(): void {

    this.usersService.getTermsById(this.id).subscribe({
      next: response => {

        this.tou = {
          summary: response.summary ?? 'This version was released without a summary of the changes',
          name: response.name
        };

        this.setPageTitle(this.tou.name);
        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

}
