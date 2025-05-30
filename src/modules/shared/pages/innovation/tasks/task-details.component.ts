import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { InnovationDescription, InnovationTaskInfoDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { InnovationStatusEnum } from '@modules/stores';

@Component({
  selector: 'shared-pages-innovation-task-section-info',
  templateUrl: './task-details.component.html'
})
export class PageInnovationTaskDetailsComponent extends CoreComponent implements OnInit {
  innovationId: string;
  sectionId: string;
  taskId: string;

  task?: InnovationTaskInfoDTO;
  sectionTitle = '';

  tasksIds: string[] = [];

  taskNumber = 0;

  userUrlBase = '';

  // Flags
  canCancel = false;
  canReopen = false;
  canSendMessage = false;

  readonly innovation = this.ctx.innovation.info();

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.sectionId =
      this.activatedRoute.snapshot.queryParams.sectionId ?? this.activatedRoute.snapshot.params.sectionId;
    this.taskId = this.activatedRoute.snapshot.params.taskId;

    this.userUrlBase = this.userUrlBasePath();
  }

  ngOnInit(): void {
    const taskAction = this.activatedRoute.snapshot.queryParams?.action;

    if (!(this.ctx.layout.previousUrl() && taskAction)) {
      this.setBackLink('Go back');
    }

    if (this.sectionId) {
      this.innovationsService
        .getSectionInfo(this.innovationId, this.sectionId, { fields: ['tasks'] })
        .subscribe(sectionInfo => {
          this.tasksIds = sectionInfo.tasksIds ?? [];

          if (this.tasksIds.length === 0) {
            this.redirectTo(`${this.userUrlBasePath}/innovations/${this.innovationId}/tasks`);
          }

          this.taskNumber = 0;

          this.getTaskInfo();
        });
    } else if (this.taskId) {
      this.getTaskInfo();
    }
  }

  handlePagination(task: 'previous' | 'next') {
    switch (task) {
      case 'previous':
        if (this.taskNumber === 0) {
          return;
        }
        this.taskNumber--;
        break;
      case 'next':
        if (this.taskNumber === this.tasksIds.length - 1) {
          return;
        }
        this.taskNumber++;
        break;
      default:
    }

    this.getTaskInfo();
  }

  private sortDescriptionsByDateDesc(descriptions: InnovationDescription[]) {
    return descriptions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  private getTaskInfo() {
    this.setPageStatus('LOADING');

    if (this.sectionId) {
      this.taskId = this.tasksIds[this.taskNumber];
    }

    this.innovationsService.getTaskInfo(this.innovationId, this.taskId).subscribe(response => {
      this.task = response;
      this.task.descriptions = this.sortDescriptionsByDateDesc(this.task.descriptions);
      const section = this.ctx.schema.getIrSchemaSectionIdentificationV3(response.section);
      this.sectionTitle = section
        ? `${section.group.number}.${section.section.number} ${section.section.title}`
        : 'Section no longer available';

      if (this.tasksIds.length > 1) {
        this.setPageTitle(
          `Update section ${section?.group.number}.${section?.section.number} '${section?.section.title}'`,
          { hint: `${this.taskNumber + 1} of ${this.tasksIds.length}` }
        );
      } else {
        this.setPageTitle(
          `Update section ${section?.group.number}.${section?.section.number} '${section?.section.title}'`,
          { hint: `Task Id: ${this.task.displayId}` }
        );
      }

      this.setAllowedActions();

      this.setPageStatus('READY');
    });
  }

  private setAllowedActions() {
    this.canReopen =
      !!this.task &&
      !this.ctx.innovation.isArchived() &&
      ['DONE', 'DECLINED'].includes(this.task.status) &&
      this.task.sameOrganisation &&
      (this.ctx.user.isAssessment() ||
        (this.ctx.user.isAccessorType() && this.innovation.status === InnovationStatusEnum.IN_PROGRESS));

    this.canCancel =
      !!this.task &&
      this.task.status === 'OPEN' &&
      this.task.sameOrganisation &&
      (this.ctx.user.isAssessment() ||
        (this.ctx.user.isAccessorType() && this.innovation.status === InnovationStatusEnum.IN_PROGRESS));

    this.canSendMessage =
      !this.ctx.innovation.isArchived() &&
      (this.ctx.user.isInnovator() ||
        this.ctx.user.isAssessment() ||
        (this.ctx.user.isAccessorType() && this.innovation.status === InnovationStatusEnum.IN_PROGRESS));
  }
}
