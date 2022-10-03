import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation/innovation.models';

import { InnovationsService, getInnovationActionInfoOutDTO } from '@modules/shared/services/innovations.service';


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

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  declineShow: boolean;


  constructor(
    private activatedRoute: ActivatedRoute,
    private InnovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;
    this.actionName = '';
    this.actionStatus = '';
    this.declineShow = false;

  }


  ngOnInit(): void {

    this.InnovationsService.getInnovatorInnovationActionInfo(this.innovationId, this.actionId).subscribe(response => {

      this.action = response;
      this.declineShow = this.action.status.toLocaleLowerCase() === INNOVATION_SECTION_ACTION_STATUS.REQUESTED.label.toLocaleLowerCase();

      this.setPageTitle(this.action.name, { hint: this.action.displayId });
      this.setBackLink('Action tracker', `/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/action-tracker`);
      this.setPageStatus('READY');

    });

    this.stores.context.dismissNotification(NotificationContextTypeEnum.ACTION, this.actionId);

  }

}
