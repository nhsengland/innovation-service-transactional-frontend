import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormArray, FormControl, FormGroup, Validators } from '@app/base';

import { FormEngineParameterModel } from '@modules/shared/forms';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-support-organisations-support-status-suggest',
  templateUrl: './organisations-support-status-suggest.component.html'
})
export class InnovationSupportOrganisationsSupportStatusSuggestComponent extends CoreComponent implements OnInit {

  innovationId: string;
  stepId: number;

  form = new FormGroup({
    organisationUnits: new FormArray([], Validators.required),
    comment: new FormControl('', Validators.required),
    confirm: new FormControl(false)
  });
  formSubmitted = false;

  groupedItems: FormEngineParameterModel['groupedItems'] = [];

  chosenUnits: { organisation: string, units: string[] }[] = [];

  summaryAlert: { type: '' | 'error' | 'warning' | 'success', title: string, message: string };


  isValidStepId(): boolean {
    const id = this.activatedRoute.snapshot.params.stepId;
    return (1 <= Number(id) && Number(id) <= 2);
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.stepId = this.activatedRoute.snapshot.params.stepId;

    this.summaryAlert = { type: '', title: '', message: '' };

  }


  ngOnInit(): void {

    this.accessorService.getOrganisationUnitsToSuggest(this.innovationId).subscribe(
      response => {

        this.groupedItems = response.map(item => ({
          value: item.id,
          label: item.name,
          description: item.description,
          items: item.organisationUnits.map(i => ({ value: i.id, label: i.name, description: i.description }))
        }));
      }
    );

    this.subscriptions.push(
      this.activatedRoute.params.subscribe(params => {

        this.stepId = Number(params.stepId);

        if (!this.isValidStepId()) {
          this.redirectTo('not-found');
        }

      })
    );
  }


  onSubmitStep(): void {

    if (!this.form.get('organisationUnits')?.valid) {
      this.form.get('organisationUnits')?.markAsTouched();
      return;
    }

    this.chosenUnits = (this.groupedItems || []).map(item => {

      const units = item.items.filter(i => (this.form.get('organisationUnits')?.value as string[]).includes(i.value)).map(c => c.label);

      if (units.length === 0) { return { organisation: '', units: [] }; }

      if (item.items.length === 1) { return { organisation: item.items[0].label, units: [] }; }
      else { return { organisation: item.label, units }; }

    }).filter(o => o.organisation);

    this.redirectTo(`/accessor/innovations/${this.innovationId}/support/organisations/suggest/2`);

  }

  onSubmit(): void {

    this.formSubmitted = true;

    if (!this.form.valid || !this.form.get('confirm')?.value) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      organisationUnits: this.form.get('organisationUnits')?.value as string[],
      comment: this.form.get('comment')?.value as string
    };

    this.accessorService.suggestNewOrganisations(this.innovationId, body).subscribe(
      () => {
        this.redirectTo(`/accessor/innovations/${this.innovationId}/support`, { alert: 'supportOrganisationSuggestSuccess' });
      },
      () => {
        this.summaryAlert = {
          type: 'error',
          title: 'An error occured when creating an action',
          message: 'Please, try again or contact us for further help'
        };
      }
    );

  }

}
