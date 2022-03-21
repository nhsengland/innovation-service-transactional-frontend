import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { AlertType } from '@app/base/models';

@Component({
  selector: 'shared-pages-innovation-comments-comments-edit',
  templateUrl: './comments-edit.component.html'
})
export class PageInnovationCommentsEditComponent extends CoreComponent {

  module: '' | 'innovator' | 'accessor' = '';
  subModule: 'comment' | 'reply';
  innovationId: string;
  commentId: string;
  currentCreatedOrder: 'asc' | 'desc' = 'desc';
  userId: string;
  replyId: string;
  alert: AlertType = { type: null };

  form = new FormGroup({
    message: new FormControl('', CustomValidators.required('A message is required'))
  });


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.subModule = this.activatedRoute.snapshot.data.subModule;
    this.setPageTitle(`Edit ${this.subModule}`);

    this.module = this.activatedRoute.snapshot.data.module;
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.commentId = this.activatedRoute.snapshot.params.commentId;
    this.replyId = this.activatedRoute.snapshot.params.replyId;
    this.userId = this.stores.authentication.getUserId();
  }

  ngOnInit(): void {
    
    this.setPageStatus('LOADING');
    
    this.getComment();
  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = { comment: this.form.get('message')?.value };
    const id = (this.subModule === 'comment') ? this.commentId : this.replyId;
    this.stores.innovation.updateInnovationComment$(this.module, this.innovationId, body, id).subscribe(
      () => {
        this.redirectTo(`/${this.module}/innovations/${this.innovationId}/comments`, { alert: 'commentEditSuccess' });
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

  getComment(): void {

    this.stores.innovation.getInnovationComments$(this.module, this.innovationId, this.currentCreatedOrder).subscribe(
      response => {
        const comment = response.filter(c => c.id === this.commentId)[0];
        this.form.patchValue({ 
          message: (this.subModule === 'comment') ? comment.message : comment?.replies.filter((r) => r.id === this.replyId)[0].message
        });

        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch comments information',
          message: 'Please try again or contact us for further help'
        };
    })
  }

}
