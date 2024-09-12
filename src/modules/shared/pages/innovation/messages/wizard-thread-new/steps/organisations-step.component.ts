import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';

import { InnovationSupportsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { OrganisationsStepInputType, OrganisationsStepOutputType } from './organisations-step.types';

@Component({
  selector: 'shared-pages-innovation-messages-wizard-thread-new-organisations-step',
  templateUrl: './organisations-step.component.html'
})
export class WizardInnovationThreadNewOrganisationsStepComponent
  extends CoreComponent
  implements WizardStepComponentType<OrganisationsStepInputType, OrganisationsStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() isSubmitStep = false;
  @Input() data: OrganisationsStepInputType = {
    innovation: { id: '' },
    organisationUnits: [],
    selectedOrganisationUnits: [],
    activeInnovators: false
  };
  @Output() cancelEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();

  leadText: string = '';
  formValidationMessage: string = '';

  form = new FormGroup(
    {
      organisationUnits: new FormArray<FormControl<string>>([], { updateOn: 'change' })
    },
    { updateOn: 'blur' }
  );

  formOrganisationUnitsItems: Required<FormEngineParameterModel>['items'] = [];

  // Flags
  isInnovatorType: boolean;
  isAssessmentType: boolean;
  isAccessorType: boolean;

  constructor() {
    super();

    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();
    this.isAccessorType = this.stores.authentication.isAccessorType();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    this.leadText =
      this.isInnovatorType || this.isAssessmentType
        ? 'You can select organisations that are currently engaging or waiting to support this innovation.'
        : 'You can select other organisations that are currently engaging or waiting to support this innovation.';

    if (this.isInnovatorType || !(this.data.activeInnovators && (this.isAssessmentType || this.isAccessorType))) {
      this.formValidationMessage = 'Select the organisations you want to notify about this message';
    } else if (this.isAssessmentType) {
      this.formValidationMessage =
        "Select organisations, or select 'No, I only want to notify the innovator about this message'";
    } else {
      this.formValidationMessage =
        "Select other organisations, or select 'No, I only want to notify the innovator about this message'";
    }

    this.form.controls['organisationUnits'].setValidators([
      CustomValidators.requiredCheckboxArray(this.formValidationMessage)
    ]);

    this.data.selectedOrganisationUnits.forEach(item => {
      (this.form.get('organisationUnits') as FormArray).push(new FormControl<string>(item));
    });

    const engagingSupports: InnovationSupportsListDTO = [];
    const waitingSupports: InnovationSupportsListDTO = [];
    for (const unit of this.data.organisationUnits) {
      unit.status === InnovationSupportStatusEnum.ENGAGING && engagingSupports.push(unit);
      unit.status === InnovationSupportStatusEnum.WAITING && waitingSupports.push(unit);
    }

    if (engagingSupports.length > 0) {
      this.formOrganisationUnitsItems.push(
        { value: 'Engaging organisations', label: 'HEADING' },
        ...engagingSupports.map(support => ({
          value: support.organisation.unit.id,
          label: `${support.organisation.unit.name}`,
          description: support.engagingAccessors.map(item => item.name).join('<br />')
        }))
      );
    }

    if (waitingSupports.length > 0) {
      this.formOrganisationUnitsItems.push(
        { value: 'Waiting organisations', label: 'HEADING' },
        ...waitingSupports.map(s => ({
          value: s.organisation.unit.id,
          label: `${s.organisation.unit.name}`,
          description: s.engagingAccessors.map(item => item.name).join('<br />')
        }))
      );
    }

    if (this.data.activeInnovators && (this.isAssessmentType || this.isAccessorType)) {
      this.formOrganisationUnitsItems.push(
        { value: 'SEPARATOR', label: 'SEPARATOR' },
        { value: 'NO_CHOICE', label: 'No, I only want to notify the innovator about this message' }
      );
    }

    this.setPageTitle(this.title);
    this.setPageStatus('READY');
  }

  prepareOutputData(): OrganisationsStepOutputType {
    return {
      organisationUnits: (this.form.value.organisationUnits ?? []).map(formValue => {
        const organisationUnit = this.data.organisationUnits.find(item => item.organisation.unit.id === formValue);

        return {
          id: formValue,
          name: organisationUnit?.organisation.unit.name ?? '', // TODO: Change this id to userRoleId
          users:
            organisationUnit?.engagingAccessors.map(u => ({ id: u.id, userRoleId: u.userRoleId, name: u.name })) ?? []
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
      this.form.get('organisationUnits')!.setErrors({ customError: true, message: this.formValidationMessage });
      this.form.markAllAsTouched();
      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onSubmitStep(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
