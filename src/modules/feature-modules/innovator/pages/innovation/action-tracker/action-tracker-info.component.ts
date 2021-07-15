import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { NotificationContextType, NotificationService } from '@modules/shared/services/notification.service';
import { INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation/innovation.models';

import { InnovatorService, getInnovationActionInfoOutDTO } from '../../../services/innovator.service';


@Component({
  selector: 'app-innovator-pages-innovation-action-tracker-info',
  templateUrl: './action-tracker-info.component.html'
})
export class InnovationActionTrackerInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;
  actionName: string;
  actionStatus: keyof typeof INNOVATION_SECTION_ACTION_STATUS;

  action?: getInnovationActionInfoOutDTO;


  summaryAlert: { type: '' | 'success' | 'error' | 'warning' | 'neutral' , title: string, message: string };

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  declineShow: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService,
    private notificationService: NotificationService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;
    this.actionName = '';
    this.actionStatus = '';
    this.declineShow = false;

    switch (this.activatedRoute.snapshot.queryParams.alert) {

      case 'actionDeclined':
        this.summaryAlert = {
          type: 'neutral',
          title: `Action declined`,
          message: 'The accessor will be notified.'
        };
        break;
      default:
        this.summaryAlert = { type: '', title: '', message: '' };
        break;
    }

  }


  ngOnInit(): void {

    this.innovatorService.getInnovationActionInfo(this.innovationId, this.actionId).subscribe(
      response => {
        this.action = response;
        this.declineVisible();
      },
      error => {
        this.logger.error(error);
      }
    );

    this.notificationService.dismissNotification(this.actionId, NotificationContextType.ACTION).subscribe();

  }

  private declineVisible(): void {
    this.declineShow =  this.action?.status.toLocaleLowerCase()
      === INNOVATION_SECTION_ACTION_STATUS.REQUESTED.label.toLocaleLowerCase();
  }

}
