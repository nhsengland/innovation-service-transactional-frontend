import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { MappedObjectType, WizardStepEventType } from '@app/base/types';

import { WizardOrganisationUnitInactivateUsersStepComponent } from './steps/users-step.component';
import { UsersStepInputType, UsersStepOutputType } from './steps/users-step.types';
import { WizardOrganisationUnitInactivateInnovationsStepComponent } from './steps/innovations-step.component';
import { InnovationsStepInputType, InnovationsStepOutputType } from './steps/innovations-step.types';
import { SummaryWithConfirmStepInputType, SummaryWithConfirmStepOutputType } from '@modules/shared/wizards/steps/summary-with-confirm-step.types';
import { WizardSummaryWithConfirmStepComponent } from '@modules/shared/wizards/steps/summary-with-confirm-step.component';

import { OrganisationsService } from '@modules/feature-modules/admin/services/organisations.service';


@Component({
  selector: 'app-admin-pages-organisations-organisation-unit-inactivate',
  templateUrl: './organisation-unit-inactivate.component.html'
})
export class WizardOrganisationUnitInactivateComponent extends CoreComponent implements OnInit {

  wizard = new WizardModel<{
    organisation: { id: string },
    organisationUnit: { id: string, name: string },
    usersStep: { agree: boolean, count: number },
    innovationsStep: { agree: boolean, count: number }
  }>({});


  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService
  ) {

    super();
    this.setPageTitle('Inactivate organisation unit');

    this.wizard.data = {
      organisation: { id: this.activatedRoute.snapshot.params.organisationId },
      organisationUnit: { id: this.activatedRoute.snapshot.params.organisationUnitId, name: '' },
      usersStep: { agree: false, count: 0 },
      innovationsStep: { agree: false, count: 0 }
    };

  }

  ngOnInit(): void {

    this.organisationsService.getOrganisationUnitInfo(this.wizard.data.organisation.id, this.wizard.data.organisationUnit.id).subscribe(
      response => {

        this.wizard.data.organisationUnit.name = response.name;

        this.wizard.
          addStep(
            new WizardStepModel<UsersStepInputType, UsersStepOutputType>({
              id: 'usersStep',
              title: 'Users attached',
              component: WizardOrganisationUnitInactivateUsersStepComponent,
              data: {
                organisation: this.wizard.data.organisation,
                organisationUnit: this.wizard.data.organisationUnit,
                agreeUsers: false
              },
              outputs: {
                previousStepEvent: data => this.onPreviousStep(data),
                nextStepEvent: data => this.onNextStep(data, this.onUsersStepOut, this.onInnovationsStepIn)
              }
            })
          )
          .addStep(
            new WizardStepModel<InnovationsStepInputType, InnovationsStepOutputType>({
              id: 'innovationsStep',
              title: 'Innovations attached',
              component: WizardOrganisationUnitInactivateInnovationsStepComponent,
              data: {
                organisation: this.wizard.data.organisation,
                organisationUnit: this.wizard.data.organisationUnit,
                agreeInnovations: false
              },
              outputs: {
                previousStepEvent: data => this.onPreviousStep(data, this.onInnovationsStepOut, this.onUsersStepIn),
                nextStepEvent: data => this.onNextStep(data, this.onInnovationsStepOut, this.onSummaryStepIn),
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
                previousStepEvent: data => this.onPreviousStep(data, this.onInnovationsStepIn),
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
      this.redirectTo(`/admin/organisations/${this.wizard.data.organisation.id}`);
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
      agreeUsers: this.wizard.data.usersStep.agree
    });
  }
  onUsersStepOut(stepData: WizardStepEventType<UsersStepOutputType>): void {
    this.wizard.data.usersStep = {
      agree: stepData.data.agreeUsers,
      count: stepData.data.userCount
    };
  }

  onInnovationsStepIn(): void {
    this.wizard.setStepData<InnovationsStepInputType>('innovationsStep', {
      organisation: this.wizard.data.organisation,
      organisationUnit: this.wizard.data.organisationUnit,
      agreeInnovations: this.wizard.data.innovationsStep.agree
    });
  }
  onInnovationsStepOut(stepData: WizardStepEventType<InnovationsStepOutputType>): void {
    this.wizard.data.innovationsStep = {
      agree: stepData.data.agreeInnovations,
      count: stepData.data.innovationsCount
    };
  }

  onSummaryStepIn(): void {
    this.wizard.setStepData<SummaryWithConfirmStepInputType>('summaryStep', {
      summary: [
        { label: `${this.wizard.data.usersStep.count.toString()} users will be locked` },
        { label: `${this.wizard.data.innovationsStep.count.toString()} innovation supports will be completed` }
      ],
      confirmCheckbox: { label: `I understand that when this unit is inactivated, if the organisation has no more units, it will also be inactivated and not be seen on the Innovation Service platform` },
      submitButton: { label: 'Confirm inactivation', active: true }
    });
  }


  onSubmit(stepData: WizardStepEventType<SummaryWithConfirmStepOutputType>): void {

    if (!stepData.data.confirm) { return; } // Just a sanity check. Should never happen.

    
    this.setPageStatus('LOADING');
    this.organisationsService.inactivateOrganisationUnit(this.wizard.data.organisation.id, this.wizard.data.organisationUnit.id).subscribe(
      () => this.redirectTo(`/admin/organisations/${this.wizard.data.organisation.id}`, { alert: 'organisationUnitInactivateSuccess' }),
      () => {
        this.onSummaryStepIn();
        this.setAlertUnknownError();
      }
    );

  }

}
