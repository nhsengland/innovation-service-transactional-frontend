import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { TableModel } from '@app/base/models';

import { EnvironmentInnovationType } from '@modules/stores/environment/environment.types';

import { GetThreadInfoDTO, GetThreadMessagesListOutDTO, InnovationsService } from '@modules/shared/services/innovations.service';


@Component({
  selector: 'shared-pages-innovation-messages-thread-messages-list',
  templateUrl: './thread-messages-list.component.html'
})
export class PageInnovationThreadMessagesListComponent extends CoreComponent implements OnInit {

  selfUser: { id: string, urlBasePath: string };
  innovation: EnvironmentInnovationType;
  threadId: string;

  threadInfo: null | GetThreadInfoDTO = null;
  messagesList = new TableModel<GetThreadMessagesListOutDTO['messages'][0]>();

  form = new FormGroup({
    message: new FormControl('')
  }, { updateOn: 'blur' });

  isInnovator(): boolean { return this.stores.authentication.isInnovatorType(); }
  isNotInnovator(): boolean { return !this.stores.authentication.isInnovatorType(); }
  isAccessor(): boolean { return this.stores.authentication.isAccessorType(); }
  isInnovationSubmitted(): boolean { return this.innovation.status !== 'CREATED'; }


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Messages');

    this.selfUser = {
      id: this.stores.authentication.getUserId(),
      urlBasePath: this.stores.authentication.userUrlBasePath()
    };

    console.log(this.stores.authentication.getUserId());
    this.innovation = this.stores.environment.getInnovation();
    this.threadId = this.activatedRoute.snapshot.params.threadId;

    // switch (this.activatedRoute.snapshot.queryParams.alert) {
    //   case 'commentCreationSuccess':
    //     this.alert = {
    //       type: 'SUCCESS',
    //       title: 'You have successfully created a comment',
    //       message: 'Everyone who is currently engaging with your innovation will be notified.'
    //     };
    //     break;
    //   case 'commentEditSuccess':
    //     this.alert = {
    //       type: 'SUCCESS',
    //       title: 'You have successfully updated a comment',
    //       message: 'Everyone who is currently engaging with your innovation will be notified.'
    //     };
    //     break;
    //   default:
    //     break;
    // }

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
      this.setPageStatus('READY');
    },
      () => {
        this.setPageStatus('ERROR');
        this.setAlertDataLoadError();
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

      // setTimeout(() => {
      //   const e = document.getElementById(`comment-${commentId}`);
      //   if (e) { e.focus(); }
      // });
      messageField.markAsTouched();
      return;

    }

    this.setPageStatus('LOADING');

    const body = { message: this.form.get('message')?.value };

    this.innovationsService.createThreadMessage(this.innovation.id, this.threadId, body).subscribe(
      () => {

        messageField.setValue('');
        messageField.markAsPristine();
        // this.form.get('message')!.markAsUntouched();

        this.setAlertSuccess('You have successfully created a new message');

        this.getThreadsList();

      },
      () => {
        this.setPageStatus('READY');
        this.setAlertUnknownError();
      });

  }

}
