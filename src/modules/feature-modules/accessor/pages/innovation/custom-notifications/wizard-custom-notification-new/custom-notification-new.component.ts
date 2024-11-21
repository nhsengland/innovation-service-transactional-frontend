import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { WizardInnovationCustomNotificationNewNotificationStepComponent } from './steps/notification-step.component';
import { ContextInnovationType, MappedObjectType, WizardStepEventType } from '@app/base/types';
import { NotificationStepInputType, NotificationStepOutputType } from './steps/notification-step.types';
import { OrganisationsListDTO, OrganisationsService } from '@modules/shared/services/organisations.service';
import {
  Organisation,
  OrganisationsStepInputType,
  OrganisationsStepOutputType
} from './steps/organisations-step.types';
import { WizardInnovationCustomNotificationNewOrganisationsStepComponent } from './steps/organisations-step.component';
import { Unit, UnitsStepInputType, UnitsStepOutputType } from './steps/units-step.types';
import { SupportStatusesStepInputType, SupportStatusesStepOutputType } from './steps/support-statuses-step.types';
import { WizardInnovationCustomNotificationNewUnitsStepComponent } from './steps/units-step.component';
import { SummaryStepInputType } from './steps/summary-step.types';
import { WizardInnovationCustomNotificationNewSummaryStepComponent } from './steps/summary-step.component';
import { InnovationSupportStatusEnum } from '@modules/stores';
import { WizardInnovationCustomNotificationNewSupportStatusesStepComponent } from './steps/support-statuses-step.component';
import {
  AccessorService,
  GetNotifyMeInnovationSubscription,
  NotificationEnum,
  NotifyMeConfig
} from '@modules/feature-modules/accessor/services/accessor.service';
import { ObservableInput, forkJoin } from 'rxjs';
import { ReminderStepInputType, ReminderStepOutputType } from './steps/reminder-step.types';
import { WizardInnovationCustomNotificationNewReminderStepComponent } from './steps/reminder-step.component';
import { DateStepInputType, DateStepOutputType } from './steps/date-step.types';
import { WizardInnovationCustomNotificationNewDateStepComponent } from './steps/date-step.component';
import {
  InnovationRecordUpdateStepInputType,
  InnovationRecordUpdateStepOutputType
} from './steps/innovation-record-update-step.types';
import { WizardInnovationCustomNotificationNewInnovationRecordUpdateStepComponent } from './steps/innovation-record-update-step.component';
import { DatesHelper } from '@app/base/helpers';

type WizardData = {
  notificationStep: {
    notification: string;
  };
  organisationsStep: {
    organisations: Organisation[];
  };
  unitsStep: {
    units: Unit[];
  };
  supportStatusesStep: {
    supportStatuses: InnovationSupportStatusEnum[];
  };
  innovationRecordUpdateStep: {
    innovationRecordSections: (string | 'ALL')[];
  };
  reminderStep: {
    reminder: string;
  };
  dateStep: {
    day: string;
    month: string;
    year: string;
  };
};

export const wizardEmptyState = {
  organisationsStep: {
    organisations: []
  },
  unitsStep: {
    units: []
  },
  supportStatusesStep: {
    supportStatuses: []
  },
  innovationRecordUpdateStep: {
    innovationRecordSections: []
  },
  reminderStep: {
    reminder: ''
  },
  dateStep: {
    day: '',
    month: '',
    year: ''
  }
};

@Component({
  selector: 'app-accessor-innovation-custom-notification-new',
  templateUrl: './custom-notification-new.component.html'
})
export class WizardInnovationCustomNotificationNewComponent extends CoreComponent implements OnInit {
  subscriptionId: string;
  innovation: ContextInnovationType;

  subscription: GetNotifyMeInnovationSubscription;

  isEditMode: boolean;
  currentEditModeEntryStep = '';

  datasets: {
    organisations: Organisation[];
    sections: string[];
  };

  wizard = new WizardModel<WizardData>({});

  stepsDefinition: Record<string, WizardStepModel>;

  constructor(
    private organisationsService: OrganisationsService,
    private accessorService: AccessorService,
    private activatedRoute: ActivatedRoute
  ) {
    super();

    this.subscriptionId = this.activatedRoute.snapshot.params.subscriptionId;
    this.innovation = this.ctx.innovation.info();

    this.subscription = {
      id: '',
      updatedAt: '',
      eventType: NotificationEnum.SUPPORT_UPDATED,
      subscriptionType: 'INSTANTLY',
      organisations: [],
      status: []
    };

    this.isEditMode = !!this.subscriptionId;

    this.datasets = {
      organisations: [],
      sections: []
    };

    this.wizard.data = {
      notificationStep: {
        notification: ''
      },
      ...wizardEmptyState
    };

    this.stepsDefinition = {
      notificationStep: new WizardStepModel<NotificationStepInputType, NotificationStepOutputType>({
        id: 'notificationStep',
        title: 'What would you like to be notified about?',
        component: WizardInnovationCustomNotificationNewNotificationStepComponent,
        data: {
          selectedNotification: ''
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data),
          nextStepEvent: data =>
            this.onNextStep(
              data,
              this.onNotificationStepOut,
              this.onOrganisationsStepIn,
              this.onInnovationRecordUpdateStepIn,
              this.onReminderStepIn
            )
        }
      }),
      organisationsStep: new WizardStepModel<OrganisationsStepInputType, OrganisationsStepOutputType>({
        id: 'organisationsStep',
        title: 'Select organisations',
        component: WizardInnovationCustomNotificationNewOrganisationsStepComponent,
        data: {
          organisations: this.datasets.organisations,
          selectedOrganisations: []
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onOrganisationsStepOut, this.onNotificationStepIn),
          nextStepEvent: data => {
            this.onNextStep(data, this.onOrganisationsStepOut, this.onUnitsStepIn, this.onSupportStatusesStepIn);
            this.onSummaryStepIn();
          }
        }
      }),
      unitsStep: new WizardStepModel<UnitsStepInputType, UnitsStepOutputType>({
        id: 'unitsStep',
        title: 'Select organisation units',
        component: WizardInnovationCustomNotificationNewUnitsStepComponent,
        data: {
          selectedOrganisationsWithUnits: [],
          selectedUnits: []
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onUnitsStepOut, this.onOrganisationsStepIn),
          nextStepEvent: data => {
            this.onNextStep(data, this.onUnitsStepOut, this.onSupportStatusesStepIn);
            this.onSummaryStepIn();
          }
        }
      }),
      supportStatusesStep: new WizardStepModel<SupportStatusesStepInputType, SupportStatusesStepOutputType>({
        id: 'supportStatusesStep',
        title: 'Select support status',
        component: WizardInnovationCustomNotificationNewSupportStatusesStepComponent,
        data: {
          selectedSupportStatuses: []
        },
        outputs: {
          previousStepEvent: data =>
            this.onPreviousStep(data, this.onSupportStatusesStepOut, this.onOrganisationsStepIn, this.onUnitsStepIn),
          nextStepEvent: data => {
            this.onNextStep(data, this.onSupportStatusesStepOut);
            this.onSummaryStepIn();
          }
        }
      }),
      innovationRecordUpdateStep: new WizardStepModel<
        InnovationRecordUpdateStepInputType,
        InnovationRecordUpdateStepOutputType
      >({
        id: 'innovationRecordUpdateStep',
        title: 'Which section of the innovation record do you want to be notified about?',
        component: WizardInnovationCustomNotificationNewInnovationRecordUpdateStepComponent,
        data: {
          innovationRecordSections: [],
          selectedInnovationRecordSections: []
        },
        outputs: {
          previousStepEvent: data =>
            this.onPreviousStep(data, this.onInnovationRecordUpdateStepIn, this.onNotificationStepIn),
          nextStepEvent: data => {
            this.onNextStep(data, this.onInnovationRecordUpdateStepOut);
            this.onSummaryStepIn();
          }
        }
      }),
      reminderStep: new WizardStepModel<ReminderStepInputType, ReminderStepOutputType>({
        id: 'reminderStep',
        title: `Write your notification`,
        component: WizardInnovationCustomNotificationNewReminderStepComponent,
        data: {
          reminder: ''
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onReminderStepOut, this.onNotificationStepIn),
          nextStepEvent: data => this.onNextStep(data, this.onReminderStepOut, this.onDateStepIn)
        }
      }),
      dateStep: new WizardStepModel<DateStepInputType, DateStepOutputType>({
        id: 'dateStep',
        title: `Select date to receive this notification`,
        component: WizardInnovationCustomNotificationNewDateStepComponent,
        data: {
          day: '',
          month: '',
          year: ''
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onDateStepOut, this.onReminderStepIn),
          nextStepEvent: data => {
            this.onNextStep(data, this.onDateStepOut);
            this.onSummaryStepIn();
          }
        }
      }),
      summaryStep: new WizardStepModel<SummaryStepInputType, null>({
        id: 'summaryStep',
        title: '',
        component: WizardInnovationCustomNotificationNewSummaryStepComponent,
        data: {
          displayEditMode: false,
          notificationStep: {
            notification: ''
          },
          ...wizardEmptyState
        },
        outputs: {
          previousStepEvent: data =>
            this.onPreviousStep(
              data,
              this.onOrganisationsStepIn,
              this.onUnitsStepIn,
              this.onSupportStatusesStepIn,
              this.onInnovationRecordUpdateStepIn,
              this.onDateStepIn
            ),
          submitEvent: data => this.onSubmit(data),
          goToStepEvent: stepId => {
            if (this.isEditMode) {
              this.currentEditModeEntryStep = stepId;
            }
            this.onGoToStep(stepId);
          }
        }
      })
    };
  }

  ngOnInit() {
    const subscriptions: {
      organisationsList: ObservableInput<OrganisationsListDTO[]>;
      subscription?: ObservableInput<GetNotifyMeInnovationSubscription>;
    } = {
      organisationsList: this.organisationsService.getOrganisationsList({ unitsInformation: true })
    };

    if (this.isEditMode) {
      subscriptions.subscription = this.accessorService.getNotifyMeSubscription(this.subscriptionId);
    }

    forkJoin(subscriptions).subscribe({
      next: response => {
        // Get organisations information
        this.datasets.organisations = response.organisationsList.map(o => {
          const org = {
            id: o.id,
            name: o.name,
            units: o.organisationUnits.map(unit => ({ id: unit.id, name: unit.name }))
          };

          let description = undefined;
          if (org.units.length > 1) {
            const totalUnits = org.units.length;
            description = `${totalUnits} ${totalUnits > 1 ? 'units' : 'unit'} in this organisation. You can select specific units on the next page.`;
          }

          return { ...org, description };
        });

        // Get subscription information if editMode is true
        if (response.subscription) {
          this.subscription = response.subscription;

          // Set wizard data with current subscription information
          this.setWizardDataWithCurrentSubscriptionInfo();

          this.manageWizardSteps(this.wizard.data.notificationStep.notification);
          this.onGoToStep('summaryStep');
        } else {
          // Add notification step if editMode is false
          this.wizard.addStep(this.stepsDefinition.notificationStep);
        }

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  setWizardDataWithCurrentSubscriptionInfo() {
    this.wizard.data.notificationStep.notification = this.subscription.eventType;

    switch (this.subscription.eventType) {
      case NotificationEnum.SUPPORT_UPDATED:
      case NotificationEnum.PROGRESS_UPDATE_CREATED:
        const subscriptionOrganisationsIds = this.subscription.organisations.map(org => org.id);

        this.wizard.data.organisationsStep = {
          organisations: this.datasets.organisations.filter(org => subscriptionOrganisationsIds.includes(org.id))
        };
        this.wizard.data.unitsStep = {
          units: this.subscription.organisations
            .filter(
              subscriptionOrg =>
                (this.wizard.data.organisationsStep.organisations.find(
                  selectedOrg => selectedOrg.id === subscriptionOrg.id
                )?.units.length ?? 0) > 1
            )
            .flatMap(org => org.units)
        };

        if (this.subscription.eventType === NotificationEnum.SUPPORT_UPDATED) {
          this.wizard.data.supportStatusesStep = {
            supportStatuses: this.subscription.status
          };
        }

        break;

      case NotificationEnum.INNOVATION_RECORD_UPDATED:
        this.wizard.data.innovationRecordUpdateStep = {
          innovationRecordSections: this.subscription.sections ? this.subscription.sections : ['ALL']
        };

        break;

      case NotificationEnum.REMINDER:
        this.wizard.data.reminderStep = {
          reminder: this.subscription.customMessage
        };

        const date = new Date(this.subscription.date);
        this.wizard.data.dateStep = {
          day: date.getDate().toString().padStart(2, '0'),
          month: (date.getMonth() + 1).toString().padStart(2, '0'),
          year: date.getFullYear().toString()
        };

        break;
    }
  }

  // Steps mappings
  onNotificationStepIn(): void {
    this.wizard.setStepData<NotificationStepInputType>('notificationStep', {
      selectedNotification: this.wizard.data.notificationStep.notification
    });
  }

  onNotificationStepOut(stepData: WizardStepEventType<NotificationStepOutputType>): void {
    if (this.wizard.data.notificationStep.notification !== stepData.data.notification) {
      // Update wizard steps according to chosen notification
      this.manageWizardSteps(stepData.data.notification);
    }
    this.wizard.data.notificationStep = {
      notification: stepData.data.notification
    };
  }

  onOrganisationsStepIn(): void {
    this.wizard.setStepData<OrganisationsStepInputType>('organisationsStep', {
      organisations: this.datasets.organisations,
      selectedOrganisations: this.wizard.data.organisationsStep.organisations
    });
  }

  onOrganisationsStepOut(stepData: WizardStepEventType<OrganisationsStepOutputType>): void {
    this.wizard.data.organisationsStep = {
      organisations: stepData.data.organisations
    };

    this.manageUnitsStep();
  }

  onUnitsStepIn(): void {
    this.wizard.setStepData<UnitsStepInputType>('unitsStep', {
      selectedOrganisationsWithUnits: this.wizard.data.organisationsStep.organisations.filter(
        org => org.units.length > 1
      ),
      selectedUnits: this.wizard.data.unitsStep.units
    });
  }

  onUnitsStepOut(stepData: WizardStepEventType<UnitsStepOutputType>): void {
    this.wizard.data.unitsStep = {
      units: stepData.data.units
    };
  }

  onSupportStatusesStepIn(): void {
    this.wizard.setStepData<SupportStatusesStepInputType>('supportStatusesStep', {
      selectedSupportStatuses: this.wizard.data.supportStatusesStep.supportStatuses
    });
  }

  onSupportStatusesStepOut(stepData: WizardStepEventType<SupportStatusesStepOutputType>): void {
    this.wizard.data.supportStatusesStep = {
      supportStatuses: stepData.data.supportStatuses
    };
  }

  onInnovationRecordUpdateStepIn(): void {
    this.wizard.setStepData<InnovationRecordUpdateStepInputType>('innovationRecordUpdateStep', {
      innovationRecordSections: this.datasets.sections,
      selectedInnovationRecordSections: this.wizard.data.innovationRecordUpdateStep.innovationRecordSections
    });
  }

  onInnovationRecordUpdateStepOut(stepData: WizardStepEventType<InnovationRecordUpdateStepOutputType>): void {
    this.wizard.data.innovationRecordUpdateStep = {
      innovationRecordSections: stepData.data.innovationRecordSections
    };
  }

  onReminderStepIn(): void {
    this.wizard.setStepData<ReminderStepInputType>('reminderStep', {
      reminder: this.wizard.data.reminderStep.reminder
    });
  }

  onReminderStepOut(stepData: WizardStepEventType<ReminderStepOutputType>): void {
    this.wizard.data.reminderStep = {
      reminder: stepData.data.reminder
    };
  }

  onDateStepIn(): void {
    this.wizard.setStepData<DateStepInputType>('dateStep', {
      day: this.wizard.data.dateStep.day,
      month: this.wizard.data.dateStep.month,
      year: this.wizard.data.dateStep.year
    });
  }

  onDateStepOut(stepData: WizardStepEventType<DateStepOutputType>): void {
    this.wizard.data.dateStep = {
      day: stepData.data.day,
      month: stepData.data.month,
      year: stepData.data.year
    };
  }

  onSummaryStepIn(displayEditMode = false): void {
    // If user access summary in edit mode, display the current subscription information
    if (displayEditMode) {
      this.setWizardDataWithCurrentSubscriptionInfo();
    }

    this.wizard.setStepData<SummaryStepInputType>('summaryStep', {
      displayEditMode,
      notificationStep: this.wizard.data.notificationStep,
      organisationsStep: this.wizard.data.organisationsStep,
      unitsStep: this.wizard.data.unitsStep,
      supportStatusesStep: this.wizard.data.supportStatusesStep,
      innovationRecordUpdateStep: this.wizard.data.innovationRecordUpdateStep,
      reminderStep: this.wizard.data.reminderStep,
      dateStep: this.wizard.data.dateStep
    });
  }

  onPreviousStep<T extends WizardStepEventType<MappedObjectType | null>>(
    stepData: T,
    ...args: ((data: T) => void)[]
  ): void {
    this.resetAlert();

    if (this.wizard.isFirstStep()) {
      if (this.isEditMode) {
        this.onGoToStep('summaryStep');
      } else {
        this.redirectInnovationCustomNotifications();
      }
      return;
    }

    if (this.wizard.isLastStep() && this.wizard.currentStep().data.displayEditMode) {
      this.redirectInnovationCustomNotifications();
      return;
    }

    if (this.wizard.currentStep().id === this.currentEditModeEntryStep) {
      this.onGoToStep('summaryStep');
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

  onGoToStep(stepId: string): void {
    switch (stepId) {
      case 'notificationStep':
        this.onNotificationStepIn();
        break;
      case 'organisationsStep':
        this.onOrganisationsStepIn();
        break;
      case 'unitsStep':
        this.onUnitsStepIn();
        break;
      case 'supportStatusesStep':
        this.onSupportStatusesStepIn();
        break;
      case 'innovationRecordUpdateStep':
        this.onInnovationRecordUpdateStepIn();
        break;
      case 'reminderStep':
        this.onReminderStepIn();
        break;
      case 'dateStep':
        this.onDateStepIn();
        break;
      case 'summaryStep':
        this.onSummaryStepIn(this.isEditMode);
        break;
      default:
        return;
    }

    const nextStepNumber = this.wizard.steps.findIndex(step => step.id === stepId) + 1;

    if (nextStepNumber === undefined) {
      return;
    }

    this.wizard.gotoStep(nextStepNumber);
  }

  manageWizardSteps(notification: string): void {
    if (!this.isEditMode) {
      this.clearWizardData();
      this.clearWizardSteps();
    }
    switch (notification) {
      case NotificationEnum.SUPPORT_UPDATED:
        this.setWizardSteps([
          this.stepsDefinition.organisationsStep,
          this.stepsDefinition.supportStatusesStep,
          this.stepsDefinition.summaryStep
        ]);
        break;
      case NotificationEnum.PROGRESS_UPDATE_CREATED:
        this.setWizardSteps([this.stepsDefinition.organisationsStep, this.stepsDefinition.summaryStep]);
        break;
      case NotificationEnum.INNOVATION_RECORD_UPDATED:
        this.setWizardSteps([this.stepsDefinition.innovationRecordUpdateStep, this.stepsDefinition.summaryStep]);
        break;
      case NotificationEnum.REMINDER:
        this.setWizardSteps([
          this.stepsDefinition.reminderStep,
          this.stepsDefinition.dateStep,
          this.stepsDefinition.summaryStep
        ]);
        break;
    }
  }

  clearWizardData(): void {
    this.wizard.data = {
      notificationStep: this.wizard.data.notificationStep,
      ...wizardEmptyState
    };
  }

  clearWizardSteps(): void {
    const stepIds = Object.keys(this.stepsDefinition).filter(stepId => stepId !== 'notificationStep');
    stepIds.forEach(stepId => this.wizard.removeStep(stepId));
  }

  setWizardSteps(steps: WizardStepModel[]): void {
    steps.forEach(step => this.wizard.addStep(step));
  }

  manageUnitsStep(): void {
    const selectedOrganisationsHaveUnits = this.wizard.data.organisationsStep.organisations.some(
      org => org.units.length > 1
    );

    // If some selected organisation has more than one unit, add units step.
    // Otherwise, remove
    if (selectedOrganisationsHaveUnits) {
      this.wizard.addStep(this.stepsDefinition.unitsStep, 2 - Number(this.isEditMode));
    } else {
      this.wizard.removeStep('unitsStep');
      this.wizard.data.unitsStep.units = [];
    }
  }

  onSubmit<T extends WizardStepEventType<MappedObjectType | null>>(stepData: T, ...args: ((data: T) => void)[]): void {
    this.resetAlert();

    args.forEach(element => element.bind(this)(stepData));
    this.onSubmitWizard();
  }

  getSelectedUnitsIds(): string[] {
    const unitsIds = [
      ...this.wizard.data.organisationsStep.organisations
        .filter(org => org.units.length === 1)
        .map(org => org.units[0].id),
      ...this.wizard.data.unitsStep.units.map(unit => unit.id)
    ];
    return unitsIds;
  }

  getSelectedSections(): string[] {
    return this.wizard.data.innovationRecordUpdateStep.innovationRecordSections;
  }

  onSubmitWizard(): void {
    this.setPageStatus('LOADING');

    let body: NotifyMeConfig = {
      eventType: NotificationEnum.SUPPORT_UPDATED,
      subscriptionType: 'INSTANTLY',
      preConditions: {
        units: [],
        status: []
      }
    };

    switch (this.wizard.data.notificationStep.notification) {
      case NotificationEnum.SUPPORT_UPDATED:
        body = {
          eventType: NotificationEnum.SUPPORT_UPDATED,
          subscriptionType: 'INSTANTLY',
          preConditions: {
            units: this.getSelectedUnitsIds(),
            status: this.wizard.data.supportStatusesStep.supportStatuses
          }
        };
        break;
      case NotificationEnum.PROGRESS_UPDATE_CREATED:
        body = {
          eventType: NotificationEnum.PROGRESS_UPDATE_CREATED,
          subscriptionType: 'INSTANTLY',
          preConditions: {
            units: this.getSelectedUnitsIds()
          }
        };
        break;
      case NotificationEnum.INNOVATION_RECORD_UPDATED:
        const selectedSections = this.getSelectedSections();
        body = {
          eventType: NotificationEnum.INNOVATION_RECORD_UPDATED,
          subscriptionType: 'INSTANTLY',
          preConditions: {
            ...(!selectedSections.includes('ALL') && { sections: this.getSelectedSections() as string[] })
          }
        };
        break;
      case NotificationEnum.REMINDER:
        body = {
          eventType: NotificationEnum.REMINDER,
          subscriptionType: 'SCHEDULED',
          date: DatesHelper.getDateString(
            this.wizard.data.dateStep.year,
            this.wizard.data.dateStep.month,
            this.wizard.data.dateStep.day
          ),
          customMessage: this.wizard.data.reminderStep.reminder
        };
        break;
    }

    if (this.isEditMode) {
      this.updateNotifyMeSubscription(body);
    } else {
      this.createNotifyMeSubscription(body);
    }
  }

  createNotifyMeSubscription(body: NotifyMeConfig) {
    this.accessorService.createNotifyMeSubscription(this.innovation.id, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess(`You have set up a custom notification for ${this.innovation.name}`);
        this.redirectInnovationCustomNotifications();
      },
      error: () => {
        this.setAlertUnknownError();
        this.setPageStatus('READY');
      }
    });
  }

  updateNotifyMeSubscription(body: NotifyMeConfig) {
    this.accessorService.updateNotifyMeSubscription(this.subscriptionId, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess(`The changes you have made to your custom notification have been saved`);
        this.redirectInnovationCustomNotifications();
      },
      error: () => {
        this.setAlertUnknownError();
        this.setPageStatus('READY');
      }
    });
  }

  private redirectInnovationCustomNotifications(): void {
    this.redirectTo(
      `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}/custom-notifications`
    );
  }
}
