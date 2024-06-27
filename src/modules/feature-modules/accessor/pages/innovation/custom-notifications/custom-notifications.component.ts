import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { UtilsHelper } from '@app/base/helpers';
import {
  AccessorService,
  GetNotifyMeInnovationSubscription
} from '@modules/feature-modules/accessor/services/accessor.service';
import { ContextInnovationType } from '@modules/stores';

@Component({
  selector: 'app-accessor-pages-innovation-custom-notifications',
  templateUrl: './custom-notifications.component.html'
})
export class InnovationCustomNotificationsComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;

  subscriptionsList: (GetNotifyMeInnovationSubscription & {
    displayTitle?: string;
    displayOrganisations?: string[];
  })[] = [];

  constructor(private accessorService: AccessorService) {
    super();

    this.innovation = this.stores.context.getInnovation();

    this.setPageTitle('Custom notifications');
  }

  ngOnInit() {
    this.accessorService.getNotifyMeInnovationSubscriptionsList(this.innovation.id).subscribe({
      next: response => {
        this.subscriptionsList = response.map(subscription => {
          if (subscription.eventType === 'SUPPORT_UPDATED') {
            return {
              ...subscription,
              displayTitle: UtilsHelper.getNotifyMeSubscriptionText(subscription),
              displayOrganisations: subscription.organisations
                .flatMap(org => (org.units.length === 1 ? [org.name] : org.units.map(unit => unit.name)))
                .sort()
            };
          } else {
            return subscription;
          }
        });
        this.setPageStatus('READY');
      },
      error: () => {
        this.setAlertUnknownError();
        this.setPageStatus('ERROR');
      }
    });
  }
}
