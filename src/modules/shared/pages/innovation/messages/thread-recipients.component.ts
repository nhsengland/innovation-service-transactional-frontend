import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { ContextInnovationType, MappedObjectType, WizardStepEventType } from '@app/base/types';
import { WizardInnovationThreadNewOrganisationsStepComponent } from '@modules/shared/pages/innovation/messages/wizard-thread-new/steps/organisations-step.component';
import { OrganisationsStepInputType, OrganisationsStepOutputType } from '@modules/shared/pages/innovation/messages/wizard-thread-new/steps/organisations-step.types';
import { InnovationSupportsListDTO } from '@modules/shared/services/innovations.dtos';
import { GetThreadFollowersDTO, InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { forkJoin, Observable, of } from 'rxjs';


@Component({
  selector: 'shared-pages-innovation-messages-thread-recipients',
  templateUrl: './thread-recipients.component.html'
})
export class PageInnovationThreadRecipientsComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType;
  threadId: string;

  threadFollowers: GetThreadFollowersDTO['followers'] | null = null;
  engagingOrganisationUnits: InnovationSupportsListDTO;

  wizard = new WizardModel<{
    organisationsStep: {
      organisationUnits: { id: string, name: string, users: { id: string, userRoleId: string, name: string }[] }[]
    },
  }>({});


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super ();

    this.innovation = this.stores.context.getInnovation();
    this.threadId = this.activatedRoute.snapshot.params.threadId;

    this.engagingOrganisationUnits = [];

    this.wizard.data = {
      organisationsStep: { organisationUnits: [] }
    };

  }

  ngOnInit() {

    this.setPageStatus('LOADING');

    const subscriptions: {
      threadFollowers: Observable<GetThreadFollowersDTO>,
      supports?: Observable<InnovationSupportsListDTO>
    } = {
      threadFollowers: this.innovationsService.getThreadFollowers(this.innovation.id, this.threadId)
    };

    if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS && !this.stores.authentication.isAdminRole()) {
      subscriptions.supports = this.innovationsService.getInnovationSupportsList(this.innovation.id, true);
    }

    forkJoin(subscriptions).subscribe({
      next: (response) => {

        this.threadFollowers = response.threadFollowers.followers.filter(follower => !follower.isLocked); //remove locked users;

        if (response.supports) {

          // Engaging organisation units except the user unit, if accessor.
          this.engagingOrganisationUnits = response.supports.filter(item => item.status === InnovationSupportStatusEnum.ENGAGING);

          if (this.stores.authentication.isAccessorType()) {
            this.engagingOrganisationUnits = this.engagingOrganisationUnits.filter(item => item.organisation.unit.id !== this.stores.authentication.getUserContextInfo()?.organisationUnit?.id);
          }

          // Keep only active engaging accessors that are not followers
          this.engagingOrganisationUnits = this.engagingOrganisationUnits.map(item => {
            return {
              ...item,
              engagingAccessors: item.engagingAccessors.filter(accessor => accessor.isActive && (this.threadFollowers && !this.threadFollowers.map(follower => follower.role.id).includes(accessor.userRoleId)))
            }
          });

          this.engagingOrganisationUnits = this.engagingOrganisationUnits.filter(item => item.engagingAccessors.length > 0);


          this.wizard.addStep(
            new WizardStepModel<OrganisationsStepInputType, OrganisationsStepOutputType>({
              id: 'organisationsStep',
              title: this.stores.authentication.isInnovatorType() ? 'Who do you want to notify about this message?' : 'Would you like to notify other support organisations about this message?',
              isSubmitStep: true,
              component: WizardInnovationThreadNewOrganisationsStepComponent,
              data: {
                innovation: { id: this.innovation.id },
                organisationUnits: this.engagingOrganisationUnits,
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

    console.log("body", body);

    this.innovationsService.addThreadFollowers(this.innovation.id, this.threadId, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('The recipients you selected have been added to this thread.', { message: 'They will be notified when you send the message.' });
        this.redirectToThread();
      },
      error: () => this.setAlertUnknownError()
    });

  }

  private redirectToThread(): void {
    this.redirectTo(`${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}/threads/${this.threadId}`);
  }

  private getNotifiableTeamsList(): { followersUserRoleIds: string[] } {

    if (this.stores.authentication.isAssessmentType() || this.stores.authentication.isAccessorType()) {

      return {
        followersUserRoleIds: this.wizard.data.organisationsStep.organisationUnits.flatMap(item => item.users.map(u => u.userRoleId))
      };

    } else if (this.stores.authentication.isInnovatorType()) {

      if ([InnovationStatusEnum.NEEDS_ASSESSMENT, InnovationStatusEnum.AWAITING_NEEDS_REASSESSMENT].includes(this.innovation.status) && this.innovation.assignedTo) {
        return {
          followersUserRoleIds: [this.innovation.assignedTo.userRoleId]
        };
      } else if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS) {
        return {
          followersUserRoleIds: this.wizard.data.organisationsStep.organisationUnits.flatMap(item => item.users.map(u => u.userRoleId))
        };
      } else {
        return { followersUserRoleIds: [] };
      }

    } else { // Should never happen!
      console.error('No one to notify!');
      return { followersUserRoleIds: [] };
    }


  }


}
