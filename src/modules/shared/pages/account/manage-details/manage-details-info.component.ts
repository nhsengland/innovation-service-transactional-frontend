import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'shared-pages-account-manage-details-info',
  templateUrl: './manage-details-info.component.html'
})
export class PageAccountManageDetailsInfoComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' | 'assessment' = '';

  summaryList: { label: string; value: string; editStepNumber?: number; }[] = [];

  summaryAlert: { type: '' | 'error' | 'warning', title: string, message: string };


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.module = this.activatedRoute.snapshot.data.module;

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'accountDetailsUpdateSuccess':
        this.summaryAlert = {
          type: 'warning',
          title: 'Your information has been saved',
          message: ''
        };
        break;
      case 'accountDetailsUpdateError':
        this.summaryAlert = {
          type: 'error',
          title: 'An error occured when creating an action',
          message: 'Please, try again or contact us for further help'
        };
        break;
      default:
        this.summaryAlert = { type: '', title: '', message: '' };
        break;
    }

  }


  ngOnInit(): void {

    const user = this.stores.authentication.getUserInfo();

    if (this.stores.authentication.isInnovatorType()) {

      this.summaryList = [
        { label: 'Name', value: user.displayName, editStepNumber: 1 },
        { label: 'Email address', value: user.email }
      ];

      if (!user.organisations[0].isShadow) {
        this.summaryList.push({ label: 'Company', value: user.organisations[0].name, editStepNumber: 2 });
        this.summaryList.push({ label: 'Company size', value: user.organisations[0].size, editStepNumber: 3 });
      }

    } else if (this.stores.authentication.isAccessorType()) {

      this.summaryList = [
        { label: 'Name', value: user.displayName, editStepNumber: 1 },
        { label: 'Email address', value: user.email },
        { label: 'Organisation', value: user.organisations[0].name },
        { label: 'Service roles', value: user.organisations.map(item => this.stores.authentication.getRoleDescription(item.role)).join('<br />') }
      ];

    } else if (this.stores.authentication.isAssessmentType()) {

      this.summaryList = [
        { label: 'Name', value: user.displayName, editStepNumber: 1 },
        { label: 'Email address', value: user.email }
      ];

    }

  }

}
