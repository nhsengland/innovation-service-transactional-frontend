import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { MappedObjectType, WizardStepEventType } from '@app/base/types';

import { WizardSummaryWithConfirmStepComponent } from '@modules/shared/wizards/steps/summary-with-confirm-step.component';
import {
  SummaryWithConfirmStepInputType,
  SummaryWithConfirmStepOutputType
} from '@modules/shared/wizards/steps/summary-with-confirm-step.types';
import { WizardOrganisationUnitActivateUsersStepComponent } from './steps/users-step.component';
import { UsersStepInputType, UsersStepOutputType } from './steps/users-step.types';

import { AdminOrganisationsService } from '@modules/feature-modules/admin/services/admin-organisations.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

@Component({
  selector: 'app-admin-pages-organisations-organisation-unit-activate',
  templateUrl: './organisation-unit-activate.component.html'
})
export class WizardOrganisationUnitActivateComponent extends CoreComponent implements OnInit {
  wizard = new WizardModel<{
    organisation: { id: string };
    organisationUnit: { id: string; name: string };
    usersStep: { agree: boolean; users: { id: string; name: string; organisationRole: string }[] };
  }>({});

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService,
    private adminOrganisationsService: AdminOrganisationsService
  ) {
    super();
    this.setPageTitle('Inactivate organisation unit');

    this.wizard.data = {
      organisation: { id: this.activatedRoute.snapshot.params.organisationId },
      organisationUnit: { id: this.activatedRoute.snapshot.params.organisationUnitId, name: '' },
      usersStep: { agree: false, users: [] }
    };
  }

  ngOnInit(): void {
    this.organisationsService
      .getOrganisationUnitInfo(this.wizard.data.organisation.id, this.wizard.data.organisationUnit.id)
      .subscribe(
        response => {
          this.wizard.data.organisationUnit.name = response.name;

          this.wizard
            .addStep(
              new WizardStepModel<UsersStepInputType, UsersStepOutputType>({
                id: 'usersStep',
                title: 'Activate unit',
                component: WizardOrganisationUnitActivateUsersStepComponent,
                data: {
                  organisation: this.wizard.data.organisation,
                  organisationUnit: this.wizard.data.organisationUnit,
                  agreeUsers: false,
                  users: []
                },
                outputs: {
                  previousStepEvent: data => this.onPreviousStep(data),
                  nextStepEvent: data => this.onNextStep(data, this.onUsersStepOut, this.onSummaryStepIn)
                }
              })
            )
            .addStep(
              new WizardStepModel<SummaryWithConfirmStepInputType, SummaryWithConfirmStepOutputType>({
                id: 'summaryStep',
                title: 'Check answers',
                component: WizardSummaryWithConfirmStepComponent,
                data: {
                  summary: [],
                  confirmCheckbox: { label: '' },
                  submitButton: { label: '', active: true }
                },
                outputs: {
                  previousStepEvent: data => this.onPreviousStep(data, this.onSummaryStepOut, this.onUsersStepIn),
                  submitEvent: data => this.onSubmit(data)
                }
              })
            );

          this.setPageStatus('READY');
        },
        () => {
          this.setPageStatus('ERROR');
          this.setAlertUnknownError();
        }
      );
  }

  onPreviousStep<T extends WizardStepEventType<MappedObjectType>>(stepData: T, ...args: ((data: T) => void)[]): void {
    this.resetAlert();

    if (this.wizard.currentStepNumber() === 1) {
      this.redirectTo(
        `/admin/organisations/${this.wizard.data.organisation.id}/unit/${this.wizard.data.organisationUnit.id}`
      );
      return;
    }

    args.forEach(element => element.bind(this)(stepData));
    this.wizard.gotoPreviousStep();
  }

  onNextStep<T extends WizardStepEventType<MappedObjectType>>(stepData: T, ...args: ((data: T) => void)[]): void {
    this.resetAlert();

    args.forEach(element => element.bind(this)(stepData));
    this.wizard.gotoNextStep();
  }

  // Steps mappings.
  onUsersStepIn(): void {
    this.wizard.setStepData<UsersStepInputType>('usersStep', {
      organisation: this.wizard.data.organisation,
      organisationUnit: this.wizard.data.organisationUnit,
      agreeUsers: this.wizard.data.usersStep.agree,
      users: this.wizard.data.usersStep.users
    });
  }
  onUsersStepOut(stepData: WizardStepEventType<UsersStepOutputType>): void {
    this.wizard.data.usersStep = {
      agree: stepData.data.agreeUsers,
      users: stepData.data.users
    };
  }

  onSummaryStepIn(): void {
    this.wizard.setStepData<SummaryWithConfirmStepInputType>('summaryStep', {
      summary: [
        { label: 'Unit', value: this.wizard.data.organisationUnit.name },
        {
          label: 'Users',
          value: this.wizard.data.usersStep.users
            .map(item => `${item.name} (${this.ctx.user.getRoleDescription(item.organisationRole)})`)
            .join('\n')
        }
      ],
      confirmCheckbox: {
        label:
          'I confirm that once the organisation unit is activated, it will be seen on the Innovation Service platform'
      },
      submitButton: { label: 'Confirm activation', active: true }
    });
  }
  onSummaryStepOut(stepData: WizardStepEventType<SummaryWithConfirmStepOutputType>): void {}

  onSubmit(stepData: WizardStepEventType<SummaryWithConfirmStepOutputType>): void {
    if (!stepData.data.confirm) {
      return;
    } // Just a sanity check. Should never happen.

    this.setPageStatus('LOADING');

    this.adminOrganisationsService
      .activateOrganisationUnit(
        this.wizard.data.organisation.id,
        this.wizard.data.organisationUnit.id,
        this.wizard.data.usersStep.users.map(item => item.id)
      )
      .subscribe({
        next: () => {
          this.setRedirectAlertSuccess('You have successfully activated the organisation unit');
          this.redirectTo(
            `/admin/organisations/${this.wizard.data.organisation.id}/unit/${this.wizard.data.organisationUnit.id}`
          );
        },
        error: () => {
          this.onSummaryStepIn();
          this.setAlertUnknownError();
        }
      });
  }
}
