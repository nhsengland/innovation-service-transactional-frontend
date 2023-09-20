import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationSectionEnum } from '@modules/stores/innovation';
import { getInnovationRecordConfig } from '@modules/stores/innovation/innovation-record/ir-versions.config';


@Component({
  selector: 'shared-pages-innovation-action-tracker-new',
  templateUrl: './action-tracker-new.component.html'
})
export class PageInnovationActionTrackerNewComponent extends CoreComponent {

  innovationId: string;

  sectionItems: { value: string, label: string }[] = [];

  form = new FormGroup({
    section: new FormControl<null | InnovationSectionEnum>(null, { validators: CustomValidators.required('Choose at least one section'), updateOn: 'change' }),
    description: new FormControl<string>('', CustomValidators.required('A description is required'))
  }, { updateOn: 'blur' });


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Request new action');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.sectionItems = getInnovationRecordConfig().reduce((sectionGroupAcc: { value: string, label: string }[], sectionGroup, i) => {
      return [
        ...sectionGroupAcc,
        ...sectionGroup.sections.reduce((sectionAcc: { value: string, label: string }[], section, j) => {
          return [...sectionAcc, ...[{ value: section.id, label: `${i + 1}.${j + 1} ${section.title}` }]];
        }, [])
      ];
    }, []);

    // Pre-selects section if it was provided.
    if (this.activatedRoute.snapshot.queryParams.section) {
      this.form.get('section')!.setValue(this.activatedRoute.snapshot.queryParams.section);
    }

    this.setPageStatus('READY');

  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      section: this.form.value.section!,
      description: this.form.value.description!
    };

    this.innovationsService.createAction(this.innovationId, body).subscribe({
      next: response => {
        this.setRedirectAlertSuccess('Action requested', { message: 'The innovator has been notified of your action request.' });
        this.redirectTo(`/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/tasks/${response.id}`);
      },
      error: () => this.setAlertError('An error occurred when creating an action. Please try again or contact us for further help')
    });

  }

}
