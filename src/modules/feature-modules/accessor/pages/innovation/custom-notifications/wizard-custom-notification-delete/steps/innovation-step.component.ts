import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { CustomValidators, FormEngineParameterModel } from '@modules/shared/forms';
import { InnovationStepInputType, InnovationStepOutputType } from './innovation-step.types';
import { emptyInnovation } from '../custom-notification-delete.component';

@Component({
  selector: 'app-accessor-innovation-custom-notifications-wizard-custom-notification-delete-innovation-step',
  templateUrl: './innovation-step.component.html'
})
export class WizardInnovationCustomNotificationDeleteInnovationStepComponent
  extends CoreComponent
  implements WizardStepComponentType<InnovationStepInputType, InnovationStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: InnovationStepInputType = {
    innovations: [],
    selectedInnovation: emptyInnovation
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<InnovationStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<InnovationStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<InnovationStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<InnovationStepOutputType>>();

  errorMessage = `Select an innovation's notifications to delete`;

  form = new FormGroup({
    innovation: new FormControl<string | null>(null, [CustomValidators.required(this.errorMessage)])
  });

  innovationItems: Required<FormEngineParameterModel>['items'] = [];

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    // Add each innovation as an option to select on the form
    let countNotifications = 0;
    this.innovationItems.push(
      ...this.data.innovations.map(innovation => {
        countNotifications += innovation.count;
        return {
          value: innovation.innovationId,
          label: innovation.name,
          description: `${innovation.count} active ${this.getNotificationTerm(innovation.count)}`
        };
      }),

      ...(this.data.innovations.length > 1
        ? [
            { value: 'SEPARATOR', label: 'SEPARATOR' },
            {
              value: 'ALL',
              label: 'Delete all custom notifications',
              description: `${countNotifications} active ${this.getNotificationTerm(countNotifications)}`
            }
          ]
        : [])
    );

    // Select the innovation previously selected by the user
    if (this.data.selectedInnovation) {
      if (this.data.selectedInnovation === 'ALL') {
        this.form.get('innovation')?.setValue('ALL');
      } else {
        this.form.get('innovation')?.setValue(this.data.selectedInnovation.innovationId);
      }
    }

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  getNotificationTerm(count: number) {
    return count > 1 ? 'notifications' : 'notification';
  }

  prepareOutputData(): InnovationStepOutputType {
    const selectedInnovationId = this.form.value.innovation;

    const selectedInnovation =
      selectedInnovationId === 'ALL'
        ? selectedInnovationId
        : this.data.innovations.filter(innovation => innovation.innovationId === selectedInnovationId)[0];

    return {
      selectedInnovation
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.setAlertError(
        `You have not selected an innovation's notifications to delete. If you do not want to delete any notifications go back.`,
        {
          itemsList: [{ title: this.errorMessage, fieldId: 'innovation' }],
          width: '2.thirds'
        }
      );

      this.form.markAllAsTouched();

      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
