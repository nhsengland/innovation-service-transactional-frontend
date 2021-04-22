import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { INNOVATION_STATES } from '@modules/shared';

import { AccessorService, getInnovationsListEndpointDTO } from '../../services/accessor.service';

@Component({
  selector: 'app-accessor-pages-innovations-list',
  templateUrl: './innovations-list.component.html'
})
export class InnovationsListComponent extends CoreComponent implements OnInit {

  innovations: TableModel<(getInnovationsListEndpointDTO['data'][0])>;

  innovationStates = INNOVATION_STATES;

  constructor(
    private accessorService: AccessorService
  ) {

    super();

    this.innovations = new TableModel({
      visibleColumns: { name: 'Name', createdAt: 'Created At', updatedAt: 'Updated At', supportStatus: { label: 'Status', align: 'right' } },
      orderBy: 'updatedAt', orderDir: 'desc'
    });

  }

  ngOnInit(): void {

    this.getInnovations();

  }


  getInnovations(): void {
    this.accessorService.getInnovationsList(this.innovations.getAPIQueryParams()).subscribe(
      response => this.innovations.setData(response.data, response.count),
      error => this.logger.error(error)
    );
  }


  onTableOrder(column: string): void {

    this.innovations.setOrderBy(column);

    this.accessorService.getInnovationsList(this.innovations.getAPIQueryParams()).subscribe(
      response => {
        this.innovations.setData(response.data, response.count);
      },
      error => {
        this.logger.error(error);
      }
    );

  }

}
