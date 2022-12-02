import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { InnovationActionInfoDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';


@Component({
  selector: 'shared-pages-innovation-action-tracker-info',
  templateUrl: './action-tracker-info.component.html'
})
export class PageInnovationActionTrackerInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;

  action?: InnovationActionInfoDTO;


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;

  }


  ngOnInit(): void {

    this.innovationsService.getActionInfo(this.innovationId, this.actionId).subscribe(response => {

      this.action = response;

      this.setPageTitle(this.action.name, { hint: this.action.displayId });
      this.setPageStatus('READY');

    });

    this.stores.context.dismissNotification(this.innovationId, {contextTypes: [NotificationContextTypeEnum.ACTION], contextIds: [this.actionId]});

  }

}
