import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { DateISOType } from '@app/base/types';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatusEnum } from '@modules/stores/innovation';



@Component({
  selector: 'app-innovator-pages-innovation-manage-stop-sharing-overview',
  templateUrl: './manage-stop-sharing-overview.component.html'
})
export class PageInnovationManageStopSharingOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;

  innovations: TableModel<{ id: string, name: string, statusUpdatedAt: null | DateISOType }>;

  constructor(private activatedRoute: ActivatedRoute, private innovationsService: InnovationsService,) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.setPageTitle('Stop sharing this innovation');
    this.setBackLink('Go back', `/innovator/innovations/${this.innovationId}/manage`);

     this.innovations = new TableModel({
      visibleColumns: {
        innovations: { label: 'Innovations' },
        statusUpdatedAt: { label: 'Date' },
        actions: { label: '', align: 'right' }
      }
    });

  }

  ngOnInit() {

     this.innovationsService.getInnovationsList({ queryParams: { take: 100, skip: 0, filters: { status: [InnovationStatusEnum.PAUSED], hasAccessThrough: ['owner'] }, } }).subscribe((innovations) => {

      this.innovations.setData(innovations.data.map(item => ({ id: item.id, name: item.name, statusUpdatedAt: item.statusUpdatedAt })))

      this.setPageStatus('READY');

    });

    this.setPageStatus('READY');

  }

}
