import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup } from '@app/base/forms';
import { ContextInnovationType } from '@modules/stores';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'shared-pages-innovation-messages-thread-message-edit',
  templateUrl: './thread-message-edit.component.html'
})
export class PageInnovationThreadMessageEditComponent extends CoreComponent implements OnInit {
  selfUser: { id: string; urlBasePath: string };
  innovation: ContextInnovationType;
  threadId: string;
  messageId: string;

  form = new FormGroup({
    message: new UntypedFormControl('', CustomValidators.required('A message is required'))
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();
    this.setPageTitle('Edit message');

    this.selfUser = {
      id: this.stores.authentication.getUserId(),
      urlBasePath: this.stores.authentication.userUrlBasePath()
    };

    this.innovation = this.ctx.innovation.info();
    this.threadId = this.activatedRoute.snapshot.params.threadId;
    this.messageId = this.activatedRoute.snapshot.params.messageId;
  }

  ngOnInit(): void {
    this.innovationsService
      .getThreadMessageInfo(this.innovation.id, this.threadId, this.messageId)
      .subscribe(response => {
        this.form.get('message')!.setValue(response.message);
        this.setPageStatus('READY');
      });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      message: this.form.get('message')?.value
    };

    this.innovationsService.editThreadMessage(this.innovation.id, this.threadId, this.messageId, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('You have successfully updated a message');
        this.redirectTo(`/${this.selfUser.urlBasePath}/innovations/${this.innovation.id}/threads/${this.threadId}`);
      },
      error: () => this.setAlertUnknownError()
    });
  }
}
