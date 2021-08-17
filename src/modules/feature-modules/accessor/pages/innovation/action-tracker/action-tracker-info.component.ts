import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { NotificationContextType, NotificationService } from '@modules/shared/services/notification.service';
import { INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation/innovation.models';
import { AccessorService, getInnovationActionInfoOutDTO } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-action-tracker-info',
  templateUrl: './action-tracker-info.component.html'
})
export class InnovationActionTrackerInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;
  actionName: string;
  actionStatus: keyof typeof INNOVATION_SECTION_ACTION_STATUS;

  action?: getInnovationActionInfoOutDTO;

  summaryAlert: { type: '' | 'success' | 'error' | 'warning', title: string, message: string };

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService,
    private notificationService: NotificationService,
  ) {

    super();
    this.setPageTitle('Action details');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;
    this.actionName = '';
    this.actionStatus = '';

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'actionCreationSuccess':
        this.summaryAlert = {
          type: 'success',
          title: 'Action requested',
          message: 'The innovator has been notified of your action request.'
        };
        break;
      case 'actionUpdateSuccess':
        this.summaryAlert = {
          type: 'success',
          title: `You have updated the status of this action to '${this.activatedRoute.snapshot.queryParams.status}'`,
          message: 'The innovator will be notified of this status change'
        };
        break;
      default:
        this.summaryAlert = { type: '', title: '', message: '' };
        break;
    }

  }


  ngOnInit(): void {

    this.accessorService.getInnovationActionInfo(this.innovationId, this.actionId).subscribe(
      response => {
        this.action = response;

      },
      error => {
        this.logger.error(error);
      }
    );

    this.notificationService.dismissNotification(this.actionId, NotificationContextType.ACTION).subscribe();
  }

}
