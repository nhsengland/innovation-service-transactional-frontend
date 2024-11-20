import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationEnum } from '@modules/feature-modules/accessor/services/accessor.service';
import { AuthenticationStore } from '@modules/stores';

export type CustomNotificationEntrypointComponentLinksType = { label: string; action: NotificationEnum }[];

@Component({
  selector: 'theme-custom-notifications-entrypoint-component',
  templateUrl: './custom-notifications-entrypoint.component.html'
})
export class CustomNotificationsEntrypointComponent implements OnInit {
  @Input() links: CustomNotificationEntrypointComponentLinksType = [];
  innovationId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationStore: AuthenticationStore
  ) {
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
  }

  ngOnInit(): void {}

  onNotify(customNotificationAction: NotificationEnum) {
    const url = `/${this.authenticationStore.userUrlBasePath()}/innovations/${this.innovationId}/custom-notifications/new`;
    this.router.navigateByUrl(url, { state: { customNotificationAction } });
  }
}
