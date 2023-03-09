import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { ContextInnovationType } from '@modules/stores';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationCollaboratorStatusEnum } from '@modules/stores/innovation/innovation.enums';


type TableListsType = {
  id: string,
  name?: string,
  role: string,
  action: null | { label: string, url: string }
};

@Component({
  selector: 'app-innovator-pages-innovation-manage-collaborators-overview',
  templateUrl: './manage-collaborators-overview.component.html'
})
export class PageInnovationManageCollaboratorsOverviewComponent extends CoreComponent implements OnInit {

  user: { id: string, name: string, email: string };
  innovation: ContextInnovationType;

  activeCollaborators: TableModel<TableListsType>;
  historyCollaborators: TableModel<TableListsType>;

  constructor(
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovation = this.stores.context.getInnovation();

    const user = this.stores.authentication.getUserInfo();
    this.user = { id: user.id, name: user.displayName, email: user.email };

    this.setPageTitle('Invite or manage users');
    this.setBackLink('Go back', `innovator/innovations/${this.innovation.id}/manage`);

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

      let action: null | TableListsType['action'] = null;

      this.activeCollaborators.setData([
        ...[{ id: this.user.id, name: this.user.name, role: 'Owner', email: this.user.email, action: null }],
        ...activeCollaborators.data.map(item => {

          switch (item.status) {

            case InnovationCollaboratorStatusEnum.ACTIVE:
              action = { label: 'Manage', url: `${item.id}` };
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
            name: item.name ? `${item.name} (${item.email})` : item.email,
            role: item.role ?? '',
            email: item.email,
            action
          };

        })
      ]);

      this.historyCollaborators.setData(historyCollaborators.data.map(item => ({
        id: item.id,
        name: item.name ? `${item.name} (${item.email})` : item.email,
        role: item.role ?? '',
        email: item.email,
        action: { label: 'Invite again', url: `${item.id}/invite-again` }
      })));

      this.setPageStatus('READY');

    });

  }

}
