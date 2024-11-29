import { VizardService } from './../../vizard.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormControlState, FormGroup } from '@angular/forms';
import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel } from '@modules/shared/forms';

export type Organisation = {
  id: string;
  name: string;
  description?: string;
  units: { id: string; name: string }[];
};

export type OrganisationsStepSupportData = {
  organisations: Organisation[];
};

export type OrganisationsStepAnswersInput = {
  selectedOrganisations: Organisation[];
};

export type OrganisationsStepAnswersOutput = OrganisationsStepAnswersInput;

@Component({
  selector: 'app-organisations-step',
  templateUrl: './organisations-step.component.html'
})
export class OrganisationsStepComponent extends CoreComponent implements OnInit {
  @Input({ required: true }) title = '';
  @Input({ required: true }) supportData!: OrganisationsStepSupportData;
  @Input({ required: true }) answers!: OrganisationsStepAnswersInput;

  errorMessage = "Select organisations you'd like to be notified about";

  form = new FormGroup({
    organisations: new FormArray<FormControl<string>>([], [CustomValidators.requiredCheckboxArray(this.errorMessage)])
  });

  organisationsItems: Required<FormEngineParameterModel>['items'] = [];

  constructor(private vizardService: VizardService<OrganisationsStepAnswersOutput>) {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Add each organisation as an option to select on the form
    this.organisationsItems.push(
      ...this.supportData.organisations.map(org => ({
        value: org.id,
        label: org.name,
        description: org.description
      }))
    );

    // Select the organisations previously selected by the user
    this.answers.selectedOrganisations.forEach((org: { id: string | FormControlState<string> }) => {
      (this.form.get('organisations') as FormArray).push(new FormControl<string>(org.id));
    });

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): OrganisationsStepAnswersOutput {
    const selectedOrganisationsIds = this.form.value.organisations;

    const selectedOrganisations = this.supportData.organisations.filter((org: { id: string }) =>
      selectedOrganisationsIds?.includes(org.id)
    );

    return {
      selectedOrganisations
    };
  }

  onPreviousStep(): void {
    this.vizardService.triggerPrevious(this.prepareOutputData());
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

    this.vizardService.triggerNext(this.prepareOutputData());
  }
}
