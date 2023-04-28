import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup, Validators } from '@app/base/forms';

import { ContextInnovationType } from '@modules/stores/context/context.types';

import { UserRoleEnum } from '@app/base/enums';
import { InnovationsService } from '@modules/shared/services/innovations.service';


@Component({
  selector: 'shared-pages-innovation-messages-thread-new',
  templateUrl: './thread-new.component.html'
})
export class PageInnovationThreadNewComponent extends CoreComponent implements OnInit {

  selfUser: { id: string, urlBasePath: string };
  innovation: ContextInnovationType;

  form = new FormGroup({
    subject: new UntypedFormControl('', [CustomValidators.required('A subject is required'), Validators.maxLength(100)]),
    message: new UntypedFormControl('', CustomValidators.required('A message is required'))
  }, { updateOn: 'blur' });

  // Flags
  isInnovatorType: boolean;
  isAccessorType: boolean;

  constructor(
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Start a new conversation');

    this.selfUser = {
      id: this.stores.authentication.getUserId(),
      urlBasePath: this.stores.authentication.userUrlBasePath()
    };

    this.innovation = this.stores.context.getInnovation();

    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
  }

  ngOnInit(): void {

    this.setPageStatus('READY');

  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      subject: this.form.get('subject')?.value,
      message: this.form.get('message')?.value
    };

    this.innovationsService.createThread(this.innovation.id, body).subscribe({
      next: () => {

        this.setRedirectAlertSuccess(
          'You have successfully started a conversation',
          { message: this.stores.authentication.getUserType() === UserRoleEnum.INNOVATOR ? 'Everyone who is currently supporting your innovations will be notified.' : 'The innovator will be notified.' }
        );

        this.redirectTo(`/${this.selfUser.urlBasePath}/innovations/${this.innovation.id}/threads`)

      },
      error: () => this.setAlertUnknownError()
    });
  }

}
