import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormControl, FormGroup, FormEngineHelper } from '@app/base/forms';

import { EnvironmentInnovationType } from '@modules/stores/environment/environment.types';
import { NotificationContextTypeEnum } from '@modules/stores/environment/environment.enums';

import { getInnovationCommentsDTO } from '@modules/stores/innovation/innovation.models';


@Component({
  selector: 'shared-pages-innovation-comments-comments-list',
  templateUrl: './comments-list.component.html'
})
export class PageInnovationCommentsListComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' | 'assessment' = '';
  innovationId: string;

  innovation: EnvironmentInnovationType;
  currentCreatedOrder: 'asc' | 'desc';

  lengthLimitCharacters = 2000;
  commentsList: getInnovationCommentsDTO[];

  form = new FormGroup({}, { updateOn: 'blur' });
  formSubmittedFields: { [key: string]: string } = {};
  userId: string;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.setPageTitle('Comments');
    this.module = this.activatedRoute.snapshot.data.module;
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.environment.getInnovation();
    this.currentCreatedOrder = 'desc';
    this.userId = this.stores.authentication.getUserId();

    this.commentsList = [];

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'commentCreationSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'You have successfully created a comment',
          message: 'Everyone who is currently engaging with your innovation will be notified.'
        };
        break;
      case 'commentEditSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'You have successfully updated a comment',
          message: 'Everyone who is currently engaging with your innovation will be notified.'
        };
        break;
      default:
        break;
    }

  }


  allSectionsSubmitted(): boolean {
    return this.innovation.status !== 'CREATED';
  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(queryParams => this.onRouteChange(queryParams)),
      this.form.valueChanges.subscribe(() => Object.keys(this.formSubmittedFields).forEach(v => this.formSubmittedFields[v] = '')) // Clears all form input's errors.
    );

  }

  getCommentsList(): void {

    this.setPageStatus('LOADING');

    this.stores.innovation.getInnovationComments$(this.module, this.innovationId, this.currentCreatedOrder).subscribe(
      response => {
        this.commentsList = response;
        this.commentsList.forEach(item => {
          this.form.addControl(`${item.id}`, new FormControl('', CustomValidators.required('A reply text is required')));
          this.formSubmittedFields[item.id] = '';
        });

        const commentsToDismiss = this.commentsList.filter(c => c.notifications && c.notifications?.count > 0).map(c => c.id);
        const replies = this.commentsList.flatMap(c => c.replies);
        const repliesToDismiss = replies.filter(r => r.notifications && r.notifications?.count > 0).map(r => r.id);

        const toDismiss = [...commentsToDismiss, ...repliesToDismiss];
        for (const comment of toDismiss) {
          this.stores.environment.dismissNotification(NotificationContextTypeEnum.COMMENT, comment);
        }

        this.setPageStatus('READY');

      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch comments information',
          message: 'Please try again or contact us for further help'
        };
      });
  }


  getTeamTitle(userType: string): null | string {

    switch (userType) {
      case 'ASSESSMENT':
        return 'Initial needs assessment';
      case 'ACCESSOR':
        return 'Support assessment';
      case 'INNOVATOR':
        return null;
      default:
        return null;
    }

  }


  onRouteChange(queryParams: Params): void {

    if (!queryParams.createdOrder) {
      this.router.navigate([`/${this.module}/innovations/${this.innovationId}/comments`], { queryParams: { createdOrder: 'desc' } });
      return;
    }

    this.currentCreatedOrder = queryParams.createdOrder;

    this.getCommentsList();

  }



  onReply(commentId: string): void {

    if (!this.form.get(commentId)?.valid) {

      this.formSubmittedFields[commentId] = FormEngineHelper.getValidationMessage({ required: this.form.get(commentId)?.errors?.required }).message;

      setTimeout(() => {
        const e = document.getElementById(`comment-${commentId}`);
        if (e) { e.focus(); }
      });

      return;

    }

    const body = {
      comment: this.form.get(commentId)?.value,
      replyTo: commentId
    };

    this.stores.innovation.createInnovationComment$(this.module, this.innovationId, body).subscribe(
      () => {

        this.getCommentsList();
        this.form.get(commentId)?.setValue('');
        this.form.get(commentId)?.markAsUntouched();

        this.alert = {
          type: 'SUCCESS',
          title: 'You have successfully replied to the comment',
          setFocus: true
        };

      },
      () => {

        this.logger.error('Error fetching data');

        this.alert = {
          type: 'ERROR',
          title: 'An error occurred when creating an action',
          message: 'Please try again or contact us for further help',
          setFocus: true
        };

      });

  }

}
