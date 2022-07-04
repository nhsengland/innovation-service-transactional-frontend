import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/types';
import { NotificationContextTypeEnum } from '@modules/stores/environment/environment.enums';
import { INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation/innovation.models';

import { InnovatorService, getInnovationActionInfoOutDTO } from '../../../services/innovator.service';


@Component({
  selector: 'app-innovator-pages-innovation-action-tracker-info',
  templateUrl: './action-tracker-info.component.html'
})
export class InnovationActionTrackerInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;

  alert: AlertType = { type: null };

  actionName: string;
  actionStatus: keyof typeof INNOVATION_SECTION_ACTION_STATUS;

  action?: getInnovationActionInfoOutDTO;

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  declineShow: boolean;


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Action detail');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;
    this.actionName = '';
    this.actionStatus = '';
    this.declineShow = false;

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'actionDeclined':
        this.alert = {
          type: 'INFORMATION',
          title: `Action declined`,
          message: 'The accessor will be notified.'
        };
        break;
      default:
        break;
    }

  }


  ngOnInit(): void {

    this.innovatorService.getInnovationActionInfo(this.innovationId, this.actionId).subscribe(
      response => {

        this.action = response;
        this.declineShow = this.action.status.toLocaleLowerCase() === INNOVATION_SECTION_ACTION_STATUS.REQUESTED.label.toLocaleLowerCase();

        this.setPageStatus('READY');

      },
      error => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch actions information',
          message: 'Please try again or contact us for further help'
        };
      }
    );

    this.stores.environment.dismissNotification(NotificationContextTypeEnum.ACTION, this.actionId);

  }

}
