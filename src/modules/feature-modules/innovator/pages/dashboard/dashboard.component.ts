import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { NotificationService } from '@modules/shared/services/notification.service';

@Component({
  selector: 'app-innovator-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent implements OnInit {

  user: {
    displayName: string,
    innovations: { id: string, name: string }[]
  };

  innovationGuidesUrl = `${this.stores.environment.BASE_URL}/innovation-guides`;

  constructor(
    private notificationService: NotificationService
  ) {

    super();

    this.user = {
      displayName: this.stores.authentication.getUserInfo().displayName,
      innovations: this.stores.authentication.getUserInfo().innovations
    };

  }

  ngOnInit(): void { }

  notificationsCount(): number {
    let count = 0;
    const notifications = this.notificationService.notifications;
    const names = Object.keys(this.notificationService.notifications);
    for (const name of names) {
      count += notifications[name];
    }

    return count;
  }

}
