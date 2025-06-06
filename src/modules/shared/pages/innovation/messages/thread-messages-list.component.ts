import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, switchMap } from 'rxjs';

import { CoreComponent } from '@app/base';
import { CustomValidators, FileTypes, FormGroup } from '@app/base/forms';
import { TableModel } from '@app/base/models';

import { ContextInnovationType, InnovationStatusEnum } from '@modules/stores';

import { FileUploadService } from '@modules/shared/services/file-upload.service';
import {
  GetThreadFollowersDTO,
  GetThreadInfoDTO,
  GetThreadMessagesListOutDTO,
  InnovationsService,
  ThreadAvailableRecipientsDTO,
  UploadThreadMessageDocumentType
} from '@modules/shared/services/innovations.service';
import { omit } from 'lodash';

@Component({
  selector: 'shared-pages-innovation-messages-thread-messages-list',
  templateUrl: './thread-messages-list.component.html'
})
export class PageInnovationThreadMessagesListComponent extends CoreComponent implements OnInit {
  selfUser: { id: string; urlBasePath: string; roleId: string; role: string };
  innovation: ContextInnovationType;
  threadId: string;

  threadInfo: null | GetThreadInfoDTO = null;
  messagesList = new TableModel<GetThreadMessagesListOutDTO['messages'][0] & { displayUserName: string }>({
    pageSize: 10
  });
  organisationUnits: ThreadAvailableRecipientsDTO;

  showFollowersHideStatus: string | null = null;
  threadFollowers: GetThreadFollowersDTO['followers'] | null = null;
  showFollowersText: 'Show list' | 'Hide list' = 'Show list';
  followerNumberText: 'recipient' | 'recipients' = 'recipient';

  threadsLink = '';
  showAddRecipientsLink = false;

  form = new FormGroup(
    {
      message: new FormControl<string>('', CustomValidators.required('A message is required')),
      file: new FormControl<File | null>(null, [
        CustomValidators.emptyFileValidator(),
        CustomValidators.maxFileSizeValidator(20)
      ]),
      fileName: new FormControl<string>('')
    },
    { updateOn: 'blur' }
  );

  configInputFile = {
    acceptedFiles: [FileTypes.CSV, FileTypes.XLSX, FileTypes.DOCX, FileTypes.PDF],
    maxFileSize: 20 // In Mb.
  };

  // Flags
  isFollower = false;
  isInAssessment: boolean;
  canCreateMessage: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private fileUploadService: FileUploadService
  ) {
    super();
    this.setPageTitle('Messages', { showPage: false });

    this.selfUser = {
      id: this.ctx.user.getUserId(),
      urlBasePath: this.ctx.user.userUrlBasePath(),
      roleId: this.ctx.user.getUserContext()?.roleId ?? '',
      role: this.ctx.user.getUserContext()?.type ?? ''
    };

    this.innovation = this.ctx.innovation.info();
    this.threadId = this.activatedRoute.snapshot.params.threadId;
    const documentAction = this.activatedRoute.snapshot.queryParams.action;

    this.threadsLink = `/${this.selfUser.urlBasePath}/innovations/${this.innovation.id}/threads`;

    const previousUrl = this.ctx.layout.previousUrl();

    this.setBackLink(
      'Go back',
      previousUrl
        ? previousUrl?.endsWith('recipients')
          ? this.threadsLink
          : documentAction
            ? this.threadsLink
            : previousUrl!
        : this.threadsLink
    );

    this.organisationUnits = [];

    // Flags
    this.isInAssessment = this.innovation.status.includes('ASSESSMENT');

    this.canCreateMessage = !this.ctx.user.isAdmin() && (!this.ctx.user.isAccessorType() || !this.isInAssessment);
  }

  ngOnInit(): void {
    this.messagesList.setOrderBy('createdAt', 'descending');
    this.getThreadsList();
  }

  getThreadsList(): void {
    this.setPageStatus('LOADING');

    const subscriptions: {
      threadInfo: Observable<GetThreadInfoDTO>;
      threadFollowers: Observable<GetThreadFollowersDTO>;
      threadMessages: Observable<GetThreadMessagesListOutDTO>;
      threadAvailableRecipients?: Observable<ThreadAvailableRecipientsDTO>;
    } = {
      threadInfo: this.innovationsService.getThreadInfo(this.innovation.id, this.threadId),
      threadFollowers: this.innovationsService.getThreadFollowers(this.innovation.id, this.threadId),
      threadMessages: this.innovationsService.getThreadMessagesList(
        this.innovation.id,
        this.threadId,
        this.messagesList.getAPIQueryParams()
      )
    };

    if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS && !this.ctx.user.isAdmin()) {
      subscriptions.threadAvailableRecipients = this.innovationsService.getThreadAvailableRecipients(
        this.innovation.id
      );
    }

    forkJoin(subscriptions).subscribe({
      next: response => {
        this.threadInfo = response.threadInfo;
        this.threadFollowers = response.threadFollowers.followers.filter(follower => !follower.isLocked); //remove locked users;
        this.isFollower = this.threadFollowers.some(follower => follower.id === this.selfUser.id);

        this.followerNumberText = this.threadFollowers.length > 1 ? 'recipients' : 'recipient';

        const threadMessages = response.threadMessages.messages.map(message => {
          return {
            ...message,
            displayUserName: `${message.createdBy.name}, ${
              message.createdBy.organisationUnit?.name
                ? message.createdBy.organisationUnit?.name
                : message.createdBy.role === 'ASSESSMENT'
                  ? 'Needs assessment'
                  : message.createdBy.isOwner
                    ? 'Innovator owner'
                    : 'Innovator'
            }`
          };
        });

        this.messagesList.setData(threadMessages, response.threadMessages.count);

        if (response.threadAvailableRecipients) {
          this.organisationUnits = response.threadAvailableRecipients;

          // Filter out the user unit, if accessor.
          if (this.ctx.user.isAccessorType()) {
            this.organisationUnits = this.organisationUnits.filter(
              item => item.organisation.unit.id !== this.ctx.user.getUserContext()?.organisationUnit?.id
            );
          }

          // Checks if there's any accessor that's not a follower
          this.showAddRecipientsLink = this.organisationUnits
            .reduce((acc: string[], item) => [...acc, ...item.recipients.map(a => a.roleId)], [])
            .some(roleId => !this.threadFollowers?.map(follower => follower.role.id).includes(roleId));
        }

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  onShowParticipantsClick() {
    if (this.showFollowersHideStatus !== 'opened') {
      this.showFollowersHideStatus = 'opened';
      this.showFollowersText = 'Hide list';
    } else {
      this.showFollowersHideStatus = 'closed';
      this.showFollowersText = 'Show list';
    }
  }

  onUnfollowMessageThreadClick(): void {
    this.innovationsService.deleteThreadFollower(this.innovation.id, this.threadId, this.selfUser.roleId).subscribe({
      next: () => {
        this.setAlertSuccess('You have unfollowed this message thread', {
          message: 'You will not be notified about new replies.'
        });
        this.getThreadsList();
      },
      error: () => {
        this.setPageStatus('READY');
        this.setAlertUnknownError();
      }
    });
  }

  onFollowMessageThreadClick(): void {
    const body = {
      followerUserRoleIds: [this.selfUser.roleId]
    };

    this.innovationsService.addThreadFollowers(this.innovation.id, this.threadId, body).subscribe({
      next: () => {
        this.setAlertSuccess('You have followed this message thread', {
          message: 'You will be notified about new replies.'
        });
        this.getThreadsList();
      },
      error: () => {
        this.setPageStatus('READY');
        this.setAlertUnknownError();
      }
    });
  }

  checkIfUnfollowed(userId: string): boolean {
    return this.threadFollowers?.some(follower => follower.id === userId) ?? false;
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
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.setPageStatus('LOADING');

    const file = this.form.value.file;

    let body: UploadThreadMessageDocumentType = { message: this.form.value.message! };

    if (file) {
      const httpUploadBody = { userId: this.ctx.user.getUserId(), innovationId: this.innovation.id };

      this.fileUploadService
        .uploadFile(httpUploadBody, file)
        .pipe(
          switchMap(response => {
            const fileData = omit(response, 'url');
            body = {
              ...body,
              file: {
                name: this.form.value.fileName!,
                file: fileData
              }
            };
            return this.innovationsService.createThreadMessage(this.innovation.id, this.threadId, body);
          })
        )
        .subscribe({
          next: () => {
            this.resetForm();

            this.setAlertSuccess('You have successfully sent a message', {
              message: 'All participants in this conversation will be notified.'
            });

            this.getThreadsList();
          },
          error: () => {
            this.setPageStatus('READY');
            this.setAlertUnknownError();
          }
        });
    } else {
      this.createThreadMessage(body);
    }
  }

  createThreadMessage(body: UploadThreadMessageDocumentType) {
    this.innovationsService.createThreadMessage(this.innovation.id, this.threadId, body).subscribe({
      next: () => {
        this.resetForm();

        this.setAlertSuccess('You have successfully sent a message', {
          message: 'All participants in this conversation will be notified.'
        });

        this.getThreadsList();
      },
      error: () => {
        this.setPageStatus('READY');
        this.setAlertUnknownError();
      }
    });
  }

  resetForm() {
    this.form.reset({
      message: '',
      file: null,
      fileName: ''
    });
  }
}
