import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { NotificationContextTypeEnum } from '@app/base/enums';
import { FormControl, FormGroup } from '@app/base/forms';
import { TableModel } from '@app/base/models';

import { ContextInnovationType } from '@modules/stores/context/context.types';

import { GetThreadInfoDTO, GetThreadMessagesListOutDTO, InnovationsService } from '@modules/shared/services/innovations.service';


@Component({
  selector: 'shared-pages-innovation-messages-thread-messages-list',
  templateUrl: './thread-messages-list.component.html'
})
export class PageInnovationThreadMessagesListComponent extends CoreComponent implements OnInit {

  selfUser: { id: string, urlBasePath: string };
  innovation: ContextInnovationType;
  threadId: string;

  threadInfo: null | GetThreadInfoDTO = null;
  messagesList = new TableModel<GetThreadMessagesListOutDTO['messages'][0]>({ pageSize: 10 });

  form = new FormGroup({
    message: new UntypedFormControl('')
  }, { updateOn: 'blur' });

  isInnovator(): boolean { return this.stores.authentication.isInnovatorType(); }
  isNotInnovator(): boolean { return !this.stores.authentication.isInnovatorType(); }
  isAccessor(): boolean { return this.stores.authentication.isAccessorType(); }


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Messages', { showPage: false });

    this.selfUser = {
      id: this.stores.authentication.getUserId(),
      urlBasePath: this.stores.authentication.userUrlBasePath()
    };

    this.innovation = this.stores.context.getInnovation();
    this.threadId = this.activatedRoute.snapshot.params.threadId;

  }


  ngOnInit(): void {

    this.messagesList.setOrderBy('createdAt', 'descending');

    this.getThreadsList();

  }

  getThreadsList(): void {

    this.setPageStatus('LOADING');

    forkJoin([
      this.innovationsService.getThreadInfo(this.innovation.id, this.threadId),
      this.innovationsService.getThreadMessagesList(this.innovation.id, this.threadId, this.messagesList.getAPIQueryParams())
    ]).subscribe(([threadInfo, threadMessages]) => {

      this.threadInfo = threadInfo;
      this.messagesList.setData(threadMessages.messages, threadMessages.count);

      // Throw notification read dismiss.
      this.stores.context.dismissNotification(NotificationContextTypeEnum.THREAD, this.threadInfo.id);

      this.setPageStatus('READY');

    },
      () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      });
  }


  onTableOrder(column: string): void {
    this.messagesList.setOrderBy(column);
    this.getThreadsList();
  }

  onPageChange(event: { pageNumber: number }): void {
    this.messagesList.setPage(event.pageNumber);
    this.getThreadsList();
  }


  onSubmit(): void {

    const messageField = this.form.get('message')!;

    if (!messageField.value) {
      messageField.setErrors({ customError: true, message: 'A message is required' });
      messageField.markAsTouched();
      return;
    }

    this.setPageStatus('LOADING');

    const body = { message: this.form.get('message')?.value };

    this.innovationsService.createThreadMessage(this.innovation.id, this.threadId, body).subscribe(
      () => {

        messageField.setValue('');
        messageField.markAsPristine();

        this.setAlertSuccess('You have successfully sent a message', { message: 'All participants in this conversation will be notified.' });

        this.getThreadsList();

      },
      () => {
        this.setPageStatus('READY');
        this.setAlertUnknownError();
      });

  }

}
