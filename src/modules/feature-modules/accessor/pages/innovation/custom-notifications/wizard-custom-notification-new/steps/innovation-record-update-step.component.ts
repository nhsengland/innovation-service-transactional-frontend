import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import {
  InnovationRecordUpdateStepInputType,
  InnovationRecordUpdateStepOutputType
} from './innovation-record-update-step.types';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators, FormEngineParameterModel } from '@modules/shared/forms';
import { ActivatedRoute } from '@angular/router';
import { InnovationSections } from '@modules/stores/innovation/innovation-record/202304/catalog.types';

@Component({
  selector: 'app-accessor-innovation-custom-notifications-wizard-custom-notifications-innovation-record-update-step',
  templateUrl: './innovation-record-update-step.component.html'
})
export class WizardInnovationCustomNotificationInnovationRecordUpdateStepComponent
  extends CoreComponent
  implements WizardStepComponentType<InnovationRecordUpdateStepInputType, InnovationRecordUpdateStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: InnovationRecordUpdateStepInputType = {
    innovationRecordSections: [],
    selectedInnovationRecordSections: []
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<InnovationRecordUpdateStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<InnovationRecordUpdateStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<InnovationRecordUpdateStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<InnovationRecordUpdateStepOutputType>>();

  errorMessage: string = "Select one or more sections of the innovation record you'd like to be notified about";

  form = new FormGroup({
    innovationRecordSections: new FormArray<FormControl<string>>(
      [],
      [CustomValidators.requiredCheckboxArray(this.errorMessage)]
    )
  });

  sectionsItems: Required<FormEngineParameterModel>['items'] = [];

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Add each section as an option to select on the form
    this.stores.innovation.getSectionsSummary$(this.activatedRoute.snapshot.params.innovationId).subscribe(response => {
      const subSections = response.flatMap(section => section.sections);

      this.sectionsItems.push(
        { value: 'Select 1 or more sections', label: 'HEADING' },

        ...subSections.map(s => {
          const sectionIdentification = this.stores.innovation.getInnovationRecordSectionIdentification(s.id);
          return {
            value: s.id,
            label: `${sectionIdentification?.group.number}.${sectionIdentification?.section.number}. ${sectionIdentification?.section.title}`
          };
        }),
        { value: 'SEPARATOR', label: 'SEPARATOR' },
        { value: 'ALL', label: 'All sections', exclusive: true }
      );

      // Select the sections previously selected by the user
      this.data.selectedInnovationRecordSections
        ? this.data.selectedInnovationRecordSections.forEach(section => {
            (this.form.get('innovationRecordSections') as FormArray).push(new FormControl<string>(section));
          })
        : (this.form.get('innovationRecordSections') as FormArray).push(new FormControl<string>('ALL'));

      this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
      this.setPageStatus('READY');
    });
  }

  prepareOutputData(): InnovationRecordUpdateStepOutputType {
    const selectedSectionsIds = this.form.value.innovationRecordSections as InnovationSections[];

    return {
      innovationRecordSections: selectedSectionsIds ?? []
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.setAlertError('', {
        itemsList: [{ title: this.errorMessage, fieldId: 'innovationRecordsections' }],
        width: '2.thirds'
      });

      this.form.markAllAsTouched();

      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
