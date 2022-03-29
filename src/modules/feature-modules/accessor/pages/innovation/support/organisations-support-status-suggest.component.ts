import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent, FormArray, FormControl, FormGroup, Validators } from '@app/base';
import { AlertType } from '@app/base/models';
import { CustomValidators, FormEngineParameterModel } from '@modules/shared/forms';
import { RoutingHelper } from '@modules/core';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { AccessorService, SupportLogType } from '../../../services/accessor.service';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';


@Component({
  selector: 'app-accessor-pages-innovation-support-organisations-support-status-suggest',
  templateUrl: './organisations-support-status-suggest.component.html'
})
export class InnovationSupportOrganisationsSupportStatusSuggestComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: InnovationDataResolverType;
  stepId: number;

  alert: AlertType = { type: null };

  form = new FormGroup({
    organisationUnits: new FormArray([], { validators: Validators.required, updateOn: 'change' }),
    comment: new FormControl('', CustomValidators.required('A comment is required')),
    confirm: new FormControl(false, { updateOn: 'change' })
  }, { updateOn: 'blur' });
  formSubmitted = false;

  groupedItems: Required<FormEngineParameterModel>['groupedItems'] = [];

  chosenUnits: {
    list: { organisation: string, units: string[] }[];
    values: string[];
  } = { list: [], values: [] };


  isValidStepId(): boolean {
    const id = this.activatedRoute.snapshot.params.stepId;
    return (1 <= Number(id) && Number(id) <= 2);
  }


  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService,
    private organisationsService: OrganisationsService
  ) {

    super();
    this.setPageTitle('Suggest organisations for support');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.stepId = this.activatedRoute.snapshot.params.stepId;

    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;

  }


  ngOnInit(): void {

    this.subscriptions.push(
      this.activatedRoute.params.subscribe(params => {

        this.stepId = Number(params.stepId);

        if (!this.isValidStepId()) {
          this.redirectTo('/not-found');
        }

      })
    );

    forkJoin([
      this.organisationsService.getOrganisationUnits(),
      this.accessorService.getInnovationNeedsAssessment(this.innovationId, this.innovation.assessment.id || ''),
      this.accessorService.getInnovationSupports(this.innovationId, false)
    ]).subscribe(([organisations, needsAssessmentInfo, supportsInfo]) => {

      const needsAssessmentSuggestedOrganisations = needsAssessmentInfo.assessment.organisations.map(item => item.id);

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

      supportsInfo.filter(s => s.status === 'ENGAGING').forEach(s => {

        (this.form.get('organisationUnits') as FormArray).push(new FormControl(s.organisationUnit.id));

        this.groupedItems.forEach(o => {
          const ou = o.items.find(i => i.value === s.organisationUnit.id);
          if (ou) {
            ou.isEditable = false;
            ou.label += ` (currently engaging)`;
          }
        });

      });

      this.setPageStatus('READY');

    },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch information',
          message: 'Please try again or contact us for further help'
        };
      }
    );

  }


  onSubmitStep(): void {

    if (!this.form.get('organisationUnits')!.valid) {
      this.form.get('organisationUnits')!.markAsTouched();
      return;
    }

    let chosenUnitsValues: string[] = [];
    const chosenUnitsList = (this.groupedItems).map(item => {

      const units = item.items.filter(i => (i.isEditable && (this.form.get('organisationUnits')!.value as string[]).includes(i.value)));

      if (units.length === 0) { return { organisation: '', units: [] }; }

      if (item.items.length === 1) {
        chosenUnitsValues.push(item.items[0].value);
        return { organisation: item.items[0].label, units: [] };
      }
      else {
        chosenUnitsValues = [...chosenUnitsValues, ...units.map(u => u.value)];
        return { organisation: item.label, units: units.map(u => u.label) };
      }

    }).filter(o => o.organisation);


    this.chosenUnits = { list: chosenUnitsList, values: chosenUnitsValues };

    this.redirectTo(`/accessor/innovations/${this.innovationId}/support/organisations/suggest/2`);

  }

  onSubmit(): void {

    this.formSubmitted = true;

    if (!this.form.valid || !this.form.get('confirm')!.value) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      organisationUnits: this.chosenUnits.values,
      description: this.form.get('comment')!.value,
      type: SupportLogType.ACCESSOR_SUGGESTION,
    };

    this.accessorService.suggestNewOrganisations(this.innovationId, body).subscribe(
      () => {
        this.redirectTo(`/accessor/innovations/${this.innovationId}/support`, { alert: 'supportOrganisationSuggestSuccess' });
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
