import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { InnovationDescription, InnovationTaskInfoDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { InnovationSectionEnum } from '@modules/stores/innovation';


@Component({
  selector: 'shared-pages-innovation-action-section-info',
  templateUrl: './task-details.component.html'
})
export class PageInnovationTaskDetailsComponent extends CoreComponent implements OnInit {

  innovationId: string;
  sectionId: InnovationSectionEnum;
  taskId: string;

  task?: InnovationTaskInfoDTO;
  sectionTitle = '';

  tasksIds: string[] = [];

  taskNumber = 0;

  userUrlBase: string = '';

  // Flags
  isInnovatorType: boolean;
  isAccessorType: boolean;
  isAssessmentType: boolean;
  isAdmin: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.taskId = this.activatedRoute.snapshot.params.taskId;

    this.userUrlBase = this.userUrlBasePath();

    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();
    this.isAdmin = this.stores.authentication.isAdminRole();

  }


  ngOnInit(): void {

    if (this.sectionId) {

      this.innovationsService.getSectionInfo(this.innovationId, this.sectionId, { fields: ['tasks'] }).subscribe(sectionInfo => {

        
        this.tasksIds = sectionInfo.tasksIds ?? [];

        if (this.tasksIds.length === 0) {
          this.redirectTo(`${this.userUrlBasePath}/innovations/${this.innovationId}/action-tracker`);
        }

        this.taskNumber = 0;

        this.getTaskInfo();

      });

      this.setBackLink('Go back', `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/record`);

    } else if (this.taskId) {

      this.getTaskInfo();

      this.setBackLink('Go back', `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/tasks`);

    }

  }

  handlePagination(task: 'previous' | 'next') {

    switch (task) {
      case 'previous':
        if (this.taskNumber === 0) { return; }
        this.taskNumber--;
        break;
      case 'next':
        if (this.taskNumber === this.tasksIds.length - 1) { return; }
        this.taskNumber++;
        break;
      default:
    }

    this.getTaskInfo();

  }

  private sortDescriptionsByDateDesc(descriptions: InnovationDescription[]){
    return descriptions.sort((a,b)=> b.createdAt.localeCompare(a.createdAt));
  }

  private getTaskInfo() {

    this.setPageStatus('LOADING');

    if (this.sectionId) {
      this.taskId = this.tasksIds[this.taskNumber];
    }

    this.innovationsService.getTaskInfo(this.innovationId, this.taskId).subscribe(response => {

      this.task = response;
      this.task.descriptions = this.sortDescriptionsByDateDesc(this.task.descriptions);

      const section = this.stores.innovation.getInnovationRecordSectionIdentification(response.section);
      this.sectionTitle = section ? `${section.group.number}.${section.section.number}: ${section.section.title}` : 'Section no longer available';

      if (this.tasksIds.length > 1) {
        this.setPageTitle('Requested task', { hint: `${this.taskNumber + 1} of ${this.tasksIds.length}` });
      } else {
        this.setPageTitle('Requested task', { hint: this.task.displayId });
      }

      this.stores.context.dismissNotification(this.innovationId, { contextTypes: [NotificationContextTypeEnum.TASK], contextIds: [this.taskId] });

      this.setPageStatus('READY');

    });

  }

}
