import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { RoutingHelper } from '@app/base/helpers';

import { AccessorService, getInnovationActionsListEndpointOutDTO } from '../../../services/accessor.service';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';


@Component({
  selector: 'app-accessor-pages-innovation-action-tracker-list',
  templateUrl: './action-tracker-list.component.html'
})
export class InnovationActionTrackerListComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: InnovationDataResolverType;

  openedActionsList: TableModel<(getInnovationActionsListEndpointOutDTO['openedActions'][0])>;
  closedActionsList: TableModel<(getInnovationActionsListEndpointOutDTO['closedActions'][0])>;

  innovationSummary: { label: string; value: string; }[] = [];

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();
    this.setPageTitle('Action tracker');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;

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

    this.accessorService.getInnovationActionsList(this.innovationId).subscribe(
      response => {
        this.openedActionsList.setData(response.openedActions);
        this.closedActionsList.setData(response.closedActions);
        this.setPageStatus('READY');
      },
      error => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch actions information',
          message: 'Please try again or contact us for further help'
        };
      }
    );

  }

}
