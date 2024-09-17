import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, of, switchMap } from 'rxjs';

import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { ContextInnovationType, MappedObjectType, WizardStepEventType } from '@app/base/types';

import { InnovationCollaboratorsListDTO } from '@modules/shared/services/innovations.dtos';
import {
  InnovationsService,
  ThreadAvailableRecipientsDTO,
  UploadThreadDocumentType
} from '@modules/shared/services/innovations.service';
import { InnovationStatusEnum } from '@modules/stores/innovation';

import { WizardInnovationThreadNewOrganisationsStepComponent } from './steps/organisations-step.component';
import { OrganisationsStepInputType, OrganisationsStepOutputType } from './steps/organisations-step.types';
import { WizardInnovationThreadNewSubjectMessageStepComponent } from './steps/subject-message-step.component';
import { SubjectMessageStepInputType, SubjectMessageStepOutputType } from './steps/subject-message-step.types';
import { WizardInnovationThreadNewWarningStepComponent } from './steps/warning-step.component';
import { WarningStepInputType, WarningStepOutputType } from './steps/warning-step.types';
import { FileUploadService } from '@modules/shared/services/file-upload.service';
import { omit } from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'shared-pages-innovation-messages-wizard-thread-new',
  templateUrl: './thread-new.component.html'
})
export class WizardInnovationThreadNewComponent extends CoreComponent implements OnInit {
  sectionId?: string;
  innovation: ContextInnovationType;
  isInnovatorType: boolean;

  wizard = new WizardModel<{
    innovationOwnerAndCollaborators: { name: string; role: string }[];
    organisationsStep: {
      organisationUnits: { id: string; name: string; users: { id: string; roleId: string; name: string }[] }[];
    };
    subjectMessageStep: {
      subject: string;
      message: string;
      file: null | File;
      fileName: string;
    };
  }>({});

  datasets: {
    organisationUnits: ThreadAvailableRecipientsDTO;
  };

  constructor(
    private innovationsService: InnovationsService,
    private fileUploadService: FileUploadService,
    private activatedRoute: ActivatedRoute
  ) {
    super();

    this.sectionId = this.activatedRoute.snapshot.queryParams.sectionId;

    this.innovation = this.stores.context.getInnovation();

    this.isInnovatorType = this.stores.authentication.isInnovatorType();

    this.wizard.data = {
      innovationOwnerAndCollaborators:
        this.innovation.owner && this.innovation.owner.isActive
          ? [{ name: this.innovation.owner?.name ?? '', role: 'Owner' }]
          : [],
      organisationsStep: { organisationUnits: [] },
      subjectMessageStep: { subject: '', message: '', file: null, fileName: '' }
    };

    this.datasets = {
      organisationUnits: []
    };
  }

  ngOnInit(): void {
    const subscriptions: {
      empty: Observable<null>;
      collaborators?: Observable<InnovationCollaboratorsListDTO>;
      threadAvailableRecipients?: Observable<ThreadAvailableRecipientsDTO>;
    } = {
      empty: of(null)
    };

    if (this.stores.authentication.isAssessmentType() || this.stores.authentication.isAccessorType()) {
      subscriptions.collaborators = this.innovationsService.getInnovationCollaboratorsList(this.innovation.id, [
        'active'
      ]);
    }

    if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS && !this.stores.authentication.isAdminRole()) {
      subscriptions.threadAvailableRecipients = this.innovationsService.getThreadAvailableRecipients(
        this.innovation.id
      );
    }

    forkJoin(subscriptions).subscribe({
      next: response => {
        if (response.collaborators) {
          this.wizard.data.innovationOwnerAndCollaborators = [
            ...this.wizard.data.innovationOwnerAndCollaborators,
            ...response.collaborators.data
              .filter(c => c.isActive)
              .map(item => ({ name: item.name ?? '', role: 'Collaborator' })) // maybe do item.role ?? 'Collaborator' in the future
          ];
        }

        if (response.threadAvailableRecipients) {
          this.datasets.organisationUnits = response.threadAvailableRecipients;

          // Filter out the user unit, if accessor.
          if (this.stores.authentication.isAccessorType()) {
            this.datasets.organisationUnits = this.datasets.organisationUnits.filter(
              item =>
                item.organisation.unit.id !== this.stores.authentication.getUserContextInfo()?.organisationUnit?.id
            );
          }

          // Show warning step if there's no units to display.
          if (this.isInnovatorType && this.datasets.organisationUnits.length === 0) {
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
                title: this.isInnovatorType
                  ? 'Select the support organisations you want to message'
                  : 'Would you like to notify other support organisations about this message?',
                component: WizardInnovationThreadNewOrganisationsStepComponent,
                data: {
                  innovation: { id: this.innovation.id },
                  organisationUnits: this.datasets.organisationUnits,
                  selectedOrganisationUnits: [],
                  activeInnovators: this.wizard.data.innovationOwnerAndCollaborators.length > 0
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
              subject: this.getThreadSubject(),
              message: this.getThreadMessage(),
              file: null,
              fileName: ''
            },
            outputs: {
              previousStepEvent: data =>
                this.onPreviousStep(data, this.onSubjectMessageStepOut, this.onOrganisationsStepIn),
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

  getSubmittedSectionText() {
    let submittedSectionText = '';

    if (this.sectionId) {
      const sectionIdentification = this.stores.schema.getIrSchemaSectionIdentificationV3(this.sectionId);
      submittedSectionText = sectionIdentification
        ? `${sectionIdentification?.group.number}.${sectionIdentification?.section.number} '${sectionIdentification?.section.title}'`
        : '';
    }

    return submittedSectionText;
  }

  getThreadSubject(): string {
    let subject = this.wizard.data.subjectMessageStep.subject;

    if (this.isInnovatorType && this.sectionId && !subject) {
      const sectionIdentification = this.stores.schema.getIrSchemaSectionIdentificationV3(this.sectionId);
      subject = sectionIdentification ? `Innovation record update to section ${this.getSubmittedSectionText()}` : '';
    }

    return subject;
  }

  getThreadMessage(): string {
    let message = this.wizard.data.subjectMessageStep.message;

    if (this.isInnovatorType && this.sectionId && !message) {
      message = `Please take a look at the changes I have made to section ${this.getSubmittedSectionText()}.  \n\nThe main changes I have made are: `;
    }

    return message;
  }

  onPreviousStep<T extends WizardStepEventType<MappedObjectType>>(stepData: T, ...args: ((data: T) => void)[]): void {
    this.resetAlert();

    if (this.wizard.currentStepNumber() === 1) {
      if (this.isInnovatorType && this.sectionId) {
        this.redirectTo(
          `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}/record/sections/${this.sectionId}/submitted`
        );
      } else {
        this.redirectToThreadsList();
      }

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
      selectedOrganisationUnits: this.wizard.data.organisationsStep.organisationUnits.map(item => item.id),
      activeInnovators: this.wizard.data.innovationOwnerAndCollaborators.length > 0
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
      subject: this.getThreadSubject(),
      message: this.getThreadMessage(),
      file: this.wizard.data.subjectMessageStep.file,
      fileName: this.wizard.data.subjectMessageStep.fileName
    });
  }
  onSubjectMessageStepOut(stepData: WizardStepEventType<SubjectMessageStepOutputType>): void {
    this.wizard.data.subjectMessageStep = {
      subject: stepData.data.subject,
      message: stepData.data.message,
      file: stepData.data.file,
      fileName: stepData.data.fileName
    };
  }

  onSubmit(): void {
    this.setPageStatus('LOADING');

    const file = this.wizard.data.subjectMessageStep.file;

    let body: UploadThreadDocumentType = {
      followerUserRoleIds: this.getNotifiableTeamsList().followersUserRoleIds,
      subject: this.wizard.data.subjectMessageStep.subject,
      message: this.wizard.data.subjectMessageStep.message
    };

    if (file) {
      const httpUploadBody = { userId: this.stores.authentication.getUserId(), innovationId: this.innovation.id };

      this.fileUploadService
        .uploadFile(httpUploadBody, file)
        .pipe(
          switchMap(response => {
            const fileData = omit(response, 'url');
            body = {
              ...body,
              file: {
                name: this.wizard.data.subjectMessageStep.fileName,
                file: fileData
              }
            };
            return this.innovationsService.createThread(this.innovation.id, body);
          })
        )
        .subscribe({
          next: () => {
            this.setRedirectAlertSuccess('The message has been sent successfully', {
              message: 'Your file has been added to file library.'
            });
            this.redirectToThreadsList();
          },
          error: () => {
            this.setAlertUnknownError();
            this.setPageStatus('READY');
          }
        });
    } else {
      this.createThread(body);
    }
  }

  createThread(body: UploadThreadDocumentType) {
    this.innovationsService.createThread(this.innovation.id, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('The message has been sent successfully');
        this.redirectToThreadsList();
      },
      error: () => {
        this.setAlertUnknownError();
        this.setPageStatus('READY');
      }
    });
  }

  private getNotifiableTeamsList(): {
    followersUserRoleIds: string[];
    visibleList: SubjectMessageStepInputType['teams'];
  } {
    if (this.stores.authentication.isAssessmentType() || this.stores.authentication.isAccessorType()) {
      return {
        followersUserRoleIds: this.wizard.data.organisationsStep.organisationUnits.flatMap(item =>
          item.users.map(u => u.roleId)
        ),
        visibleList: [
          {
            name: 'Innovators',
            users: this.wizard.data.innovationOwnerAndCollaborators.map(item => ({
              name: `${item.name} (${item.role})`
            }))
          },
          ...this.wizard.data.organisationsStep.organisationUnits.map(item => ({ name: item.name, users: item.users }))
        ]
      };
    } else if (this.stores.authentication.isInnovatorType()) {
      if (
        [InnovationStatusEnum.NEEDS_ASSESSMENT, InnovationStatusEnum.AWAITING_NEEDS_REASSESSMENT].includes(
          this.innovation.status
        ) &&
        this.innovation.assignedTo
      ) {
        return {
          followersUserRoleIds: [this.innovation.assignedTo.userRoleId],
          visibleList: [
            {
              name: 'Needs assessment team',
              users: [{ name: this.innovation.assignedTo.name }]
            }
          ]
        };
      } else if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS) {
        return {
          followersUserRoleIds: this.wizard.data.organisationsStep.organisationUnits.flatMap(item =>
            item.users.map(u => u.roleId)
          ),
          visibleList: this.wizard.data.organisationsStep.organisationUnits.map(item => ({
            name: item.name,
            users: item.users
          }))
        };
      } else {
        return { followersUserRoleIds: [], visibleList: [] };
      }
    } else {
      // Should never happen!
      return { followersUserRoleIds: [], visibleList: [] };
    }
  }

  private redirectToThreadsList(): void {
    this.redirectTo(`${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}/threads`);
  }
}
