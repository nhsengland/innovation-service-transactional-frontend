import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

import { ActivatedRoute } from '@angular/router';
import { getInnovationActionsListEndpointOutDTO, InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { InnovationDataType } from '@modules/feature-modules/accessor/resolvers/innovation-data.resolver';
import { TableModel } from '@app/base/models';
import { RoutingHelper } from '@modules/core';
import { InnovationService } from '@modules/stores';


@Component({
  selector: 'app-innovator-pages-innovation-action-tracker',
  templateUrl: './action-tracker.component.html'
})
export class InnovationActionTrackerComponent extends CoreComponent implements OnInit {

  innovationId: string;

  openedActionsList: TableModel<(getInnovationActionsListEndpointOutDTO['openedActions'][0])>;
  closedActionsList: TableModel<(getInnovationActionsListEndpointOutDTO['closedActions'][0])>;

  innovationSummary: { label: string; value: string; }[] = [];

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService,
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.openedActionsList = new TableModel({
      visibleColumns: {
        id: { label: 'ID' },
        name: { label: 'Action' },
        createdAt: { label: 'Requested date' },
        status: { label: 'Status', align: 'right' }
      }
    });

    this.closedActionsList = new TableModel({
      visibleColumns: {
        id: { label: 'ID' },
        name: { label: 'Action' },
        createdAt: { label: 'Requested date' },
        status: { label: 'Status', align: 'right' }
      }
    });

  }


  ngOnInit(): void {

    this.innovatorService.getInnovationActionsList(this.innovationId).subscribe(
      response => {

        this.openedActionsList.setData(response.openedActions);
        this.closedActionsList.setData(response.closedActions);
      },
      error => {
        this.logger.error(error);
      }
    );

  }
}
