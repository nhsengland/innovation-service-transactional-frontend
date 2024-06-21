import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
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
    displayOrganisations?: string[];
    displayStatuses?: string;
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
            const translatedStatuses = subscription.status
              .map(status => this.translate(`shared.catalog.innovation.support_status.${status}.name`).toLowerCase())
              .sort();
            return {
              ...subscription,
              displayOrganisations: subscription.organisations
                .flatMap(org => (org.units.length === 1 ? [org.name] : org.units.map(unit => unit.name)))
                .sort(),
              displayStatuses:
                translatedStatuses.length === 1
                  ? translatedStatuses[0]
                  : `${translatedStatuses.slice(0, -1).join(', ')} or ${translatedStatuses.at(-1)}`
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
