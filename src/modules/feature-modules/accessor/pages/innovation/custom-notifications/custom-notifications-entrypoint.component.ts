import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { NotificationEnum } from '@modules/feature-modules/accessor/services/accessor.service';

export type CustomNotificationEntrypointComponentLinksType = {
  label: string;
  action: NotificationEnum;
  section?: string;
};

@Component({
  selector: 'theme-custom-notifications-entrypoint-component',
  templateUrl: './custom-notifications-entrypoint.component.html'
})
export class CustomNotificationsEntrypointComponent extends CoreComponent {
  @Input() links: CustomNotificationEntrypointComponentLinksType[] = [];
  innovationId: string;

  constructor(private activatedRoute: ActivatedRoute) {
    super();
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
  }

  onNotify(customNotificationAction: NotificationEnum) {
    const url = `/${this.ctx.user.userUrlBasePath()}/innovations/${this.innovationId}/custom-notifications/new`;
    this.router.navigateByUrl(url, { state: { customNotificationAction } });
  }

  getItemParams(item: CustomNotificationEntrypointComponentLinksType): { action: NotificationEnum; section?: string } {
    return {
      action: item.action,
      ...(item.section && { section: item.section })
    };
  }
}
