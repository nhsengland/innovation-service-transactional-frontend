import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormControl, FormGroup } from '@app/base/forms';
import { ContextInnovationType } from '@modules/stores';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'shared-pages-innovation-messages-thread-message-edit',
  templateUrl: './thread-message-edit.component.html'
})
export class PageInnovationThreadMessageEditComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  threadId: string;
  messageId: string;

  showLinkForm = false;
  linkForm = new FormGroup(
    {
      linkText: new FormControl<string>('', CustomValidators.required('Link text is required')),
      linkUrl: new FormControl<string>('', [
        CustomValidators.required('Link URL is required'),
        CustomValidators.urlFormatValidator({ message: 'Enter a valid URL' })
      ])
    },
    { updateOn: 'blur' }
  );

  form = new FormGroup({
    message: new UntypedFormControl('', CustomValidators.required('A message is required'))
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();
    this.setPageTitle('Edit message');

    this.innovation = this.ctx.innovation.info();
    this.threadId = this.activatedRoute.snapshot.params.threadId;
    this.messageId = this.activatedRoute.snapshot.params.messageId;
  }

  toggleLinkForm(): void {
    this.showLinkForm = !this.showLinkForm;
    if (!this.showLinkForm) {
      this.linkForm.reset();
    }
  }

  onInsertLink(): void {
    if (!this.linkForm.valid) {
      this.linkForm.markAllAsTouched();
      return;
    }

    const text = this.linkForm.value.linkText || '';
    const url = (this.linkForm.value.linkUrl || '').trim();
    const markdownLink = `[${text}](${url})`;

    const currentMessage = this.form.value.message || '';
    const newMessage = currentMessage.length > 0 ? `${currentMessage} ${markdownLink}` : markdownLink;

    this.form.patchValue({ message: newMessage });
    this.toggleLinkForm();
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
        this.redirectTo(
          `/${this.ctx.user.userUrlBasePath()}/innovations/${this.innovation.id}/threads/${this.threadId}`
        );
      },
      error: () => this.setAlertUnknownError()
    });
  }
}
