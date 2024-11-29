import { Component, Input, OnInit } from '@angular/core';
import { Organisation } from './organisations-step.component';
import { CoreComponent } from '@app/base';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from '@modules/shared/forms';
import { VizardService } from '../../vizard.service';

export type Unit = { id: string; name: string };

export type UnitsStepAnswersInput = {
  selectedOrganisations: Organisation[];
  selectedUnits: Unit[];
};

export type UnitsStepAnswersOutput = {
  selectedUnits: Unit[];
};

@Component({
  selector: 'app-units-step',
  templateUrl: './units-step.component.html'
})
export class UnitsStepComponent extends CoreComponent implements OnInit {
  @Input({ required: true }) title = '';
  @Input({ required: true }) answers!: UnitsStepAnswersInput;

  form: FormGroup = new FormGroup({});

  organisationsItems: {
    id: string;
    name: string;
    units: { value: string; label: string }[];
  }[] = [];

  constructor(private vizardService: VizardService<UnitsStepAnswersOutput>) {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    this.answers.selectedOrganisations
      .filter(org => org.units.length > 1)
      .forEach(org => {
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
        this.answers.selectedUnits.forEach(unit => {
          if (orgUnitIds.includes(unit.id)) {
            (this.form.get(org.id) as FormArray).push(new FormControl<string>(unit.id));
          }
        });
      });

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): UnitsStepAnswersOutput {
    const selectedUnitsIds = Object.values(this.form.value).flat();

    const selectedUnits = this.answers.selectedOrganisations
      .flatMap(org => org.units)
      .filter(unit => selectedUnitsIds.includes(unit.id));

    return {
      selectedUnits
    };
  }

  onPreviousStep(): void {
    this.vizardService.triggerPrevious(this.prepareOutputData());
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

    this.vizardService.triggerNext(this.prepareOutputData());
  }
}
