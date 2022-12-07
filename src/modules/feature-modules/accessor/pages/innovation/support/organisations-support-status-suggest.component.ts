import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormArray, FormControl, FormGroup, FormEngineParameterModel } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { ContextInnovationType } from '@modules/stores/context/context.types';

import { AccessorService } from '../../../services/accessor.service';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { SupportLogType } from '@modules/shared/services/innovations.dtos';


@Component({
  selector: 'app-accessor-pages-innovation-support-organisations-support-status-suggest',
  templateUrl: './organisations-support-status-suggest.component.html'
})
export class InnovationSupportOrganisationsSupportStatusSuggestComponent extends CoreComponent implements OnInit {

  currentStep: 1 | 2 = 1;
  innovation: ContextInnovationType;

  form = new FormGroup({
    organisationUnits: new FormArray<FormControl<string>>([]),
    comment: new FormControl<string>('', CustomValidators.required('A comment is required')),
    confirm: new FormControl<boolean>(false, CustomValidators.required('You need to confirm to proceed'))
  }, { updateOn: 'blur' });

  groupedItems: Required<FormEngineParameterModel>['groupedItems'] = [];

  chosenUnits: {
    list: { organisation: string, units: string[] }[];
    values: string[];
  } = { list: [], values: [] };

  submitButton = { isActive: true, label: 'Confirm and notify organisations' };

  isQualifyingAccessorRole = false;

  constructor(
    private accessorService: AccessorService,
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService
  ) {

    super();
    this.setPageTitle('Suggest organisations for support');

    this.innovation = this.stores.context.getInnovation();

    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

  }


  ngOnInit(): void {

    forkJoin([
      this.organisationsService.getOrganisationsList(true),
      this.innovationsService.getInnovationNeedsAssessment(this.innovation.id, this.innovation.assessment?.id || ''),
      this.innovationsService.getInnovationSupportsList(this.innovation.id, false)
    ]).subscribe(([organisations, needsAssessment, innovationSupportsList]) => {

      const needsAssessmentSuggestedOrganisations = needsAssessment.suggestedOrganisations.map(item => item.id);

      this.groupedItems = organisations.map(item => {

        const description = needsAssessmentSuggestedOrganisations.includes(item.id) ? 'Suggested by needs assessment' : undefined;

        return {
          value: item.id,
          label: item.name,
          description,
          items: item.organisationUnits.map(i => ({
            value: i.id,
            label: i.name,
            description: (item.organisationUnits.length === 1 ? description : undefined),
            isEditable: true
          })),
        };

      });

      innovationSupportsList.filter(s => s.status === InnovationSupportStatusEnum.ENGAGING).forEach(s => {

        (this.form.get('organisationUnits') as FormArray).push(new FormControl(s.organisation.id));

        this.groupedItems.forEach(o => {
          const ou = o.items.find(i => i.value === s.organisation.id);
          if (ou) {
            ou.isEditable = false;
            ou.label += ` (currently engaging)`;
          }
        });

      });

      this.setPageStatus('READY');

    });

  }


  onSubmitStep(): void {

    let chosenUnitsValues: string[] = [];
    const chosenUnitsList = (this.groupedItems).map(item => {

      const units = item.items.filter(i => i.isEditable && (this.form.get('organisationUnits')!.value as string[]).includes(i.value));

      if (units.length === 0) { return { organisation: '', units: [] }; } // This is filtered after the map.

      if (item.items.length === 1) {
        chosenUnitsValues.push(item.items[0].value);
        return { organisation: item.label, units: [] };
      }
      else {
        chosenUnitsValues = [...chosenUnitsValues, ...units.map(u => u.value)];
        return { organisation: item.label, units: units.map(u => u.label) };
      }

    }).filter(o => o.organisation);

    this.chosenUnits = { list: chosenUnitsList, values: chosenUnitsValues };

    if (this.chosenUnits.values.length === 0) {
      this.form.get('organisationUnits')!.setErrors({ customError: true, message: 'You need to choose at least one organisation or one unit to suggest' });
      this.form.get('organisationUnits')!.markAsTouched();
      return;
    }

    this.currentStep = 2;

  }

  onSubmit(): void {

    if (!this.form.valid || !this.form.get('confirm')!.value) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitButton = { isActive: false, label: 'Saving...' };

    const body = {
      organisationUnits: this.chosenUnits.values,
      description: this.form.get('comment')?.value || '',
      type: SupportLogType.ACCESSOR_SUGGESTION
    };

    this.accessorService.suggestNewOrganisations(this.innovation.id, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Organisation suggestions sent', { message: 'Your suggestions were saved and notifications sent.' });
        this.redirectTo(`/accessor/innovations/${this.innovation.id}/support`);
      },
      error: () => {
        this.submitButton = { isActive: true, label: 'Confirm and notify organisations' };
        this.setAlertUnknownError();
      }
    });

  }

}
