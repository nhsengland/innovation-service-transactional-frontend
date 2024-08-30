import { Component, OnInit } from '@angular/core';
import { forkJoin, of, switchMap } from 'rxjs';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormArray, FormControl, FormEngineParameterModel, FormGroup } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsListDTO, OrganisationsService } from '@modules/shared/services/organisations.service';
import { ContextInnovationType } from '@modules/stores/context/context.types';

import { AccessorService, NotificationEnum, NotifyMeConfig } from '../../../services/accessor.service';

import { ActivatedRoute } from '@angular/router';
import { SupportLogType } from '@modules/shared/services/innovations.dtos';
import { UtilsHelper } from '@app/base/helpers';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { ORGANISATIONS_INFORMATION } from './organisations-information/organisations-information';

export type OrganisationInformation = {
  displayName: string;
  acronym: string;
  link: string;
  supportInformation: {
    title: string;
    bulletPoints: { description: string; link?: { url: string; label: string } }[];
    footnote?: string;
  }[];
  programmes?: string[];
};

@Component({
  selector: 'app-accessor-pages-innovation-support-organisations-support-status-suggest',
  templateUrl: './organisations-support-status-suggest.component.html'
})
export class InnovationSupportOrganisationsSupportStatusSuggestComponent extends CoreComponent implements OnInit {
  private supportUpdateSideEffect = false;

  stepNumber: number;
  innovation: ContextInnovationType;

  organisationErrorMessage = 'Select an organisation and click continue';
  unitsErrorMessage = 'Select 1 or more organisation units and click continue';
  commentErrorMessage =
    'Describe why you think this innovation would benefit from support from this organisation and click continue';
  notifyErrorMessage = 'Select an option and click confirm';

  form: FormGroup<{
    organisation: FormControl<null | string>;
    units?: FormArray<FormControl<string>>;
    comment: FormControl<null | string>;
    notify: FormControl<null | string>;
  }> = new FormGroup(
    {
      organisation: new FormControl<null | string>(null, CustomValidators.required(this.organisationErrorMessage)),
      comment: new FormControl<string>('', CustomValidators.required(this.commentErrorMessage)),
      notify: new FormControl<null | string>(null, CustomValidators.required(this.notifyErrorMessage))
    },
    { updateOn: 'blur' }
  );

  previousOrganisationsSuggestions: { [key: string]: string[] } = {};

  organisations: OrganisationsListDTO[] = [];
  organisationsToSuggest: (OrganisationsListDTO & { description: string | undefined })[] = [];

  organisationItems: Required<FormEngineParameterModel>['items'] = [];
  unitsItems: Required<FormEngineParameterModel>['items'] = [];
  notifyItems: Required<FormEngineParameterModel>['items'] = [
    { value: 'YES', label: 'Yes' },
    { value: 'NO', label: 'No' }
  ];

  chosenUnits: {
    organisation: { name: string; acronym: string; information?: OrganisationInformation };
    unitsNames: string[];
    values: string[];
  } = { organisation: { name: '', acronym: '' }, unitsNames: [], values: [] };

  submitButton = { isActive: true, label: 'Confirm' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService,
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService
  ) {
    super();
    this.innovation = this.stores.context.getInnovation();
    this.stepNumber = 1;
  }

  ngOnInit(): void {
    this.handlePageTitle();
    this.setBackLink('Go back', this.handleGoBack.bind(this));

    this.supportUpdateSideEffect = this.activatedRoute.snapshot.queryParams['entryPoint'] === 'supportUpdate';

    forkJoin([
      this.organisationsService.getOrganisationsList({ unitsInformation: true }),
      this.innovationsService.getInnovationSupportsList(this.innovation.id, false)
    ]).subscribe({
      next: ([organisations, innovationSupports]) => {
        this.organisations = organisations;

        const userUnitId = this.stores.authentication.getUserContextInfo()?.organisationUnit?.id ?? '';

        this.previousOrganisationsSuggestions = JSON.parse(sessionStorage.getItem('organisationsSuggestions') ?? '{}');

        const engagingUnitsIds = innovationSupports
          .filter(support => support.status === InnovationSupportStatusEnum.ENGAGING)
          .map(support => support.organisation.unit.id);

        this.organisationsToSuggest = UtilsHelper.getAvailableOrganisationsToSuggest(
          this.innovation.id,
          userUnitId,
          organisations,
          engagingUnitsIds,
          this.previousOrganisationsSuggestions
        );

        this.organisationItems = this.organisationsToSuggest.map(org => ({
          value: org.id,
          label: `${org.name} (${org.acronym})`,
          description: org.description
        }));

        this.organisationItems.unshift({ value: 'Select an organisation:', label: 'HEADING' });

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  onSubmitStep(): void {
    this.resetAlert();

    switch (this.stepNumber) {
      case 1:
        const organisation = this.form.get('organisation');
        if (!organisation?.value) {
          this.setAlertError('You have not selected an organisation', {
            itemsList: [
              {
                title: this.organisationErrorMessage,
                fieldId: 'organisation1'
              }
            ],
            width: '2.thirds'
          });
          organisation?.markAsTouched();
        } else {
          const chosenOrganisation = this.organisationsToSuggest.find(org => org.id === organisation?.value!)!;

          this.chosenUnits.organisation = {
            name: chosenOrganisation.name,
            acronym: chosenOrganisation.acronym,
            information: ORGANISATIONS_INFORMATION.find(org => org.acronym === chosenOrganisation.acronym)
          };

          // Count total number of units inside organisation
          const totalUnits = this.organisations.find(org => org.id === organisation?.value!)!.organisationUnits.length;

          const units = this.form.get('units');
          if (totalUnits > 1) {
            if (!units) {
              this.form.addControl(
                'units',
                new FormArray<FormControl<string>>([], [CustomValidators.requiredCheckboxArray(this.unitsErrorMessage)])
              );
            }

            this.unitsItems = chosenOrganisation.organisationUnits.map(unit => ({
              value: unit.id,
              label: unit.name
            }));

            this.unitsItems.unshift({
              value: 'Select the organisation units you want to suggest:',
              label: 'HEADING'
            });

            this.stepNumber = 2;
          } else {
            if (units) {
              this.form.removeControl('units');
              this.chosenUnits.unitsNames = [];
            }

            this.chosenUnits.values = [chosenOrganisation.organisationUnits[0].id];

            this.stepNumber = 3;
          }
        }

        break;

      case 2:
        const units = this.form.get('units');
        if (!units?.value?.length) {
          this.setAlertError('You have not selected an organisation unit', {
            itemsList: [
              {
                title: this.unitsErrorMessage,
                fieldId: 'units1'
              }
            ],
            width: '2.thirds'
          });
          units?.markAsTouched();
        } else {
          this.chosenUnits.unitsNames = this.organisationsToSuggest
            .find(org => org.id === this.form.get('organisation')!.value!)!
            .organisationUnits.filter(unit => units?.value?.includes(unit.id))
            .map(unit => unit.name);

          this.chosenUnits.values = units?.value!;

          this.stepNumber++;
        }

        break;

      case 3:
        const comment = this.form.get('comment');
        if (!comment?.value) {
          this.setAlertError('You have not added a description', {
            itemsList: [
              {
                title: this.commentErrorMessage,
                fieldId: 'comment'
              }
            ],
            width: '2.thirds'
          });
          comment?.markAsTouched();
        } else {
          this.stepNumber++;
        }

        break;

      default:
        break;
    }

    this.handlePageTitle();
  }

  onSubmit(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.setAlertError('', {
        itemsList: [{ title: this.notifyErrorMessage, fieldId: 'notify0' }],
        width: '2.thirds'
      });
      this.form.markAllAsTouched();
      return;
    }

    this.submitButton = { isActive: false, label: 'Saving...' };

    const suggestNewOrganisationBody = {
      organisationUnits: this.chosenUnits.values,
      description: this.form.get('comment')?.value || '',
      type: SupportLogType.ACCESSOR_SUGGESTION
    };

    this.accessorService
      .suggestNewOrganisations(this.innovation.id, suggestNewOrganisationBody)
      .pipe(
        switchMap(() => {
          // Check if user has chosen to be notified
          if (this.form.get('notify')?.value === 'YES') {
            const createSubscriptionBody: NotifyMeConfig = {
              eventType: NotificationEnum.SUPPORT_UPDATED,
              subscriptionType: 'ONCE',
              preConditions: {
                units: suggestNewOrganisationBody.organisationUnits,
                status: [
                  InnovationSupportStatusEnum.ENGAGING,
                  InnovationSupportStatusEnum.WAITING,
                  InnovationSupportStatusEnum.UNSUITABLE,
                  InnovationSupportStatusEnum.CLOSED
                ]
              },
              notificationType: NotificationEnum.SUGGESTED_SUPPORT_UPDATED
            };
            return this.accessorService.createNotifyMeSubscription(this.innovation.id, createSubscriptionBody);
          } else {
            return of(true);
          }
        })
      )
      .subscribe({
        next: () => {
          sessionStorage.setItem(
            'organisationsSuggestions',
            JSON.stringify({
              ...this.previousOrganisationsSuggestions,
              [this.innovation.id]: [
                ...(this.previousOrganisationsSuggestions[this.innovation.id] || []),
                ...suggestNewOrganisationBody.organisationUnits
              ]
            })
          );

          this.handleRedirectAlertSuccess();
          this.handleCancelOrSubmit();
        },
        error: () => {
          this.submitButton = { isActive: true, label: 'Confirm' };
          this.setAlertUnknownError();
        }
      });
  }

  handleGoBack() {
    this.resetAlert();
    this.form.markAsUntouched();

    if (this.stepNumber === 1) {
      this.redirectTo(this.stores.context.getPreviousUrl() ?? `/accessor/innovations/${this.innovation.id}/support`);
    } else {
      if (this.stepNumber === 3 && this.chosenUnits.unitsNames.length === 0) {
        this.stepNumber = 1;
      } else {
        this.stepNumber--;
      }
    }
    this.handlePageTitle();
  }

  handleCancelOrSubmit() {
    let cancelUrl = this.stores.context.getPreviousUrl() ?? `/accessor/innovations/${this.innovation.id}/support`;
    if (this.supportUpdateSideEffect) {
      cancelUrl = `/accessor/innovations/${this.innovation.id}/overview`;
    }
    this.redirectTo(cancelUrl);
  }

  handlePageTitle() {
    if (this.stepNumber === 1) {
      this.setPageTitle(`Suggest an organisation to support ${this.innovation.name}`, { width: '2.thirds', size: 'l' });
    } else if (this.stepNumber === 2) {
      this.setPageTitle(
        `You have selected ${this.chosenUnits.organisation.name} (${this.chosenUnits.organisation.acronym})`,
        { width: '2.thirds', size: 'l' }
      );
    } else if (this.stepNumber === 3) {
      this.setPageTitle(`Why are you suggesting this organisation to support?`, { width: '2.thirds', size: 'l' });
    } else {
      this.setPageTitle(`Would you like to be notified when this organisation updates their support status?`, {
        width: '2.thirds',
        size: 'l'
      });
    }
  }

  handleRedirectAlertSuccess() {
    switch (this.chosenUnits.unitsNames.length) {
      case 0:
        this.setRedirectAlertSuccess(
          `You have suggested ${this.chosenUnits.organisation.name} (${this.chosenUnits.organisation.acronym}) to support this innovation`
        );
        break;
      case 1:
        this.setRedirectAlertSuccess(`You have suggested ${this.chosenUnits.unitsNames[0]} to support this innovation`);
        break;
      case 2:
        this.setRedirectAlertSuccess(
          `You have suggested ${this.chosenUnits.unitsNames[0]} and ${this.chosenUnits.unitsNames[1]} to support this innovation`
        );
        break;
      default:
        this.setRedirectAlertSuccess(`You have suggested these organisation units to support this innovation:`, {
          listStyleType: 'bullet',
          itemsList: this.chosenUnits.unitsNames.map(unitName => {
            return {
              title: unitName
            };
          })
        });
        break;
    }
  }
}
