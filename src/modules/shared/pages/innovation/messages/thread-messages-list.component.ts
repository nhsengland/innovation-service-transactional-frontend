import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { NotificationContextTypeEnum } from '@app/base/enums';
import { FormGroup } from '@app/base/forms';
import { TableModel } from '@app/base/models';

import { ContextInnovationType } from '@modules/stores/context/context.types';

import { GetThreadInfoDTO, GetThreadMessagesListOutDTO, GetThreadFollowersDTO, InnovationsService } from '@modules/shared/services/innovations.service';


@Component({
  selector: 'shared-pages-innovation-messages-thread-messages-list',
  templateUrl: './thread-messages-list.component.html'
})
export class PageInnovationThreadMessagesListComponent extends CoreComponent implements OnInit {

  selfUser: { id: string, urlBasePath: string, role: string };
  innovation: ContextInnovationType;
  threadId: string;

  threadInfo: null | GetThreadInfoDTO = null;
  messagesList = new TableModel<GetThreadMessagesListOutDTO['messages'][0]>({ pageSize: 10 });

  showFollowersHideStatus: string | null = null;
  threadFollowers: GetThreadFollowersDTO | null = null;
  showFollowersText: 'Show list' | 'Hide list' = 'Show list';
  followerNumberText: 'participant' | 'participants' = 'participant';

  form = new FormGroup({
    message: new FormControl<string>('')
  }, { updateOn: 'blur' });

  // Flags
  isInnovatorType: boolean;
  isAccessorType: boolean;
  isAdmin: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Messages', { showPage: false });

    this.selfUser = {
      id: this.stores.authentication.getUserId(),
      urlBasePath: this.stores.authentication.userUrlBasePath(),
      role: this.stores.authentication.getUserContextInfo()?.type ?? ''
    };

    this.innovation = this.stores.context.getInnovation();
    this.threadId = this.activatedRoute.snapshot.params.threadId;

    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAdmin = this.stores.authentication.isAdminRole();

  }


  ngOnInit(): void {

    this.messagesList.setOrderBy('createdAt', 'descending');
    this.getThreadsList();

  }

  getThreadsList(): void {

    this.setPageStatus('LOADING');

    forkJoin([
      this.innovationsService.getThreadInfo(this.innovation.id, this.threadId),
      this.innovationsService.getThreadFollowers(this.innovation.id, this.threadId),
      this.innovationsService.getThreadMessagesList(this.innovation.id, this.threadId, this.messagesList.getAPIQueryParams())
    ]).subscribe({
      next: ([threadInfo, threadFollowers, threadMessages]) => {

        this.threadInfo = threadInfo;
        this.threadFollowers= threadFollowers;

        this.followerNumberText = this.threadFollowers.followers.length > 1 ? 'participants' : 'participant';

        this.messagesList.setData(threadMessages.messages, threadMessages.count);
        // Throw notification read dismiss.
        this.stores.context.dismissNotification(this.innovation.id, { contextTypes: [NotificationContextTypeEnum.THREAD], contextIds: [this.threadInfo.id] });

        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  };

  onShowParticipantsClick() {
    if (this.showFollowersHideStatus!== 'opened') {

      this.showFollowersHideStatus= 'opened';
      this.showFollowersText = 'Hide list';

    } else {
      this.showFollowersHideStatus= 'closed';
      this.showFollowersText = 'Show list';
    }
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

    const body = { message: messageField.value };

    this.innovationsService.createThreadMessage(this.innovation.id, this.threadId, body).subscribe({
      next: () => {

        messageField.setValue('');
        messageField.markAsPristine();

        this.setAlertSuccess('You have successfully sent a message', { message: 'All participants in this conversation will be notified.' });

        this.getThreadsList();

      },
      error: () => {
        this.setPageStatus('READY');
        this.setAlertUnknownError();
      }
    });

  }

}
