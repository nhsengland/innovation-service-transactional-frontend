import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel } from '@app/base/forms';
import { InnovationDataResolverType, InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { AccessorService, SupportLogType } from '../../../services/accessor.service';
import { RoutingHelper } from '@app/base/helpers';
import { forkJoin } from 'rxjs';

enum FormFieldActionsEnum {
  YES = 'YES',
  NO = 'NO'
}

@Component({
  selector: 'app-accessor-pages-innovation-support-update',
  templateUrl: './support-update.component.html'
})
export class InnovationSupportUpdateComponent extends CoreComponent implements OnInit {

  private accessorsList: { id: string, organisationUnitUserId: string, name: string }[] = [];

  innovationId: string;
  supportId: string;
  stepNumber: number;

  formAccessorsList: { value: string, label: string }[] = [];
  selectedAccessors: typeof this.accessorsList = [];
  userOrganisationUnit: null | { id: string, name: string, acronym: string };

  supportStatusObj = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  supportStatus = Object.entries(this.supportStatusObj).map(([key, item]) => ({
    key,
    checked: false,
    ...item
  })).filter(x => !x.hidden);

  currentStatus: null | InnovationSupportStatusEnum = null;
  currentSuggestOrganisations: null | FormFieldActionsEnum = null;
  isQualifyingAccessorRole = false;
  innovation: InnovationDataResolverType;

  groupedItems: Required<FormEngineParameterModel>['groupedItems'] = [];

  chosenUnits: {
    list: { organisation: string, units: string[] }[];
    values: string[];
  } = { list: [], values: [] };

  submitButton = { isActive: true, label: 'Confirm and notify organisations' };

  form = new FormGroup({
    status: new FormControl<null | InnovationSupportStatusEnum>(null, { validators: Validators.required, updateOn: 'change', nonNullable: true }),
    suggestOrganisations: new FormControl<FormFieldActionsEnum>(FormFieldActionsEnum.YES, { validators: Validators.required, updateOn: 'change', nonNullable: true }),
    accessors: new FormArray<FormControl<string>>([], { updateOn: 'change' }),
    message: new FormControl<string>('', CustomValidators.required('A message is required')),
    organisationUnits: new UntypedFormArray([]),
    comment: new UntypedFormControl('', CustomValidators.required('A comment is required')),
    confirm: new UntypedFormControl(false, CustomValidators.required('You need to confirm to proceed'))
  }, { updateOn: 'blur' });

  old = new FormGroup({
    organisationUnits: new UntypedFormArray([]),
    comment: new UntypedFormControl('', CustomValidators.required('A comment is required')),
    confirm: new UntypedFormControl(false, CustomValidators.required('You need to confirm to proceed'))
  }, { updateOn: 'blur' });

  STATUS_LABELS: { [key: string]: string } = {
    ENGAGING: 'Provide the innovator with clear details of changes to their support status and that your organisation is ready to actively engage with this innovation. Provide details of at least one person from your organisation assigned to this innovation.',
    FURTHER_INFO_REQUIRED: 'Provide the innovator with clear details of changes to their support status and that further information is needed from the innovator in order to make a decision on their status. Provide a message on what specific information is needed.',
    WAITING: 'Provide the innovator with clear details of changes to their support status and that an internal decision is pending for the progression of their status.',
    NOT_YET: 'Provide the innovator with clear details of changes to their support status and that their Innovation Record is not ready for your organisation to provide just yet. Provide a message outlining this decision.',
    UNSUITABLE: 'Provide the innovator with clear details of changes to their support status and that your organisation has no suitable support offer for their innovation. Provide a message and feedback on why you organisation has made this decision.',
    COMPLETE: 'Provide the innovator with clear details of changes to their support status and that you have completed the engagement process. Provide an outline of the completion of the engagement process with you organisation.'
  };

  formfieldAction = {
    description: `Based on the innovation's current support status, can you refer another organisation to continue supporting this Innovation at this moment in time?`,
    items: [
      {
        value: FormFieldActionsEnum.YES,
        label: `Yes`,
      },
      {
        value: FormFieldActionsEnum.NO,
        label: `No`,
      },
    ]
  };


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService,
    private accessorService: AccessorService
  ) {

    super();
    this.setPageTitle('Update support status - status');
    this.setStepTitle();


    this.innovation = RoutingHelper.getRouteData<any>(this.activatedRoute).innovationData;
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.supportId = this.activatedRoute.snapshot.params.supportId;

    this.stepNumber = 1;

    this.userOrganisationUnit = this.stores.authentication.getUserInfo().organisations[0].organisationUnits[0];
    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

  }


  ngOnInit(): void {

    if (!this.supportId) {

      this.setPageStatus('READY');

    } else {

      this.innovationsService.getInnovationSupportInfo(this.innovationId, this.supportId).subscribe(response => {

        this.form.get('status')!.setValue(response.status);

        response.engagingAccessors.forEach(accessor => {
          (this.form.get('accessors') as FormArray).push(new FormControl<string>(accessor.id));
        });

        this.setPageStatus('READY');

        forkJoin([
          this.organisationsService.getOrganisationsList(true),
          this.innovationsService.getInnovationNeedsAssessment(this.innovation.id, this.innovation.assessment.id || ''),
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

      });


    }

    this.organisationsService.getOrganisationUnitUsersList(this.userOrganisationUnit?.id ?? '').subscribe(
      response => {

        this.accessorsList = response;
        this.formAccessorsList = response.map((r) => ({ value: r.id, label: r.name }));

      }
    );

  }


  /*
    TODO: REVISIT THIS METHOD. CODE IS A BIT SLOPPY.
    works. but it's sloppy.
  */
  onSubmitStep(): void {

    if (!this.validateForm(this.stepNumber)) { return; }

    this.selectedAccessors = this.accessorsList.filter(item =>
      (this.form.get('accessors')?.value ?? []).includes(item.id)
    );

    if (this.stepNumber === 1 && this.form.get('status')!.value !== 'ENGAGING') {

      this.currentStatus = this.form.get('status')?.value ?? null;

      this.stepNumber++;
    }

    if (this.stepNumber === 2 && this.currentStatus === InnovationSupportStatusEnum.ENGAGING) {

      if (this.selectedAccessors.length === 0) {
        this.setAlertError('An error has occurred when updating Status. You must select at least one Accessor.');
        return;
      } else {
        this.resetAlert();
      }

      this.stepNumber = 2;

    }

    if (this.stepNumber === 4 && this.form.get('suggestOrganisations')?.value === 'NO') {
      this.onSubmit()
    }

    if (this.stepNumber === 5) {
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
        this.form.get('organisationUnits')!.setErrors({ customError: true, message: 'You need to choose at least one organisationn or one unit to suggest' });
        this.form.get('organisationUnits')!.markAsTouched();
        return;
      }
    }

    this.currentStatus = this.form.get('status')?.value ?? null;
    this.currentSuggestOrganisations = this.form.get('suggestOrganisations')?.value ?? null;

    if (this.currentStatus !== InnovationSupportStatusEnum.ENGAGING) {
      this.selectedAccessors = [];
    }

    this.stepNumber++;
    this.setStepTitle();

  }

  onSubmit(): void {

    if (!this.validateForm(this.stepNumber)) { return; }

    const statusBody = {
      status: this.form.get('status')?.value ?? InnovationSupportStatusEnum.UNASSIGNED,
      accessors: this.selectedAccessors.map(item => ({
        id: item.id,
        organisationUnitUserId: item.organisationUnitUserId
      })),
      message: this.form.get('message')?.value ?? '',
    }

    this.accessorService.saveSupportStatus(this.innovationId, statusBody, this.supportId).subscribe(() => {

      this.setRedirectAlertSuccess('Support status updated and organisation suggestions sent', { message: 'The Innovation Support status has been successfully updated and the Innovator has been notified of your accompanying suggestions and feedback.' });
      this.redirectTo(`/accessor/innovations/${this.innovationId}/support`);

    });

    const suggestedOrganisationsBody = {
      organisationUnits: this.chosenUnits.values,
      description: this.form.get('comment')!.value,
      type: SupportLogType.ACCESSOR_SUGGESTION,
    }

    this.accessorService.suggestNewOrganisations(this.innovationId, suggestedOrganisationsBody).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Organisation suggestions sent', { message: 'Your suggestions were saved and notifications sent.' });
        this.redirectTo(`/accessor/innovations/${this.innovationId}/support`);
      },
      error: () => {
        this.submitButton = { isActive: true, label: 'Confirm and notify organisations' };
        this.setAlertUnknownError();
      }
    });

  }

  getMessageLabel() {

    const status = this.form.get('status')?.value ?? InnovationSupportStatusEnum.UNASSIGNED;
    return this.STATUS_LABELS[status] ?? "Let the innovator know what's changed";

  }

  private validateForm(step: number): boolean {

    switch (step) {
      case 1:
        if (!this.form.get('status')!.valid) {
          this.setAlertError('An error has occurred when updating Status. You must select a status.');
          return false;
        } else {
          this.resetAlert();
        }
        break;

      case 3:
        if (!this.form.get('message')!.valid && this.form.get('status')!.value !== 'WAITING') {
          this.setAlertError('An error has occurred when updating the message. You must add a message.');
          return false;
        } else {
          this.resetAlert();
        }
        break;

      case 6:
        if (!this.form.valid || !this.form.get('confirm')!.value) {
          this.setAlertError('An error has occurred when updating suggested organisations. You must select at least one organisation or one unit to suggest.');
          this.form.markAllAsTouched();
          return false;
        } else {
          this.resetAlert()
        }
        break;

      default:
        break;
    }

    return true;
  }

  private setStepTitle(): void {
    switch (this.stepNumber) {
      case 1:
        this.setPageTitle('Update support status - status');
        break;
      case 2:
        this.setPageTitle('Update support status - accessors');
        break;
      case 3:
        this.setPageTitle('Update support status');
        break;
      case 4:
      case 5:
        this.setPageTitle('Suggest organisations for support');
        break;
      default:
        break;
    }
  }

}
