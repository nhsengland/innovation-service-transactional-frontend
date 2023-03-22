import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UtilsHelper } from '@app/base/helpers';


@Component({
  selector: 'shared-pages-account-manage-details-info',
  templateUrl: './manage-details-info.component.html'
})
export class PageAccountManageDetailsInfoComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' | 'assessment' = '';

  summaryList: { label: string; value: null | string; editStepNumber?: number; }[] = [];


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.setPageTitle('Your details');

    this.module = this.activatedRoute.snapshot.data.module;
  }

  ngOnInit(): void {

    const user = this.stores.authentication.getUserInfo();

    if (this.stores.authentication.isInnovatorType()) {

      this.summaryList = [
        { label: 'Name', value: user.displayName, editStepNumber: 1 },
        { label: 'Email address', value: user.email },
        { label: 'Contact preference', value: UtilsHelper.getContactPreferenceValue(user.contactByEmail, user.contactByPhone, user.contactByPhoneTimeframe), editStepNumber: 2 },
        { label: 'Phone number', value: user.phone, editStepNumber: 3 },
        { label: 'Contact details', value: user.contactDetails, editStepNumber: 4 }
      ];

      if (!user.organisations[0].isShadow) {
        this.summaryList.push({ label: 'Company', value: user.organisations[0].name, editStepNumber: 5 });
        this.summaryList.push({ label: 'Company description', value: user.organisations[0].description, editStepNumber: 6 });
        this.summaryList.push({ label: 'Company size', value: user.organisations[0].size, editStepNumber: 7 });
        this.summaryList.push({ label: 'Company UK registration number', value: user.organisations[0].registrationNumber ?? '', editStepNumber: 8 });
      }

    } else if (this.stores.authentication.isAccessorType()) {
      const userContext = this.stores.authentication.getUserContextInfo();

      this.summaryList = [
        { label: 'Name', value: user.displayName, editStepNumber: 1 },
        { label: 'Email address', value: user.email },
        { label: 'Organisation', value: userContext?.organisation?.name ?? '' },
        { label: 'Service roles', value: user.organisations.map(item => this.stores.authentication.getRoleDescription(item.role)).join('\n') }
      ];

    } else if (this.stores.authentication.isAssessmentType()) {

      this.summaryList = [
        { label: 'Name', value: user.displayName, editStepNumber: 1 },
        { label: 'Email address', value: user.email }
      ];

    } else if (this.stores.authentication.isAdminRole()) {
      this.summaryList = [
        { label: 'Name', value: user.displayName, editStepNumber: 1 },
        { label: 'Email address', value: user.email },
        { label: 'User type', value: this.stores.authentication.getRoleDescription(user.roles[0].role as 'ADMIN') }
      ];
    }

    this.setPageStatus('READY');

  }
}
