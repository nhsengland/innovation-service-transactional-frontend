import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';
import { response } from 'express';


@Component({
  selector: 'app-admin-pages-terms-of-use-list',
  templateUrl: './terms-of-use-list.html'
})
export class PageAdminTermsOfUseListComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };
  terms: {
    name: string,
    createdAt: string,
    updatedAt: string
  }[] = [];

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
  }

  ngOnInit(): void {
    this.userService.getListOfTerms().subscribe(
      (response) => { 
        this.terms = response 
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

}
