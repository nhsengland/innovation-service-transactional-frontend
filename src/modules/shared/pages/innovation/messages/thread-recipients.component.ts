import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { ContextInnovationType, MappedObjectType, WizardStepEventType } from '@app/base/types';
import { WizardInnovationThreadNewOrganisationsStepComponent } from '@modules/shared/pages/innovation/messages/wizard-thread-new/steps/organisations-step.component';
import {
  OrganisationsStepInputType,
  OrganisationsStepOutputType
} from '@modules/shared/pages/innovation/messages/wizard-thread-new/steps/organisations-step.types';
import {
  GetThreadFollowersDTO,
  InnovationsService,
  ThreadAvailableRecipientsDTO
} from '@modules/shared/services/innovations.service';
import { InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'shared-pages-innovation-messages-thread-recipients',
  templateUrl: './thread-recipients.component.html'
})
export class PageInnovationThreadRecipientsComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  threadId: string;

  threadFollowers: GetThreadFollowersDTO['followers'] | null = null;

  wizard = new WizardModel<{
    organisationsStep: {
      organisationUnits: { id: string; name: string; users: { id: string; roleId: string; name: string }[] }[];
    };
  }>({});

  datasets: {
    organisationUnits: ThreadAvailableRecipientsDTO;
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovation = this.stores.context.getInnovation();
    this.threadId = this.activatedRoute.snapshot.params.threadId;

    this.wizard.data = {
      organisationsStep: { organisationUnits: [] }
    };

    this.datasets = {
      organisationUnits: []
    };
  }

  ngOnInit() {
    this.setPageStatus('LOADING');

    const subscriptions: {
      threadFollowers: Observable<GetThreadFollowersDTO>;
      threadAvailableRecipients?: Observable<ThreadAvailableRecipientsDTO>;
    } = {
      threadFollowers: this.innovationsService.getThreadFollowers(this.innovation.id, this.threadId)
    };

    if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS && !this.stores.authentication.isAdminRole()) {
      subscriptions.threadAvailableRecipients = this.innovationsService.getThreadAvailableRecipients(
        this.innovation.id
      );
    }

    forkJoin(subscriptions).subscribe({
      next: response => {
        this.threadFollowers = response.threadFollowers.followers.filter(follower => !follower.isLocked); //remove locked users;

        if (response.threadAvailableRecipients) {
          this.datasets.organisationUnits = response.threadAvailableRecipients;

          // Filter out the user unit, if accessor.
          if (this.stores.authentication.isAccessorType()) {
            this.datasets.organisationUnits = this.datasets.organisationUnits.filter(
              item =>
                item.organisation.unit.id !== this.stores.authentication.getUserContextInfo()?.organisationUnit?.id
            );
          }

          // Keep only accessors that are not followers.
          this.datasets.organisationUnits = this.datasets.organisationUnits.map(item => {
            return {
              ...item,
              recipients: item.recipients.filter(
                accessor =>
                  this.threadFollowers &&
                  !this.threadFollowers.map(follower => follower.role.id).includes(accessor.roleId)
              )
            };
          });

          this.datasets.organisationUnits = this.datasets.organisationUnits.filter(item => item.recipients.length > 0);

          this.wizard.addStep(
            new WizardStepModel<OrganisationsStepInputType, OrganisationsStepOutputType>({
              id: 'organisationsStep',
              title: 'Who do you want to notify about this message?',
              isSubmitStep: true,
              component: WizardInnovationThreadNewOrganisationsStepComponent,
              data: {
                innovation: { id: this.innovation.id },
                organisationUnits: this.datasets.organisationUnits,
                selectedOrganisationUnits: [],
                activeInnovators: false
              },
              outputs: {
                previousStepEvent: () => this.onPreviousStep(),
                submitEvent: data => this.onSubmitStep(data, this.onOrganisationsStepOut),
                cancelEvent: () => this.redirectToThread()
              }
            })
          );
        }

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  onPreviousStep(): void {
    this.resetAlert();
    this.redirectToThread();
  }

  onSubmitStep<T extends WizardStepEventType<MappedObjectType>>(stepData: T, ...args: ((data: T) => void)[]): void {
    this.resetAlert();

    args.forEach(element => element.bind(this)(stepData));
    this.onSubmit();
  }

  // Steps mappings.
  onOrganisationsStepOut(stepData: WizardStepEventType<OrganisationsStepOutputType>): void {
    this.wizard.data.organisationsStep = {
      organisationUnits: stepData.data.organisationUnits
    };
  }

  onSubmit(): void {
    const body = {
      followerUserRoleIds: this.getNotifiableTeamsList().followersUserRoleIds
    };

    this.innovationsService.addThreadFollowers(this.innovation.id, this.threadId, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('The recipients you selected have been added to this thread.', {
          message: 'They will be notified when you send the message.'
        });
        this.redirectToThread();
      },
      error: () => this.setAlertUnknownError()
    });
  }

  private redirectToThread(): void {
    this.redirectTo(
      `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}/threads/${this.threadId}`
    );
  }

  private getNotifiableTeamsList(): { followersUserRoleIds: string[] } {
    if (this.stores.authentication.isAssessmentType() || this.stores.authentication.isAccessorType()) {
      return {
        followersUserRoleIds: this.wizard.data.organisationsStep.organisationUnits.flatMap(item =>
          item.users.map(u => u.roleId)
        )
      };
    } else if (this.stores.authentication.isInnovatorType()) {
      if (
        [InnovationStatusEnum.NEEDS_ASSESSMENT, InnovationStatusEnum.AWAITING_NEEDS_REASSESSMENT].includes(
          this.innovation.status
        ) &&
        this.innovation.assignedTo
      ) {
        return {
          followersUserRoleIds: [this.innovation.assignedTo.userRoleId]
        };
      } else if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS) {
        return {
          followersUserRoleIds: this.wizard.data.organisationsStep.organisationUnits.flatMap(item =>
            item.users.map(u => u.roleId)
          )
        };
      } else {
        return { followersUserRoleIds: [] };
      }
    } else {
      // Should never happen!
      return { followersUserRoleIds: [] };
    }
  }
}
