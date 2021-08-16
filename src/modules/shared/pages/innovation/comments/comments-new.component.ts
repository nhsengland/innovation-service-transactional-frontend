import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormControl, FormGroup, Validators } from '@app/base';


@Component({
  selector: 'shared-pages-innovation-comments-comments-new',
  templateUrl: './comments-new.component.html'
})
export class PageInnovationCommentsNewComponent extends CoreComponent {

  module: '' | 'innovator' | 'accessor' = '';
  innovationId: string;

  form = new FormGroup({
    comment: new FormControl('', Validators.required)
  });

  summaryAlert: { type: '' | 'success' | 'error' | 'warning', title: string, message: string };

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.setPageTitle('New comment');

    this.module = this.activatedRoute.snapshot.data.module;
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.summaryAlert = { type: '', title: '', message: '' };

  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = { comment: this.form.get('comment')?.value };

    this.stores.innovation.createInnovationComment$(this.module, this.innovationId, body).subscribe(
      () => {
        this.redirectTo(`/${this.module}/innovations/${this.innovationId}/comments`, { alert: 'commentCreationSuccess' });
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
