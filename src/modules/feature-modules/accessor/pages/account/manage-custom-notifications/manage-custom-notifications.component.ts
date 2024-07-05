import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import {
  AccessorService,
  GetNotifyMeInnovationsWithSubscriptions
} from '@modules/feature-modules/accessor/services/accessor.service';

@Component({
  selector: 'app-accessor-pages-account-manage-custom-notifications',
  templateUrl: './manage-custom-notifications.component.html'
})
export class AccountManageCustomNotificationsComponent extends CoreComponent implements OnInit {
  subscriptionsList: GetNotifyMeInnovationsWithSubscriptions[] = [];
  constructor(private accessorService: AccessorService) {
    super();
    this.setPageTitle('Manage custom notifications');
  }

  ngOnInit() {
    this.accessorService.getNotifyMeInnovationsWithSubscriptionsList().subscribe({
      next: response => {
        this.subscriptionsList = response;
        this.setPageStatus('READY');
      },
      error: () => {
        this.setAlertUnknownError();
        this.setPageStatus('ERROR');
      }
    });
  }
}
