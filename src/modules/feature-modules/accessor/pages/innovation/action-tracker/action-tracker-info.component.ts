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

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;

  }


  ngOnInit(): void {

    this.accessorService.getInnovationActionInfo(this.innovationId, this.actionId).subscribe(response => {

      this.action = response;

      this.setPageTitle(this.action.name, { hint: this.action.displayId });
      this.setPageStatus('READY');

    });

    this.stores.context.dismissNotification(NotificationContextTypeEnum.ACTION, this.actionId);

  }

}
