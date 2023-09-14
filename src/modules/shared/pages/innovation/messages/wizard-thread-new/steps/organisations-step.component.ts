import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';

import { OrganisationsStepInputType, OrganisationsStepOutputType } from './organisations-step.types';


@Component({
  selector: 'shared-pages-innovation-messages-wizard-thread-new-organisations-step',
  templateUrl: './organisations-step.component.html'
})
export class WizardInnovationThreadNewOrganisationsStepComponent extends CoreComponent implements WizardStepComponentType<OrganisationsStepInputType, OrganisationsStepOutputType>, OnInit {

  @Input() title = '';
  @Input() data: OrganisationsStepInputType = {
    innovation: { id: '' },
    organisationUnits: [],
    selectedOrganisationUnits: []
  };
  @Output() cancelEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();

  leadText: string = '';

  validationMessage = this.stores.authentication.isInnovatorType() ? 'Select an organisation you want to be notified about your message' : this.stores.authentication.isAssessmentType() ? "Select organisations, or select 'No, I only want to notify the innovator about this message'" : "Select other organisations, or select 'No, I only want to notify the innovator about this message'";

  form = new FormGroup({
    organisationUnits: new FormArray<FormControl<string>>([], { validators: CustomValidators.requiredCheckboxArray(this.validationMessage), updateOn: 'change' })
  }, { updateOn: 'blur' });

  formOrganisationUnitsItems: { value: string, label: string, description?: string }[] = [];

  constructor() { super(); }

  ngOnInit(): void {

    this.setPageTitle(this.title);
    this.setBackLink('Go back', this.onPreviousStep.bind(this));

    this.leadText = this.stores.authentication.isInnovatorType() ||  this.stores.authentication.isAssessmentType() ? 'You can select organisations that are currently engaging with this innovation' : 'You can select other organisations that are currently engaging with this innovation.';

    this.data.selectedOrganisationUnits.forEach(item => {
      (this.form.get('organisationUnits') as FormArray).push(new FormControl<string>(item));
    });

    this.formOrganisationUnitsItems = this.data.organisationUnits.map(support => ({
      value: support.organisation.unit.id,
      label: `${support.organisation.unit.name} (${support.organisation.unit.acronym})`,
      description: support.engagingAccessors.map(item => item.name).join('<br />')
    }));

    if (this.stores.authentication.isAssessmentType() || this.stores.authentication.isAccessorType()) {
      this.formOrganisationUnitsItems.push(
        { value: 'SEPARATOR', label: 'SEPARATOR' },
        { value: 'NO_CHOICE', label: 'No, I only want to notify the innovator about this message' }
      );
    }

    this.setPageStatus('READY');

  }


  prepareOutputData(): OrganisationsStepOutputType {

    return {
      organisationUnits: (this.form.value.organisationUnits ?? []).map(formValue => {

        const organisationUnit = this.data.organisationUnits.find(item => item.organisation.unit.id === formValue);

        return {
          id: formValue,
          name: organisationUnit?.organisation.unit.name ?? '', // TODO: Change this id to userRoleId
          users: organisationUnit?.engagingAccessors.map(u => ({ id: u.id, userRoleId: u.userRoleId, name: u.name })) ?? []
        };

      })
    };

  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const onlyInnovatorsOptionChosen = !!this.form.value.organisationUnits?.find(item => item === 'NO_CHOICE');
    if (onlyInnovatorsOptionChosen && (this.form.value.organisationUnits ?? []).length > 1) {
      this.form.get('organisationUnits')!.setErrors({ customError: true, message: this.validationMessage });
      this.form.markAllAsTouched();
      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });

  }

}
