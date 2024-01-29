import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { ContextInnovationType, DateISOType } from '@app/base/types';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatusEnum } from '@modules/stores/innovation';

@Component({
  selector: 'app-innovator-pages-innovation-manage-archive-overview',
  templateUrl: './manage-archive-overview.component.html'
})
export class PageInnovationManageArchiveOverviewComponent extends CoreComponent implements OnInit {
  innovationId: string;

  innovation: ContextInnovationType;

  innovations: TableModel<{ id: string; name: string; statusUpdatedAt: null | DateISOType }>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = this.stores.context.getInnovation();

    this.setBackLink('Go back', `/innovator/innovations/${this.innovationId}/manage/innovation`);

    this.innovations = new TableModel({
      visibleColumns: {
        innovations: { label: 'Innovations' },
        statusUpdatedAt: { label: 'Date' },
        actions: { label: '', align: 'right' }
      }
    });
  }

  ngOnInit() {
    this.setPageTitle(`Archive ${this.innovation.name} innovation`);

    this.innovationsService
      .getInnovationsList({
        queryParams: {
          take: 100,
          skip: 0,
          filters: { status: [InnovationStatusEnum.PAUSED], hasAccessThrough: ['owner'] }
        }
      })
      .subscribe(innovations => {
        this.innovations.setData(
          innovations.data.map(item => ({ id: item.id, name: item.name, statusUpdatedAt: item.statusUpdatedAt }))
        );

        this.setPageStatus('READY');
      });

    this.setPageStatus('READY');
  }
}
