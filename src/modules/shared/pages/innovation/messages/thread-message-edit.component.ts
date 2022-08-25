import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormControl, FormGroup } from '@app/base/forms';
import { EnvironmentInnovationType } from '@modules/stores/environment/environment.types';

import { InnovationsService } from '@modules/shared/services/innovations.service';


@Component({
  selector: 'shared-pages-innovation-messages-thread-message-edit',
  templateUrl: './thread-message-edit.component.html'
})
export class PageInnovationThreadMessageEditComponent extends CoreComponent implements OnInit {

  selfUser: { id: string, urlBasePath: string };
  innovation: EnvironmentInnovationType;
  threadId: string;
  messageId: string;

  form = new FormGroup({
    message: new FormControl('', CustomValidators.required('A message is required'))
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

    this.innovation = this.stores.environment.getInnovation();
    this.threadId = this.activatedRoute.snapshot.params.threadId;
    this.messageId = this.activatedRoute.snapshot.params.messageId;

  }

  ngOnInit(): void {

    this.innovationsService.getThreadMessageInfo(this.innovation.id, this.threadId, this.messageId).subscribe(
      response => {

        this.form.get('message')!.setValue(response.message);
        this.setPageStatus('READY');

      },
      () => {
        this.setPageStatus('ERROR');
        this.setAlertDataLoadError();
      });
  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.innovationsService.editThreadMessage(this.innovation.id, this.threadId, this.messageId, this.form.value).subscribe(
      () => this.redirectTo(`/${this.selfUser.urlBasePath}/innovations/${this.innovation.id}/threads/${this.threadId}`, { alert: 'messageEditSuccess' }),
      () => this.setAlertUnknownError()
    );

  }

}
