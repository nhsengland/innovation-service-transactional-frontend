import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';

import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { ContextInnovationType, MappedObjectType, WizardStepEventType } from '@app/base/types';

import { InnovationCollaboratorsListDTO, InnovationSupportsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { WizardInnovationThreadNewOrganisationsStepComponent } from './steps/organisations-step.component';
import { OrganisationsStepInputType, OrganisationsStepOutputType } from './steps/organisations-step.types';
import { WizardInnovationThreadNewSubjectMessageStepComponent } from './steps/subject-message-step.component';
import { SubjectMessageStepInputType, SubjectMessageStepOutputType } from './steps/subject-message-step.types';
import { WizardInnovationThreadNewWarningStepComponent } from './steps/warning-step.component';
import { WarningStepInputType, WarningStepOutputType } from './steps/warning-step.types';


@Component({
  selector: 'shared-pages-innovation-messages-wizard-thread-new',
  templateUrl: './thread-new.component.html'
})
export class WizardInnovationThreadNewComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType;

  wizard = new WizardModel<{
    innovationOwnerAndCollaborators: { name: string, role: string }[],
    organisationsStep: {
      organisationUnits: { id: string, name: string, users: { id: string, userRoleId: string, name: string }[] }[]
    },
    subjectMessageStep: { subject: string, message: string }
  }>({});

  datasets: {
    organisationUnits: InnovationSupportsListDTO
  };


  constructor(
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovation = this.stores.context.getInnovation();

    this.wizard.data = {
      innovationOwnerAndCollaborators: this.innovation.owner ? [{ name: this.innovation.owner?.name ?? '', role: 'Owner' }] : [],
      organisationsStep: { organisationUnits: [] },
      subjectMessageStep: { subject: '', message: '' }
    };

    this.datasets = {
      organisationUnits: []
    };

  }

  ngOnInit(): void {

    const subscriptions: {
      empty: Observable<null>,
      collaborators?: Observable<InnovationCollaboratorsListDTO>
      supports?: Observable<InnovationSupportsListDTO>
    } = {
      empty: of(null)
    };

    if (this.stores.authentication.isAssessmentType() || this.stores.authentication.isAccessorType()) {
      subscriptions.collaborators = this.innovationsService.getInnovationCollaboratorsList(this.innovation.id, ['active']);
    }

    if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS && !this.stores.authentication.isAdminRole()) {
      subscriptions.supports = this.innovationsService.getInnovationSupportsList(this.innovation.id, true);
    }


    forkJoin(subscriptions).subscribe({
      next: response => {

        if (response.collaborators) {
          this.wizard.data.innovationOwnerAndCollaborators = [
            ...this.wizard.data.innovationOwnerAndCollaborators,
            ...response.collaborators.data.map(item => ({ name: item.name ?? '', role: 'Collaborator' })) // maybe do item.role ?? 'Collaborator' in the future
          ];
        }

        if (response.supports) {

          // Engaging organisation units except the user unit, if accessor.
          this.datasets.organisationUnits = response.supports.filter(item => item.status === InnovationSupportStatusEnum.ENGAGING);
          if (this.stores.authentication.isAccessorType()) {
            this.datasets.organisationUnits = this.datasets.organisationUnits.filter(item => item.organisation.unit.id !== this.stores.authentication.getUserContextInfo()?.organisationUnit?.id);
          }

          // Show first step if there's engaging organisations.
          if (this.stores.authentication.isInnovatorType() && this.datasets.organisationUnits.length === 0) {

            this.wizard.addStep(
              new WizardStepModel<WarningStepInputType, WarningStepOutputType>({
                id: 'WarningStep',
                title: 'You cannot start a new message thread',
                component: WizardInnovationThreadNewWarningStepComponent,
                data: {},
                outputs: {
                  cancelEvent: () => this.redirectToThreadsList()
                }
              })
            );

          } else if (this.datasets.organisationUnits.length > 0) {

            this.wizard.addStep(
              new WizardStepModel<OrganisationsStepInputType, OrganisationsStepOutputType>({
                id: 'organisationsStep',
                title: this.stores.authentication.isInnovatorType() ? 'Who do you want to notify about this message?' : 'Would you like to notify other support organisations about this message?',
                component: WizardInnovationThreadNewOrganisationsStepComponent,
                data: {
                  innovation: { id: this.innovation.id },
                  organisationUnits: this.datasets.organisationUnits,
                  selectedOrganisationUnits: []
                },
                outputs: {
                  previousStepEvent: data => this.onPreviousStep(data),
                  nextStepEvent: data => this.onNextStep(data, this.onOrganisationsStepOut, this.onSubjectMessageStepIn)
                }
              })
            );

          }
        }

        this.wizard.addStep(
          new WizardStepModel<SubjectMessageStepInputType, SubjectMessageStepOutputType>({
            id: 'titleMessageStep',
            title: 'Start a new thread',
            component: WizardInnovationThreadNewSubjectMessageStepComponent,
            data: {
              innovation: { id: this.innovation.id },
              teams: this.getNotifiableTeamsList().visibleList,
              subject: '',
              message: ''
            },
            outputs: {
              previousStepEvent: data => this.onPreviousStep(data, this.onSubjectMessageStepOut, this.onOrganisationsStepIn),
              submitEvent: data => this.onSubmitStep(data, this.onSubjectMessageStepOut),
              cancelEvent: () => this.redirectToThreadsList()
            }
          })
        );

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }


  onPreviousStep<T extends WizardStepEventType<MappedObjectType>>(stepData: T, ...args: ((data: T) => void)[]): void {

    this.resetAlert();

    if (this.wizard.currentStepNumber() === 1) { this.redirectToThreadsList(); return; }

    args.forEach(element => element.bind(this)(stepData));
    this.wizard.gotoPreviousStep();

  }

  onNextStep<T extends WizardStepEventType<MappedObjectType>>(stepData: T, ...args: ((data: T) => void)[]): void {

    this.resetAlert();

    args.forEach(element => element.bind(this)(stepData));
    this.wizard.gotoNextStep();

  }

  onSubmitStep<T extends WizardStepEventType<MappedObjectType>>(stepData: T, ...args: ((data: T) => void)[]): void {

    this.resetAlert();

    args.forEach(element => element.bind(this)(stepData));
    this.onSubmit();

  }



  // Steps mappings.
  onOrganisationsStepIn(): void {
    this.wizard.setStepData<OrganisationsStepInputType>('organisationsStep', {
      innovation: { id: this.innovation.id },
      organisationUnits: this.datasets.organisationUnits,
      selectedOrganisationUnits: this.wizard.data.organisationsStep.organisationUnits.map(item => item.id)
    });
  }
  onOrganisationsStepOut(stepData: WizardStepEventType<OrganisationsStepOutputType>): void {
    this.wizard.data.organisationsStep = {
      organisationUnits: stepData.data.organisationUnits
    };
  }

  onSubjectMessageStepIn(): void {
    this.wizard.setStepData<SubjectMessageStepInputType>('titleMessageStep', {
      innovation: { id: this.innovation.id },
      teams: this.getNotifiableTeamsList().visibleList,
      subject: this.wizard.data.subjectMessageStep.subject,
      message: this.wizard.data.subjectMessageStep.message
    });
  }
  onSubjectMessageStepOut(stepData: WizardStepEventType<SubjectMessageStepOutputType>): void {
    this.wizard.data.subjectMessageStep = {
      subject: stepData.data.subject,
      message: stepData.data.message
    };
  }


  onSubmit(): void {

    const body = {
      followerUserRoleIds: this.getNotifiableTeamsList().followersUserRoleIds,
      subject: this.wizard.data.subjectMessageStep.subject,
      message: this.wizard.data.subjectMessageStep.message
    };

    this.innovationsService.createThread(this.innovation.id, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('The message has been sent successfully');
        this.redirectToThreadsList();
      },
      error: () => this.setAlertUnknownError()
    });

  }


  private getNotifiableTeamsList(): { followersUserRoleIds: string[], visibleList: SubjectMessageStepInputType['teams'] } {

    if (this.stores.authentication.isAssessmentType() || this.stores.authentication.isAccessorType()) {

      return {
        followersUserRoleIds: this.wizard.data.organisationsStep.organisationUnits.flatMap(item => item.users.map(u => u.userRoleId)),
        visibleList: [
          { name: 'Innovators', users: this.wizard.data.innovationOwnerAndCollaborators.map(item => ({ name: `${item.name} (${item.role})` })) },
          ...this.wizard.data.organisationsStep.organisationUnits.map(item => ({ name: item.name, users: item.users }))
        ]
      };

    } else if (this.stores.authentication.isInnovatorType()) {

      if ([InnovationStatusEnum.NEEDS_ASSESSMENT, InnovationStatusEnum.AWAITING_NEEDS_REASSESSMENT].includes(this.innovation.status) && this.innovation.assignedTo) {
        return {
          followersUserRoleIds: [this.innovation.assignedTo.userRoleId],
          visibleList: [{
            name: 'Needs assessment team',
            users: [{ name: this.innovation.assignedTo.name }]
          }]
        };
      } else if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS) {
        return {
          followersUserRoleIds: this.wizard.data.organisationsStep.organisationUnits.flatMap(item => item.users.map(u => u.userRoleId)),
          visibleList: this.wizard.data.organisationsStep.organisationUnits.map(item => ({ name: item.name, users: item.users }))
        };
      } else {
        return { followersUserRoleIds: [], visibleList: [] };
      }

    } else { // Should never happen!
      console.error('No one to notify!');
      return { followersUserRoleIds: [], visibleList: [] };
    }


  }

  private redirectToThreadsList(): void {
    this.redirectTo(`${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}/threads`);
  }

}
