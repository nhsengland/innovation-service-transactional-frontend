import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { CustomValidators, FormEngineParameterModel } from '@modules/shared/forms';
import { OrganisationsStepInputType, OrganisationsStepOutputType } from './organisations-step.types';

@Component({
  selector: 'app-accessor-innovation-custom-notifications-wizard-custom-notification-new-organisations-step',
  templateUrl: './organisations-step.component.html'
})
export class WizardInnovationCustomNotificationNewOrganisationsStepComponent
  extends CoreComponent
  implements WizardStepComponentType<OrganisationsStepInputType, OrganisationsStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: OrganisationsStepInputType = {
    organisations: [],
    selectedOrganisations: []
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();

  errorMessage = "Select organisations you'd like to be notified about";

  form = new FormGroup({
    organisations: new FormArray<FormControl<string>>([], [CustomValidators.requiredCheckboxArray(this.errorMessage)])
  });

  organisationsItems: Required<FormEngineParameterModel>['items'] = [];

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    // Add each organisation as an option to select on the form
    this.organisationsItems.push(
      ...this.data.organisations.map(org => ({
        value: org.id,
        label: org.name,
        description: org.description
      }))
    );

    // Select the organisations previously selected by the user
    this.data.selectedOrganisations.forEach(org => {
      (this.form.get('organisations') as FormArray).push(new FormControl<string>(org.id));
    });

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): OrganisationsStepOutputType {
    const selectedOrganisationsIds = this.form.value.organisations;

    const selectedOrganisations = this.data.organisations.filter(org => selectedOrganisationsIds?.includes(org.id));

    return {
      organisations: selectedOrganisations
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.setAlertError('', {
        itemsList: [{ title: this.errorMessage, fieldId: 'organisations' }],
        width: '2.thirds'
      });

      this.form.markAllAsTouched();

      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
