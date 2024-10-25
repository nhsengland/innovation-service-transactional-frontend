import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { ContextInnovationType, MappedObjectType, WizardStepEventType } from '@app/base/types';
import {
  AccessorService,
  GetNotifyMeInnovationSubscription,
  GetNotifyMeInnovationsWithSubscriptions
} from '@modules/feature-modules/accessor/services/accessor.service';
import { ObservableInput, forkJoin } from 'rxjs';
import { InnovationStepInputType, InnovationStepOutputType } from './steps/innovation-step.types';
import { WizardInnovationCustomNotificationDeleteInnovationStepComponent } from './steps/innovation-step.component';
import { NotificationsStepInputType, NotificationsStepOutputType } from './steps/notifications-step.types';
import { WizardInnovationCustomNotificationDeleteNotificationsStepComponent } from './steps/notifications-step.component';
import { NotifyMeInnovationWithSubscriptions, SummaryStepInputType } from './steps/summary-step.types';
import { WizardInnovationCustomNotificationDeleteSummaryStepComponent } from './steps/summary-step.component';

type WizardData = {
  innovationStep: {
    innovation: GetNotifyMeInnovationsWithSubscriptions | 'ALL';
  };
  notificationsStep: {
    notifications: (GetNotifyMeInnovationSubscription | 'ALL')[];
  };
};

export const emptyInnovation = { innovationId: '', name: '', count: 0, subscriptions: undefined };

@Component({
  selector: 'app-accessor-innovation-custom-notification-delete',
  templateUrl: './custom-notification-delete.component.html'
})
export class WizardInnovationCustomNotificationDeleteComponent extends CoreComponent implements OnInit {
  innovationId: string;
  subscriptionId: string;
  innovation: ContextInnovationType;

  datasets: {
    innovationsWithSubscriptions: GetNotifyMeInnovationsWithSubscriptions[];
  };

  wizard = new WizardModel<WizardData>({});

  stepsDefinition: {
    [stepId: string]: WizardStepModel;
  };

  constructor(
    private accessorService: AccessorService,
    private activatedRoute: ActivatedRoute
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.subscriptionId = this.activatedRoute.snapshot.params.subscriptionId;

    this.innovation = this.ctx.innovation.innovation();

    this.datasets = {
      innovationsWithSubscriptions: []
    };

    this.wizard.data = {
      innovationStep: {
        innovation: {
          innovationId: '',
          name: '',
          count: 0,
          subscriptions: []
        }
      },
      notificationsStep: {
        notifications: []
      }
    };

    this.stepsDefinition = {
      innovationStep: new WizardStepModel<InnovationStepInputType, InnovationStepOutputType>({
        id: 'innovationStep',
        title: `Select which innovation's notifications you want to delete`,
        component: WizardInnovationCustomNotificationDeleteInnovationStepComponent,
        data: {
          innovations: [],
          selectedInnovation: {
            innovationId: '',
            name: '',
            count: 0,
            subscriptions: []
          }
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data),
          nextStepEvent: data =>
            this.onNextStep(data, this.onInnovationStepOut, this.onNotificationsStepIn, this.onSummaryStepIn)
        }
      }),
      notificationsStep: new WizardStepModel<NotificationsStepInputType, NotificationsStepOutputType>({
        id: 'notificationsStep',
        title: 'Select the notifications you want to delete',
        component: WizardInnovationCustomNotificationDeleteNotificationsStepComponent,
        data: {
          selectedInnovation: emptyInnovation,
          selectedNotifications: []
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onNotificationsStepOut, this.onInnovationStepIn),
          nextStepEvent: data => this.onNextStep(data, this.onNotificationsStepOut, this.onSummaryStepIn)
        }
      }),
      summaryStep: new WizardStepModel<SummaryStepInputType, null>({
        id: 'summaryStep',
        title: 'Are you sure you want to delete these custom notifications?',
        component: WizardInnovationCustomNotificationDeleteSummaryStepComponent,
        data: {
          selectedNotificationsPerInnovation: []
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onInnovationStepIn, this.onNotificationsStepIn),
          submitEvent: data => this.onSubmit(data),
          goToStepEvent: stepId => this.onGoToStep(stepId)
        }
      })
    };
  }

  ngOnInit() {
    const subscriptions: {
      innovationsWithSubscriptions?: ObservableInput<GetNotifyMeInnovationsWithSubscriptions[]>;
      innovationSubscriptions?: ObservableInput<GetNotifyMeInnovationSubscription[]>;
      subscription?: ObservableInput<GetNotifyMeInnovationSubscription>;
    } = {};

    // User came from 'manage custom notifications' entry point
    if (!this.innovationId) {
      subscriptions.innovationsWithSubscriptions = this.accessorService.getNotifyMeInnovationsWithSubscriptionsList({
        withDetails: true
      });
    } else {
      if (this.subscriptionId) {
        // User came from 'edit' entry point
        subscriptions.subscription = this.accessorService.getNotifyMeSubscription(this.subscriptionId);
      } else {
        // User came from 'custom notifications' entry point
        subscriptions.innovationSubscriptions = this.accessorService.getNotifyMeInnovationSubscriptionsList(
          this.innovationId
        );
      }
    }

    forkJoin(subscriptions).subscribe({
      next: response => {
        if (response.innovationsWithSubscriptions) {
          // Configure wizard for 'manage custom notifications' entry point
          this.datasets.innovationsWithSubscriptions = response.innovationsWithSubscriptions;

          this.setWizardSteps([
            this.stepsDefinition.innovationStep,
            this.stepsDefinition.notificationsStep,
            this.stepsDefinition.summaryStep
          ]);
          this.onInnovationStepIn();
        } else if (response.innovationSubscriptions) {
          // Configure wizard for 'custom notifications' entry point
          this.wizard.data.innovationStep.innovation = {
            innovationId: this.innovation.id,
            name: this.innovation.name,
            count: response.innovationSubscriptions.length,
            subscriptions: response.innovationSubscriptions
          };
          this.setWizardSteps([this.stepsDefinition.notificationsStep, this.stepsDefinition.summaryStep]);
          this.onNotificationsStepIn();
        } else if (response.subscription) {
          // Configure wizard for 'edit' entry point
          this.wizard.data = {
            innovationStep: {
              innovation: {
                innovationId: this.innovation.id,
                name: this.innovation.name,
                count: 0,
                subscriptions: [response.subscription]
              }
            },
            notificationsStep: {
              notifications: [response.subscription]
            }
          };
          this.setWizardSteps([this.stepsDefinition.summaryStep]);
          this.onSummaryStepIn();
        }

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  // Steps mappings
  onInnovationStepIn(): void {
    this.wizard.setStepData<InnovationStepInputType>('innovationStep', {
      innovations: this.datasets.innovationsWithSubscriptions,
      selectedInnovation: this.wizard.data.innovationStep.innovation
    });
  }

  onInnovationStepOut(stepData: WizardStepEventType<InnovationStepOutputType>): void {
    if (stepData.data.selectedInnovation !== this.wizard.data.innovationStep.innovation) {
      this.wizard.data.notificationsStep.notifications = [];
    }

    this.wizard.data.innovationStep = {
      innovation: stepData.data.selectedInnovation
    };

    this.manageNotificationsStep();
  }

  onNotificationsStepIn(): void {
    this.wizard.setStepData<NotificationsStepInputType>('notificationsStep', {
      selectedInnovation:
        this.wizard.data.innovationStep.innovation === 'ALL'
          ? emptyInnovation
          : this.wizard.data.innovationStep.innovation,
      selectedNotifications: this.wizard.data.notificationsStep.notifications
    });
  }

  onNotificationsStepOut(stepData: WizardStepEventType<NotificationsStepOutputType>): void {
    this.wizard.data.notificationsStep = {
      notifications: stepData.data.selectedNotifications
    };
  }

  onSummaryStepIn(): void {
    let selectedNotificationsPerInnovation: NotifyMeInnovationWithSubscriptions[] = [];

    // If user has chosen to delete all custom notifications (from all innovations)
    if (this.wizard.data.innovationStep.innovation === 'ALL') {
      selectedNotificationsPerInnovation = this.datasets.innovationsWithSubscriptions;
    } else {
      // If user has chosen to delete all notifications from a specific innovation
      if (this.wizard.data.notificationsStep.notifications.includes('ALL')) {
        selectedNotificationsPerInnovation.push(this.wizard.data.innovationStep.innovation);
      } else {
        // If user has chosen to delete certain notifications from an innovation
        const chosenNotificationsIds = this.wizard.data.notificationsStep.notifications.map(
          notification => (notification as GetNotifyMeInnovationSubscription).id
        );

        selectedNotificationsPerInnovation.push({
          ...this.wizard.data.innovationStep.innovation,
          subscriptions: this.wizard.data.innovationStep.innovation.subscriptions?.filter(subscription =>
            chosenNotificationsIds.includes(subscription.id)
          )
        });
      }
    }

    this.wizard.setStepData<SummaryStepInputType>('summaryStep', {
      selectedNotificationsPerInnovation
    });
  }

  onPreviousStep<T extends WizardStepEventType<MappedObjectType | null>>(
    stepData: T,
    ...args: ((data: T) => void)[]
  ): void {
    this.resetAlert();

    if (this.wizard.isFirstStep()) {
      switch (this.wizard.steps[0].id) {
        case 'innovationStep':
          this.redirectToManageCustomNotifications();
          break;
        case 'notificationsStep':
          this.redirectToInnovationCustomNotifications();
          break;
        case 'summaryStep':
          this.redirectToEditCustomNotification();
          break;
        default:
          break;
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

  onGoToStep(stepId: string): void {
    switch (stepId) {
      case 'innovationStep':
        this.onInnovationStepIn();
        break;
      case 'notificationsStep':
        this.onNotificationsStepIn();
        break;
      case 'summaryStep':
        this.onSummaryStepIn();
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

  setWizardSteps(steps: WizardStepModel[]): void {
    steps.forEach(step => this.wizard.addStep(step));
  }

  manageNotificationsStep(): void {
    const deleteAllCustomNotifications = !!(this.wizard.data.innovationStep.innovation === 'ALL');

    // If user selected to delete all custom notifications, remove notifications step.
    // Otherwise, add notifications step
    if (deleteAllCustomNotifications) {
      this.wizard.removeStep('notificationsStep');
      this.wizard.data.notificationsStep.notifications = [];
    } else {
      this.wizard.addStep(this.stepsDefinition.notificationsStep, 1);
    }
  }

  onSubmit<T extends WizardStepEventType<MappedObjectType | null>>(stepData: T, ...args: ((data: T) => void)[]): void {
    this.resetAlert();

    args.forEach(element => element.bind(this)(stepData));
    this.onSubmitWizard();
  }

  onSubmitWizard(): void {
    this.setPageStatus('LOADING');

    let notificationsIds: string[] = [];

    if (this.wizard.data.innovationStep.innovation !== 'ALL') {
      // If user has chosen to delete all notifications from a specific innovation,
      // get all notifications ids from this innovation.
      // Otherwise get only selected notifications ids
      if (this.wizard.data.notificationsStep.notifications.includes('ALL')) {
        notificationsIds =
          this.wizard.data.innovationStep.innovation.subscriptions?.map(subscription => subscription.id) ?? [];
      } else {
        notificationsIds = this.wizard.data.notificationsStep.notifications.map(
          notification => (notification as GetNotifyMeInnovationSubscription).id
        );
      }
    }

    this.accessorService
      .deleteNotifyMeSubscription({ ...(notificationsIds.length ? { ids: notificationsIds } : {}) })
      .subscribe({
        next: () => {
          this.setRedirectAlertSuccess(`You have deleted custom notification(s)`);

          if (this.wizard.steps[0].id === 'innovationStep') {
            this.redirectToManageCustomNotifications();
          } else {
            this.redirectToInnovationCustomNotifications();
          }
        },
        error: () => {
          this.setAlertUnknownError();
          this.setPageStatus('READY');
        }
      });
  }

  private redirectToManageCustomNotifications(): void {
    this.redirectTo(`${this.stores.authentication.userUrlBasePath()}/account/manage-custom-notifications`);
  }

  private redirectToInnovationCustomNotifications(): void {
    this.redirectTo(
      `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}/custom-notifications`
    );
  }

  private redirectToEditCustomNotification(): void {
    this.redirectTo(
      `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}/custom-notifications/${this.subscriptionId}/edit`
    );
  }
}
