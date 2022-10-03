import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';

import { AccessorService, GetInnovationActionInfoOutDTO } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-action-tracker-info',
  templateUrl: './action-tracker-info.component.html'
})
export class InnovationActionTrackerInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;

  action?: GetInnovationActionInfoOutDTO;


  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();
    this.setPageTitle('Action details');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;


    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'actionCreationSuccess':
        this.setAlertSuccess('Action requested', { message: 'The innovator has been notified of your action request.' });
        break;
      case 'actionUpdateSuccess':
        this.setAlertSuccess(`You have updated the status of this action to '${this.activatedRoute.snapshot.queryParams.status}'`, { message: 'The innovator will be notified of this status change' });
        break;
      default:
        break;
    }

  }


  ngOnInit(): void {

    this.accessorService.getInnovationActionInfo(this.innovationId, this.actionId).subscribe(
      response => {

        this.action = response;

        this.setPageStatus('READY');

      },
      () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    );

    this.stores.context.dismissNotification(NotificationContextTypeEnum.ACTION, this.actionId);

  }

}
