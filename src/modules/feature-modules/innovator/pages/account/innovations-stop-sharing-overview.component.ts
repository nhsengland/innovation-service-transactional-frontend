import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { DateISOType } from '@app/base/types';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatusEnum } from '@modules/stores/innovation';



@Component({
  selector: 'shared-pages-account-innovations-stop-sharing-overview',
  templateUrl: './innovations-stop-sharing-overview.component.html'
})
export class PageAccountInnovationsStopSharingOverviewComponent extends CoreComponent implements OnInit {

  innovations: TableModel<{ id: string, name: string, statusUpdatedAt: null | DateISOType }>;

  constructor(private innovationsService: InnovationsService,) {

    super();

    this.setPageTitle('Stop sharing an innovation');

    this.innovations = new TableModel({
      visibleColumns: {
        innovations: { label: 'Innovations' },
        statusUpdatedAt: { label: 'Date' },
        actions: { label: '', align: 'right' }
      }
    });

  }

  ngOnInit() {

    this.innovationsService.getInnovationsList({ take: 100, skip: 0, filters: { status: [InnovationStatusEnum.PAUSED] } }).subscribe((innovations) => {

      this.innovations.setData(innovations.data.map(item => ({ id: item.id, name: item.name, statusUpdatedAt: item.statusUpdatedAt })))

      this.setPageStatus('READY');

    });

  }

}
