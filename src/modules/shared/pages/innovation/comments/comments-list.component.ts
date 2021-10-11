import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { CustomValidators, FormEngineHelper } from '@app/base/forms';
import { AlertType } from '@app/base/models';
import { RoutingHelper } from '@modules/core';

import { NotificationContextType, NotificationService } from '@modules/shared/services/notification.service';

import { getInnovationCommentsDTO, InnovationDataResolverType } from '@stores-module/innovation/innovation.models';


@Component({
  selector: 'shared-pages-innovation-comments-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss']
})
export class PageInnovationCommentsListComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' = '';
  innovationId: string;

  alert: AlertType = { type: null };

  innovation: InnovationDataResolverType;
  currentCreatedOrder: 'asc' | 'desc';

  commentsList: getInnovationCommentsDTO[];

  form = new FormGroup({});
  formSubmittedFields: { [key: string]: string } = {};


  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
  ) {

    super();
    this.setPageTitle('Comments');

    this.module = this.activatedRoute.snapshot.data.module;
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;
    this.currentCreatedOrder = 'desc';

    this.commentsList = [];

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'commentCreationSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'You have successfully created a comment',
          message: 'Everyone who is currently engaging with your innovation will be notified.'
        };
        break;
      default:
        break;
    }

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
          this.notificationService.dismissNotification(comment, NotificationContextType.COMMENT).subscribe();
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
