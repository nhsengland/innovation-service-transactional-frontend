import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { InnovationsService, InnovationsTasksListFilterType } from '@modules/shared/services/innovations.service';
import { ContextInnovationType, InnovationTaskStatusEnum } from '@modules/stores';

import { UserRoleEnum } from '@app/base/enums';
import { InnovationTaskData, InnovationTasksListDTO } from '@modules/shared/services/innovations.dtos';

@Component({
  selector: 'shared-pages-innovation-task-to-do-list',
  templateUrl: './task-to-do-list.component.html'
})
export class PageInnovationTaskToDoListComponent extends CoreComponent implements OnInit {
  innovationId: string;
  innovation: ContextInnovationType;
  userType: UserRoleEnum | undefined;
  tablesTitles: { topTableTitle: string; bottomTableTitle: string };

  allTasksList: TableModel<InnovationTasksListDTO['data'][0], InnovationsTasksListFilterType>;

  topList: InnovationTasksListDTO;
  bottomList: InnovationTasksListDTO;

  // Flags
  isClosedActionsLoading = false;
  isArchived: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();
    // Flags

    this.setPageTitle(this.ctx.user.isInnovator() ? 'Tasks to do' : 'Tasks');

    this.tablesTitles = { topTableTitle: '', bottomTableTitle: '' };

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = this.ctx.innovation.info();
    this.isArchived = this.ctx.innovation.isArchived();

    this.allTasksList = new TableModel({
      visibleColumns: {
        id: { label: 'ID' },
        name: { label: 'Task' },
        status: { label: 'Status', align: 'right' }
      },
      pageSize: 100
    });

    this.topList = { count: 0, data: [] };
    this.bottomList = { count: 0, data: [] };
  }

  ngOnInit(): void {
    this.userType = this.getUserType();

    this.allTasksList.setFilters({
      innovationId: this.innovationId,
      fields: ['notifications'],
      status: [
        InnovationTaskStatusEnum.OPEN,
        InnovationTaskStatusEnum.DONE,
        InnovationTaskStatusEnum.DECLINED,
        InnovationTaskStatusEnum.CANCELLED
      ]
    });

    this.innovationsService.getTasksList(this.allTasksList.getAPIQueryParams()).subscribe(allTasksResponse => {
      this.processTaskList(allTasksResponse);
      this.tablesTitles = this.getTablesTitles();
      this.setPageStatus('READY');
    });
  }

  processTaskList(taskList: InnovationTasksListDTO) {
    for (const task of taskList.data) {
      if (this.shouldBeOnTopTable(task)) {
        this.topList.data.push(task);
      } else {
        this.bottomList.data.push(task);
      }
    }
    this.topList.count = this.topList.data.length;
    this.bottomList.count = this.bottomList.data.length;
  }

  shouldBeOnTopTable(item: InnovationTaskData): boolean {
    switch (this.getUserType()) {
      case 'INNOVATOR':
        return item.status == InnovationTaskStatusEnum.OPEN;

      case 'ASSESSMENT':
      case 'ACCESSOR':
      case 'QUALIFYING_ACCESSOR':
        return item.sameOrganisation;

      case 'ADMIN':
        return true;

      default:
        return false;
    }
  }

  getUserType() {
    return this.ctx.user.isAccessorType() ? UserRoleEnum.ACCESSOR : this.ctx.user.getUserType();
  }

  getTablesTitles(): { topTableTitle: string; bottomTableTitle: string } {
    let tasksToDoTitle = '';
    switch (this.topList.count) {
      case 0:
        tasksToDoTitle = 'You have no tasks to do';
        break;
      case 1:
        tasksToDoTitle = `You have 1 task to do`;
        break;
      default:
        tasksToDoTitle = `You have ${this.topList.count} tasks to do`;
    }

    switch (this.userType) {
      case 'INNOVATOR':
        return {
          topTableTitle: tasksToDoTitle,
          bottomTableTitle: 'Previous tasks'
        };
      case 'ACCESSOR':
        return {
          topTableTitle: 'Tasks assigned by my organisation unit',
          bottomTableTitle: 'Tasks assigned by others'
        };
      case 'QUALIFYING_ACCESSOR':
        return {
          topTableTitle: 'Tasks assigned by my organisation unit',
          bottomTableTitle: 'Tasks assigned by others'
        };
      case 'ASSESSMENT':
        return {
          topTableTitle: 'Tasks assigned by needs assessment team',
          bottomTableTitle: 'Tasks assigned by others'
        };
      case 'ADMIN':
        return {
          topTableTitle: '',
          bottomTableTitle: ''
        };
      default:
        return {
          topTableTitle: 'Top table title',
          bottomTableTitle: 'Bottom table title'
        };
    }
  }
}
