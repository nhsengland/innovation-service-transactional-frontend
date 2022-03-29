import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { AlertType } from '@app/base/models';
import { INNOVATION_SECTIONS } from '@modules/stores/innovation/innovation.config';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-action-tracker-new',
  templateUrl: './action-tracker-new.component.html'
})
export class InnovationActionTrackerNewComponent extends CoreComponent {

  innovationId: string;

  alert: AlertType = { type: null };

  sectionItems: { value: string, label: string }[] = [];

  form = new FormGroup({
    section: new FormControl('', { validators: CustomValidators.required('Choose at least one section'), updateOn: 'change' }),
    description: new FormControl('', CustomValidators.required('A description is required'))
  }, { updateOn: 'blur' });


  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();
    this.setPageTitle('Request new action');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.sectionItems = INNOVATION_SECTIONS.reduce((sectionGroupAcc: { value: string, label: string }[], sectionGroup, i) => {
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

  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.accessorService.createAction(this.innovationId, this.form.value).subscribe(
      response => {
        this.redirectTo(`/accessor/innovations/${this.innovationId}/action-tracker/${response.id}`, { alert: 'actionCreationSuccess' });
      },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'An error occurred when creating an action',
          message: 'Please try again or contact us for further help',
          setFocus: true
        };
      }
    );

  }

}
