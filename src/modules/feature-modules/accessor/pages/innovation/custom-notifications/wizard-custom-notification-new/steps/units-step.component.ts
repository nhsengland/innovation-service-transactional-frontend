import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { CustomValidators } from '@modules/shared/forms';
import { UnitsStepInputType, UnitsStepOutputType } from './units-step.types';

@Component({
  selector: 'app-accessor-innovation-custom-notifications-wizard-custom-notification-units-step',
  templateUrl: './units-step.component.html'
})
export class WizardInnovationCustomNotificationNewUnitsStepComponent
  extends CoreComponent
  implements WizardStepComponentType<UnitsStepInputType, UnitsStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: UnitsStepInputType = {
    selectedOrganisationsWithUnits: [],
    selectedUnits: []
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<UnitsStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<UnitsStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<UnitsStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<UnitsStepOutputType>>();

  form: FormGroup = new FormGroup({});

  organisationsItems: {
    id: string;
    name: string;
    units: { value: string; label: string }[];
  }[] = [];

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    this.data.selectedOrganisationsWithUnits.forEach(org => {
      // Add a FormArray of units for each organisation
      this.form.addControl(
        org.id,
        new FormArray<FormControl<string>>(
          [],
          [
            CustomValidators.requiredCheckboxArray(
              `Select organisation units for ${org.name} you'd like to be notified about`
            )
          ]
        )
      );

      // Add each unit as an option to select on the form
      const orgUnits = org.units.map(unit => ({ value: unit.id, label: unit.name }));

      this.organisationsItems.push({
        ...org,
        units: orgUnits
      });

      // Select the units previously selected by the user
      const orgUnitIds = orgUnits.map(unit => unit.value);
      this.data.selectedUnits.forEach(unit => {
        if (orgUnitIds.includes(unit.id)) {
          (this.form.get(org.id) as FormArray).push(new FormControl<string>(unit.id));
        }
      });
    });

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): UnitsStepOutputType {
    const selectedUnitsIds = Object.values(this.form.value).flat();

    const selectedUnits = this.data.selectedOrganisationsWithUnits
      .flatMap(org => org.units)
      .filter(unit => selectedUnitsIds.includes(unit.id));

    return {
      units: selectedUnits
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    this.resetAlert();
    if (!this.form.valid) {
      const itemsList: { title: string; fieldId: string }[] = [];
      Object.keys(this.form.controls).forEach(key => {
        if (this.form.controls[key].invalid) {
          const org = this.organisationsItems.find(org => org.id === key)!;
          itemsList.push({
            title: `Select organisation units for ${org.name} you'd like to be notified about`,
            fieldId: `${key}-units`
          });
        }
      });

      this.setAlertError('', {
        itemsList,
        width: '2.thirds'
      });

      this.form.markAllAsTouched();

      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
