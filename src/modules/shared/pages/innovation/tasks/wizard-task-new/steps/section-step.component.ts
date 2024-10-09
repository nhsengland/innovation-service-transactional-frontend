import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { CustomValidators } from '@modules/shared/forms';
import { SectionStepInputType, SectionStepOutputType } from './section-step.types';

@Component({
  selector: 'shared-pages-innovation-actions-wizard-task-new-sections-step',
  templateUrl: './section-step.component.html'
})
export class WizardTaskNewSectionStepComponent
  extends CoreComponent
  implements WizardStepComponentType<SectionStepInputType, SectionStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() isSubmitStep = false;
  @Input() data: SectionStepInputType = {
    sections: [],
    selectedSection: null
  };
  @Output() cancelEvent = new EventEmitter<WizardStepEventType<SectionStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<SectionStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<SectionStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<SectionStepOutputType>>();

  form = new FormGroup(
    {
      section: new FormControl<null | string>(null, {
        validators: CustomValidators.required('Choose one section'),
        updateOn: 'change'
      })
    },
    { updateOn: 'blur' }
  );

  sectionItems: { value: string; label: string }[] = [];

  constructor() {
    super();
  }

  ngOnInit() {
    this.setPageTitle(this.title, { size: 'l' });
    this.setBackLink('Go back', this.onPreviousStep.bind(this));

    this.form.get('section')?.setValue(this.data.selectedSection);

    this.setPageStatus('READY');
  }

  prepareOutputData(): SectionStepOutputType {
    return {
      section: this.form.get('section')?.value ?? null
    };
  }

  onCancelStep(): void {
    this.cancelEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
