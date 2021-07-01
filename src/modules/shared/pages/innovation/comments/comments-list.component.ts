import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CoreComponent, FormControl, FormGroup, Validators } from '@app/base';
import { FormEngineHelper } from '@app/base/forms';
import { RoutingHelper } from '@modules/core';
import { InnovationDataType } from '@modules/feature-modules/accessor/resolvers/innovation-data.resolver';

import { getInnovationCommentsDTO } from '@stores-module/innovation/innovation.models';

@Component({
  selector: 'shared-pages-innovation-comments-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss']
})
export class PageInnovationCommentsListComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' = '';
  innovationId: string;
  innovation: InnovationDataType;
  currentCreatedOrder: 'asc' | 'desc';

  commentsList: getInnovationCommentsDTO[];

  form = new FormGroup({});
  formSubmittedFields: { [key: string]: string } = {};

  summaryAlert: { type: '' | 'success' | 'error' | 'warning', title: string, message: string };


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.module = this.activatedRoute.snapshot.data.module;
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;
    this.currentCreatedOrder = 'desc';

    this.commentsList = [];

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'commentCreationSuccess':
        this.summaryAlert = {
          type: 'success',
          title: 'Your have successfully created a comment',
          message: 'Everyone who is currently engaging with your innovation will be notified.'
        };
        break;
      default:
        this.summaryAlert = { type: '', title: '', message: '' };
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
    this.stores.innovation.getInnovationComments$(this.module, this.innovationId, this.currentCreatedOrder).subscribe(
      response => {
        this.commentsList = response;

        this.commentsList.forEach(item => {
          this.form.addControl(`${item.id}`, new FormControl('', Validators.required));
          this.formSubmittedFields[item.id] = '';
        });

      },
      () => {
        this.logger.error('Error fetching data');
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
      this.formSubmittedFields[commentId] = FormEngineHelper.getValidationMessage({ required: this.form.get(commentId)?.errors?.required })
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

        this.summaryAlert = {
          type: 'success',
          title: 'Your have successfully replied to the comment',
          message: ''
        };

      },
      () => {

        this.logger.error('Error fetching data');

        this.summaryAlert = {
          type: 'error',
          title: 'An error occured when creating an action',
          message: 'Please, try again or contact us for further help'
        };

      });

  }

}
