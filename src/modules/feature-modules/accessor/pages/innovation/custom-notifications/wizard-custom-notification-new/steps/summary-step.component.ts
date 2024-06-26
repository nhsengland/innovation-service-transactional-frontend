import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { SummaryStepInputType } from './summary-step.types';
import { ActivatedRoute } from '@angular/router';
import { CategoryEnum, NOTIFICATION_ITEMS } from './notification-step.types';
import { NotificationEnum } from '@modules/feature-modules/accessor/services/accessor.service';

@Component({
  selector: 'app-accessor-innovation-custom-notifications-wizard-custom-notification-new-summary-step',
  templateUrl: './summary-step.component.html'
})
export class WizardInnovationCustomNotificationNewSummaryStepComponent
  extends CoreComponent
  implements WizardStepComponentType<SummaryStepInputType, null>, OnInit
{
  @Input() title = '';
  @Input() data: SummaryStepInputType = {
    displayEditMode: false,
    notificationStep: {
      notification: ''
    },
    organisationsStep: {
      organisations: []
    },
    unitsStep: {
      units: []
    },
    supportStatusesStep: {
      supportStatuses: []
    }
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() goToStepEvent = new EventEmitter<string>();

  subscriptionId: string;
  displayNotification: string = '';
  displayOrganisations?: string[];
  displaySupportStatuses?: string[];

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.subscriptionId = this.activatedRoute.snapshot.params.subscriptionId;

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    this.title = this.data.displayEditMode ? 'Edit your custom notification' : 'Review your custom notification';

    this.displayNotification = this.getNotificationText();

    switch (this.data.notificationStep.notification) {
      case NotificationEnum.SUPPORT_UPDATED:
        this.displayOrganisations = this.getOrganisationsText();
        this.displaySupportStatuses = this.getSupportStatusesText();
        break;
      case NotificationEnum.PROGRESS_UPDATE_CREATED:
        this.displayOrganisations = this.getOrganisationsText();
        break;
    }

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  getNotificationText(): string {
    const notification = NOTIFICATION_ITEMS.filter(
      notification => notification.type === this.data.notificationStep.notification
    )?.[0];

    return notification.category === CategoryEnum.NOTIFIY_ME_WHEN
      ? 'When ' + notification.label
      : 'Remind me ' + notification.label;
  }

  getOrganisationsText(): string[] {
    const selectedUnitsIds = this.data.unitsStep.units.map(unit => unit.id);
    const organisationsNames = this.data.organisationsStep.organisations
      .map(org => {
        if (org.units.length === 1) {
          return org.name;
        } else {
          const unitName = org.units.filter(unit => selectedUnitsIds.includes(unit.id)).flatMap(unit => unit.name);
          return unitName;
        }
      })
      .flat();

    return organisationsNames.sort((a, b) => a.localeCompare(b));
  }

  getSupportStatusesText(): string[] {
    return this.data.supportStatusesStep.supportStatuses.map(status =>
      this.translate('shared.catalog.innovation.support_status.' + status + '.name')
    );
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit();
  }

  onGotoStep(stepId: string): void {
    this.goToStepEvent.emit(stepId);
  }

  onSubmit(): void {
    this.submitEvent.emit();
  }
}
