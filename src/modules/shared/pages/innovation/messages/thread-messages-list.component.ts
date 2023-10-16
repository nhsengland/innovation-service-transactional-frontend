import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, switchMap } from 'rxjs';

import { CoreComponent } from '@app/base';
import { NotificationContextTypeEnum } from '@app/base/enums';
import { CustomValidators, FileTypes, FormGroup } from '@app/base/forms';
import { TableModel } from '@app/base/models';

import { ContextInnovationType } from '@modules/stores/context/context.types';

import { GetThreadInfoDTO, GetThreadMessagesListOutDTO, GetThreadFollowersDTO, InnovationsService, UploadThreadMessageDocumentType } from '@modules/shared/services/innovations.service';
import { InnovationSupportsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { FileUploadService } from '@modules/shared/services/file-upload.service';
import { omit } from 'lodash';


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
  engagingOrganisationUnits: InnovationSupportsListDTO;

  showFollowersHideStatus: string | null = null;
  threadFollowers: GetThreadFollowersDTO['followers'] | null = null;
  showFollowersText: 'Show list' | 'Hide list' = 'Show list';
  followerNumberText: 'recipient' | 'recipients' = 'recipient';

  showAddRecipientsLink = false;

  form = new FormGroup({
    message: new FormControl<string>('', CustomValidators.required('A message is required')),
    file: new FormControl<File | null>(null),
    fileName: new FormControl<string>('', [Validators.maxLength(100)]),
  }, { updateOn: 'blur' });

  configInputFile = {
    acceptedFiles: [FileTypes.CSV, FileTypes.XLSX, FileTypes.DOCX, FileTypes.PDF],
    maxFileSize: 20 // In Mb.
  }

  // Flags
  isInnovatorType: boolean;
  isAccessorType: boolean;
  isAdmin: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private fileUploadService: FileUploadService
  ) {

    super();
    this.setPageTitle('Messages', { showPage: false });
    this.setBackLink();

    this.selfUser = {
      id: this.stores.authentication.getUserId(),
      urlBasePath: this.stores.authentication.userUrlBasePath(),
      role: this.stores.authentication.getUserContextInfo()?.type ?? ''
    };

    this.innovation = this.stores.context.getInnovation();
    this.threadId = this.activatedRoute.snapshot.params.threadId;

    this.engagingOrganisationUnits = [];

    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAdmin = this.stores.authentication.isAdminRole();

  }


  ngOnInit(): void {

    this.form.get('file')?.valueChanges.subscribe(
      value => {
        if (value) {
          this.form.get('fileName')?.setValidators([CustomValidators.required('A name is required'), Validators.maxLength(100)]);
          this.form.get('fileName')?.updateValueAndValidity();
        } else {
          this.form.get('fileName')?.clearValidators();
          this.form.get('fileName')?.updateValueAndValidity();
        }
      }
    );

    this.messagesList.setOrderBy('createdAt', 'descending');
    this.getThreadsList();

  }

  getThreadsList(): void {

    this.setPageStatus('LOADING');

    const subscriptions: {
      threadInfo: Observable<GetThreadInfoDTO>,
      threadFollowers:Observable<GetThreadFollowersDTO>,
      threadMessages: Observable<GetThreadMessagesListOutDTO>,
      supports?: Observable<InnovationSupportsListDTO>
    } = {
      threadInfo: this.innovationsService.getThreadInfo(this.innovation.id, this.threadId),
      threadFollowers: this.innovationsService.getThreadFollowers(this.innovation.id, this.threadId),
      threadMessages: this.innovationsService.getThreadMessagesList(this.innovation.id, this.threadId, this.messagesList.getAPIQueryParams()),
    };

    if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS && !this.stores.authentication.isAdminRole()) {
      subscriptions.supports = this.innovationsService.getInnovationSupportsList(this.innovation.id, true);
    }

    forkJoin(subscriptions).subscribe({
      next: (response) => {

        this.threadInfo = response.threadInfo;
        this.threadFollowers= response.threadFollowers.followers.filter(follower => !follower.isLocked); //remove locked users;

        this.followerNumberText = this.threadFollowers.length > 1 ? 'recipients' : 'recipient';


        this.messagesList.setData(response.threadMessages.messages, response.threadMessages.count);
        // Throw notification read dismiss.
        this.stores.context.dismissNotification(this.innovation.id, { contextTypes: [NotificationContextTypeEnum.THREAD], contextIds: [this.threadInfo.id] });

        if (response.supports) {

          // Engaging organisation units except the user unit, if accessor.
          this.engagingOrganisationUnits = response.supports.filter(item => item.status === InnovationSupportStatusEnum.ENGAGING);

          if (this.stores.authentication.isAccessorType()) {
            this.engagingOrganisationUnits = this.engagingOrganisationUnits.filter(item => item.organisation.unit.id !== this.stores.authentication.getUserContextInfo()?.organisationUnit?.id);
          }

          // Keep only active engaging accessors
          this.engagingOrganisationUnits = this.engagingOrganisationUnits.map(item => {
            return {
              ...item,
              engagingAccessors: item.engagingAccessors.filter(accessor => accessor.isActive)
            }
          });

          // Checks if there's any engaging accessor that's not a follower
          this.showAddRecipientsLink = this.engagingOrganisationUnits.reduce((acc: string[], item) => [...acc, ...item.engagingAccessors.map(a => a.userRoleId)], []).some(userRoleId => !this.threadFollowers?.map(follower => follower.role.id).includes(userRoleId));

        }

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

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.setPageStatus('LOADING');

    const file = this.form.value.file;

    let body: UploadThreadMessageDocumentType = { message: this.form.value.message! };

    if (file) {

      const httpUploadBody = { userId: this.stores.authentication.getUserId(), innovationId: this.innovation.id };

      this.fileUploadService.uploadFile(httpUploadBody, file).pipe(
        switchMap(response => {
          const fileData = omit(response, 'url');
          body = {
            ...body,
            file: {
              name: this.form.value.fileName!,
              file: fileData
            }
          }
          return this.innovationsService.createThreadMessage(this.innovation.id, this.threadId, body);
        })).subscribe({
          next: () => {

            this.form.reset();
            this.form.markAsPristine();

            this.setAlertSuccess('You have successfully sent a message', { message: 'All participants in this conversation will be notified.' });

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

        this.form.reset();
        this.form.markAsPristine();

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
