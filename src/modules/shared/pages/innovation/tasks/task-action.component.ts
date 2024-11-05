import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';

import { CoreComponent } from '@app/base';
import { UtilsHelper } from '@app/base/helpers';

import { CustomValidators } from '@modules/shared/forms';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { InnovationTaskStatusEnum } from '@modules/stores';

@Component({
  selector: 'shared-pages-innovation-task-action',
  templateUrl: './task-action.component.html'
})
export class PageInnovationTaskActionComponent extends CoreComponent implements OnInit {
  innovationId: string;
  taskId: string;
  status: InnovationTaskStatusEnum;

  taskCreatedBy: null | 'accessor' | 'needs assessor';

  pageInformation?: { title: string; leadText: string };
  submitBtn: { label: string; isDisabled: boolean };

  sectionInDraft: boolean;

  form = new FormGroup(
    {
      message: new FormControl<string>('', { validators: CustomValidators.required('Please enter a message') })
    },
    { updateOn: 'blur' }
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.taskId = this.activatedRoute.snapshot.params.taskId;
    this.status = this.activatedRoute.snapshot.data.status;

    this.taskCreatedBy = null;

    this.submitBtn = { label: '', isDisabled: true };
    this.sectionInDraft = false;

    this.setBackLink('Go Back');
  }

  ngOnInit(): void {
    this.innovationsService
      .getTaskInfo(this.innovationId, this.taskId)
      .pipe(
        switchMap(task => {
          return forkJoin([
            of(task),
            this.status === InnovationTaskStatusEnum.DONE
              ? this.ctx.innovation.getSectionInfo$(this.innovationId, task.section)
              : of(null)
          ]);
        })
      )
      .subscribe({
        next: ([task, section]) => {
          this.taskCreatedBy = task.createdBy.displayTag.toLowerCase().includes('assessment')
            ? 'needs assessor'
            : 'accessor';

          switch (this.status) {
            case InnovationTaskStatusEnum.DONE:
              this.pageInformation = {
                title: 'Mark task as done',
                leadText: 'Send a message describing any steps you have taken to complete this task'
              };
              this.submitBtn = { label: 'Mark task as done', isDisabled: false };
              break;

            case InnovationTaskStatusEnum.DECLINED:
              this.pageInformation = {
                title: 'Decline task',
                leadText: 'Send a message to explain why you are declining this task'
              };
              this.submitBtn = { label: 'Decline task', isDisabled: false };
              break;

            case InnovationTaskStatusEnum.CANCELLED:
              this.pageInformation = {
                title: 'Cancel task',
                leadText: 'Explain the reason you are cancelling this task'
              };
              this.submitBtn = { label: 'Cancel task', isDisabled: false };
              break;

            case InnovationTaskStatusEnum.OPEN:
              this.pageInformation = {
                title: 'Reopen task',
                leadText:
                  'Describe the information you want the innovator to provide, and explain why the the information submitted was not sufficient'
              };
              this.submitBtn = { label: 'Reopen task', isDisabled: false };
              break;
          }

          const sectionInfo = this.stores.schema.getIrSchemaSectionIdentificationV3(task.section);
          this.pageInformation.title += ` for section ${sectionInfo?.group.number}.${sectionInfo?.section.number} '${sectionInfo?.section.title}'`;

          if (section?.status === 'DRAFT') {
            this.sectionInDraft = true;
          }

          this.setPageTitle(this.pageInformation.title, { size: 'l' });
          this.setPageStatus('READY');
        },
        error: () => {
          this.setAlertError('Task was not found.');
          this.setPageStatus('ERROR');
          this.submitBtn.isDisabled = true;
        }
      });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitBtn.isDisabled = true;

    const message = this.form.get('message')?.value ?? undefined;

    this.innovationsService
      .updateTask(this.innovationId, this.taskId, {
        status: this.status,
        message: !UtilsHelper.isEmpty(message) ? message : undefined
      })
      .subscribe({
        next: () => {
          switch (this.status) {
            case InnovationTaskStatusEnum.DONE:
              this.setRedirectAlertSuccess('You have marked this task as done', {
                message: `Your message has been sent and the ${this.taskCreatedBy} will be notified about it.`
              });
              break;
            case InnovationTaskStatusEnum.DECLINED:
              this.setRedirectAlertSuccess('You have declined this task', {
                message: `Your message has been sent and the ${this.taskCreatedBy} will be notified.`
              });
              break;
            case InnovationTaskStatusEnum.CANCELLED:
              this.setRedirectAlertSuccess('You have cancelled this task', {
                message: 'Your message has been sent and the innovator will be notified about it.'
              });
              break;
            case InnovationTaskStatusEnum.OPEN:
              this.setRedirectAlertSuccess('You have reopened this task', {
                message: 'The innovator will be notified.'
              });
              break;
          }

          this.redirectTo(`/${this.userUrlBasePath()}/innovations/${this.innovationId}/tasks/${this.taskId}`, {
            action: this.status
          });
        },

        error: () => {
          this.setAlertError(
            'An error occurred while updating a task. Please try again or contact us for further help.'
          );
          this.setPageStatus('ERROR');
          this.submitBtn.isDisabled = false;
        }
      });
  }
}
