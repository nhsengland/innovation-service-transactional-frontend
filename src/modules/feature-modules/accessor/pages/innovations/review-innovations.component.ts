import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { INNOVATION_STATES } from '@modules/shared';

import { AccessorService, getInnovationsListEndpointDTO } from '../../services/accessor.service';

@Component({
  selector: 'app-accessor-pages-review-innovations',
  templateUrl: './review-innovations.component.html'
})
export class ReviewInnovationsComponent extends CoreComponent implements OnInit {

  innovationsList: TableModel<(getInnovationsListEndpointDTO['data'][0])>;

  innovationStates = INNOVATION_STATES;

  constructor(
    private accessorService: AccessorService
  ) {

    super();

    this.innovationsList = new TableModel({
      visibleColumns: {
        name: { label: 'Name', orderable: true },
        createdAt: { label: 'Created at', orderable: true },
        updatedAt: { label: 'Updated at', orderable: true },
        supportStatus: { label: 'Status', align: 'right' }
      },
      orderBy: 'updatedAt', orderDir: 'desc'
    });

  }

  ngOnInit(): void {

    this.getInnovations();

  }


  getInnovations(): void {

    this.accessorService.getInnovationsList(this.innovationsList.getAPIQueryParams()).subscribe(
      response => this.innovationsList.setData(response.data, response.count),
      error => this.logger.error(error)
    );

  }


  onTableOrder(column: string): void {

    this.innovationsList.setOrderBy(column);
    this.getInnovations();

  }

}
