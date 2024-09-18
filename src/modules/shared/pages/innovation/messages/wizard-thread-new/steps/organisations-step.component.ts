import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';

import { OrganisationsStepInputType, OrganisationsStepOutputType } from './organisations-step.types';
import {
  InnovationRelevantOrganisationsStatusEnum,
  ThreadAvailableRecipientsDTO
} from '@modules/shared/services/innovations.service';

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
    this.leadText = this.isInnovatorType
      ? 'These organisations are either currently supporting your innovation, have been suggested or are waiting to support, or have supported you in the past.'
      : `You can select other organisations that are either currently supporting this innovation, have been suggested or are waiting to support, or have supported this innovation in the past.`;

    if (this.isInnovatorType || !(this.data.activeInnovators && (this.isAssessmentType || this.isAccessorType))) {
      this.formValidationMessage = 'Select the organisations you want to notify about this message';
    } else {
      this.formValidationMessage = `Select other organisations, or select 'No, I only want to notify the innovator about this message'`;
    }

    this.form.controls['organisationUnits'].setValidators([
      CustomValidators.requiredCheckboxArray(this.formValidationMessage)
    ]);

    this.data.selectedOrganisationUnits.forEach(item => {
      (this.form.get('organisationUnits') as FormArray).push(new FormControl<string>(item));
    });

    const engagingSupports: ThreadAvailableRecipientsDTO = [];
    const suggestedOrganisations: ThreadAvailableRecipientsDTO = [];
    const waitingSupports: ThreadAvailableRecipientsDTO = [];
    const engagedInThePastSupports: ThreadAvailableRecipientsDTO = [];
    for (const unit of this.data.organisationUnits) {
      unit.status === InnovationRelevantOrganisationsStatusEnum.ENGAGING && engagingSupports.push(unit);
      unit.status === InnovationRelevantOrganisationsStatusEnum.SUGGESTED && suggestedOrganisations.push(unit);
      unit.status === InnovationRelevantOrganisationsStatusEnum.WAITING && waitingSupports.push(unit);
      unit.status === InnovationRelevantOrganisationsStatusEnum.PREVIOUS_ENGAGED && engagedInThePastSupports.push(unit);
    }

    // For the following logic to display organisations' checkboxes, keep in mind that if 'submitStep' is true, it means this component is being used as part of the 'Add recipientes' flow (thread recipients component). Thus, we display the names of the engaging accessors. Otherwise, while on the thread creation flow, we do not display the names of the engaging accessors.
    if (engagingSupports.length > 0) {
      this.formOrganisationUnitsItems.push(
        { value: 'Engaging organisations', label: 'HEADING' },
        ...engagingSupports.map(support => ({
          value: support.organisation.unit.id,
          label: `${support.organisation.unit.name}`,
          ...(this.isSubmitStep && { description: support.recipients.map(item => item.name).join('<br />') })
        }))
      );
    }

    if (suggestedOrganisations.length > 0) {
      this.formOrganisationUnitsItems.push(
        { value: 'Suggested organisations', label: 'HEADING' },
        ...suggestedOrganisations.map(support => ({
          value: support.organisation.unit.id,
          label: `${support.organisation.unit.name}`,
          ...(this.isSubmitStep && { description: support.recipients.map(item => item.name).join('<br />') })
        }))
      );
    }

    if (waitingSupports.length > 0) {
      this.formOrganisationUnitsItems.push(
        { value: 'Waiting organisations', label: 'HEADING' },
        ...waitingSupports.map(s => ({
          value: s.organisation.unit.id,
          label: `${s.organisation.unit.name}`,
          ...(this.isSubmitStep && { description: s.recipients.map(item => item.name).join('<br />') })
        }))
      );
    }

    if (engagedInThePastSupports.length > 0) {
      this.formOrganisationUnitsItems.push(
        { value: 'Previously supported', label: 'HEADING' },
        ...engagedInThePastSupports.map(s => ({
          value: s.organisation.unit.id,
          label: `${s.organisation.unit.name}`,
          ...(this.isSubmitStep && { description: s.recipients.map(item => item.name).join('<br />') })
        }))
      );
    }

    if (this.data.activeInnovators && (this.isAssessmentType || this.isAccessorType)) {
      this.formOrganisationUnitsItems.push(
        { value: 'SEPARATOR', label: 'SEPARATOR' },
        { value: 'NO_CHOICE', label: 'No, I only want to notify the innovator about this message' }
      );
    }

    this.setPageTitle(this.title, { size: 'l' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): OrganisationsStepOutputType {
    return {
      organisationUnits: (this.form.value.organisationUnits ?? []).map(formValue => {
        const organisationUnit = this.data.organisationUnits.find(item => item.organisation.unit.id === formValue);

        return {
          id: formValue,
          name: organisationUnit?.organisation.unit.name ?? '', // TODO: Change this id to userRoleId
          users: organisationUnit?.recipients.map(u => ({ id: u.id, roleId: u.roleId, name: u.name })) ?? []
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
