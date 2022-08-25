import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormControl, FormGroup, Validators } from '@app/base/forms';

import { EnvironmentInnovationType } from '@modules/stores/environment/environment.types';

import { InnovationsService } from '@modules/shared/services/innovations.service';


@Component({
  selector: 'shared-pages-innovation-messages-thread-new',
  templateUrl: './thread-new.component.html'
})
export class PageInnovationThreadNewComponent extends CoreComponent implements OnInit {

  selfUser: { id: string, urlBasePath: string };
  innovation: EnvironmentInnovationType;

  form = new FormGroup({
    subject: new FormControl('', [CustomValidators.required('A subject is required'), Validators.maxLength(100)]),
    message: new FormControl('', CustomValidators.required('A message is required'))
  }, { updateOn: 'blur' });

  isInnovator(): boolean { return this.stores.authentication.isInnovatorType(); }
  isNotInnovator(): boolean { return !this.stores.authentication.isInnovatorType(); }


  constructor(
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Start a new conversation');

    this.selfUser = {
      id: this.stores.authentication.getUserId(),
      urlBasePath: this.stores.authentication.userUrlBasePath()
    };

    this.innovation = this.stores.environment.getInnovation();

  }

  ngOnInit(): void {

    this.setPageStatus('READY');

  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.innovationsService.createThread(this.innovation.id, this.form.value).subscribe(
      () => this.redirectTo(`/${this.selfUser.urlBasePath}/innovations/${this.innovation.id}/threads`, { alert: 'threadCreationSuccess' }),
      () => this.setAlertUnknownError()
    );
  }

}
