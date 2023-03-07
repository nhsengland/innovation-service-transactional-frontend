import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { ContextInnovationType } from '@modules/stores';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationCollaboratorStatusEnum } from '@modules/stores/innovation/innovation.enums';


@Component({
  selector: 'app-innovator-pages-innovation-manage-collaborators-overview',
  templateUrl: './manage-collaborators-overview.component.html'
})
export class PageInnovationManageCollaboratorsOverviewComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType;

  activeCollaborators: TableModel<{ id: string, name: string, role: string, email: string, action: null | { label: string, url: string } }>;
  historyCollaborators: TableModel<{ id: string, name: string, role: string, email: string, action: null | { label: string, url: string } }>;

  constructor(
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovation = this.stores.context.getInnovation();

    this.setPageTitle('Invite or manage users');
    // this.setBackLink('Go back', `/innovator/innovations/${this.innovation.id}/manage`);

    this.activeCollaborators = new TableModel({
      visibleColumns: {
        user: { label: 'User' },
        role: { label: 'Role' },
        actions: { label: '', align: 'right' }
      }
    });

    this.historyCollaborators = new TableModel({
      visibleColumns: {
        innovations: { label: 'User' },
        statusUpdatedAt: { label: 'Role' },
        actions: { label: '', align: 'right' }
      }
    });

  }

  ngOnInit() {

    forkJoin([
      this.innovationsService.getInnovationCollaboratorsList(this.innovation.id, ['pending', 'active']),
      this.innovationsService.getInnovationCollaboratorsList(this.innovation.id, ['history'])
    ]).subscribe(([activeCollaborators, historyCollaborators]) => {

      let action: null | { label: string, url: string } = null;

      this.activeCollaborators.setData(activeCollaborators.data.map(item => {

        switch (item.status) {

          case InnovationCollaboratorStatusEnum.ACTIVE:
            action = { label: 'Manage', url: 'info' };
            break;

          case InnovationCollaboratorStatusEnum.PENDING:
            action = { label: 'Cancel invitation', url: `${item.id}` };
            break;

          default:
            action = null;
            break;

        }

        return {
          id: item.id,
          name: item.name ?? item.email,
          role: item.collaboratorRole ?? '',
          email: item.email,
          action
        };

      }));

      this.historyCollaborators.setData(historyCollaborators.data.map(item => ({
        id: item.id,
        name: item.name ?? item.email,
        role: item.collaboratorRole ?? '',
        email: item.email,
        action: { label: 'Invite again', url: 'info' }
      })))

      this.setPageStatus('READY');

    });

    // this.setPageStatus('READY');

  }


  onCancel(collaboratorId: string) {

  }

}
