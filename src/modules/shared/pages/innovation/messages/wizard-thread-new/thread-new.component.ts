import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { MappedObjectType, WizardStepEventType } from '@app/base/types';

import { WizardInnovationThreadNewOrganisationsStepComponent } from './steps/organisations-step.component';
import { OrganisationsStepInputType, OrganisationsStepOutputType } from './steps/organisations-step.types';
import { WizardInnovationThreadNewSubjectMessageStepComponent } from './steps/subject-message-step.component';
import { SubjectMessageStepInputType, SubjectMessageStepOutputType } from './steps/subject-message-step.types';


@Component({
  selector: 'shared-pages-innovation-messages-wizard-thread-new',
  templateUrl: './thread-new.component.html'
})
export class WizardInnovationThreadNewComponent extends CoreComponent implements OnInit {

  wizard = new WizardModel<{
    innovation: { id: string },
    organisationsStep: { usersList: string[] },
    subjectMessageStep: { subject: string, message: string }
  }>({});


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.wizard.data = {
      innovation: { id: this.activatedRoute.snapshot.params.innovationId },
      organisationsStep: { usersList: [] },
      subjectMessageStep: { subject: '', message: '' }
    };

  }

  ngOnInit(): void {

    this.wizard
      .addStep(
        new WizardStepModel<OrganisationsStepInputType, OrganisationsStepOutputType>({
          id: 'organisationsStep',
          title: 'Who do you want to notify about this message?',
          component: WizardInnovationThreadNewOrganisationsStepComponent,
          data: {
            innovation: this.wizard.data.innovation,
            selectedUsersList: []
          },
          outputs: {
            previousStepEvent: data => this.onPreviousStep(data),
            nextStepEvent: data => this.onNextStep(data, this.onOrganisationsStepOut, this.onSubjectMessageStepIn)
          }
        })
      )
      .addStep(
        new WizardStepModel<SubjectMessageStepInputType, SubjectMessageStepOutputType>({
          id: 'titleMessageStep',
          title: 'Start new thread',
          component: WizardInnovationThreadNewSubjectMessageStepComponent,
          data: { subject: '', message: '' },
          outputs: {
            previousStepEvent: data => this.onPreviousStep(data, this.onSubjectMessageStepOut, this.onOrganisationsStepIn),
            submitEvent: data => this.onSubmitStep(data, this.onSubjectMessageStepOut),
            cancelEvent: () => this.onCancel()
          }
        })
      );

    this.setPageStatus('READY');

  }


  onPreviousStep<T extends WizardStepEventType<MappedObjectType>>(stepData: T, ...args: ((data: T) => void)[]): void {

    this.resetAlert();

    if (this.wizard.currentStepNumber() === 1) { this.onCancel(); return; }

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
      innovation: this.wizard.data.innovation,
      selectedUsersList: this.wizard.data.organisationsStep.usersList
    });
  }
  onOrganisationsStepOut(stepData: WizardStepEventType<OrganisationsStepOutputType>): void {
    this.wizard.data.organisationsStep = {
      usersList: stepData.data.usersList
    };
  }

  onSubjectMessageStepIn(): void {
    this.wizard.setStepData<SubjectMessageStepInputType>('titleMessageStep', {
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




  // onSummaryStepIn(): void {
  //   this.wizard.setStepData<SummaryWithConfirmStepInputType>('summaryStep', {
  //     summary: [
  //       { label: `${this.wizard.data.usersStep.count.toString()} users will be locked` },
  //       { label: `${this.wizard.data.innovationsStep.count.toString()} innovation supports will be completed` }
  //     ],
  //     confirmCheckbox: { label: `I understand that when this unit is inactivated, if the organisation has no more units, it will also be inactivated and not be seen on the Innovation Service platform` },
  //     submitButton: { label: 'Confirm inactivation', active: true }
  //   });
  // }


  onSubmit(): void {

    console.log('Was submitted!');

    // this.setPageStatus('LOADING');

    // this.adminOrganisationsService.inactivateOrganisationUnit(this.wizard.data.organisation.id, this.wizard.data.organisationUnit.id).subscribe({
    //   next: () => {
    //     this.setRedirectAlertSuccess('You have successfully inactivated the organisation unit');
    //     this.redirectTo(`/admin/organisations/${this.wizard.data.organisation.id}/unit/${this.wizard.data.organisationUnit.id}`);
    //   },
    //   error: () => {
    //     this.onSummaryStepIn();
    //     this.setAlertUnknownError();
    //   }
    // });

  }

  onCancel(): void {

    this.redirectTo(`${this.stores.authentication.userUrlBasePath()}/innovations/${this.wizard.data.innovation.id}/threads`);
  }

}
