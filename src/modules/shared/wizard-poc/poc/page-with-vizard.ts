import { UnitsStepAnswersOutput, UnitsStepComponent } from './steps/units-step.component';
import { DateStepAnswersOutput, DateStepComponent } from './steps/date-step.component';
import { Component, OnInit } from '@angular/core';
import { VizardStep } from '../vizard.types';
import {
  OrganisationsStepAnswersOutput,
  OrganisationsStepComponent,
  OrganisationsStepSupportData
} from './steps/organisations-step.component';
import { CoreComponent } from '@app/base';
import { ReminderStepAnswersOutput, ReminderStepComponent } from './steps/reminder-step.component';
import { VizardService } from '../vizard.service';
import { SummaryStepComponent } from './steps/summary-step.component';

export type MyVizardType = OrganisationsStepAnswersOutput &
  UnitsStepAnswersOutput &
  ReminderStepAnswersOutput &
  DateStepAnswersOutput;

@Component({
  selector: 'app-user-info-page',
  templateUrl: './page-with-vizard.html',
  providers: [VizardService]
})
export class PageWithWizardComponent extends CoreComponent implements OnInit {
  initialSteps: VizardStep[] = [];
  supportData: OrganisationsStepSupportData = {
    organisations: [
      {
        id: 'org-1',
        name: 'Organisation 1',
        description: 'Description of organisation 1',
        units: [
          {
            id: 'unit-1',
            name: 'Unit 1'
          },
          {
            id: 'unit-2',
            name: 'Unit 2'
          }
        ]
      },
      {
        id: 'org-2',
        name: 'Organisation 2',
        description: 'Description of organisation 2',
        units: [
          {
            id: 'unit-3',
            name: 'Unit 3'
          },
          {
            id: 'unit-4',
            name: 'Unit 4'
          }
        ]
      },
      {
        id: 'org-3',
        name: 'Organisation 3',
        description: 'Description of organisation 3',
        units: []
      }
    ]
  };
  initialAnswers: MyVizardType = {
    day: '',
    month: '',
    year: '',
    selectedOrganisations: [],
    selectedUnits: [],
    reminder: ''
  };

  constructor(private vizardService: VizardService<MyVizardType>) {
    super();
  }

  ngOnInit(): void {
    this.initialSteps = [
      {
        id: 'organisationsStep',
        title: 'Organisations',
        supportData: this.supportData,
        component: OrganisationsStepComponent
      },
      {
        id: 'reminderStep',
        title: 'Reminder',
        component: ReminderStepComponent
      },
      {
        id: 'dateStep',
        title: 'Date',
        component: DateStepComponent
      },
      {
        id: 'summaryStep',
        title: 'Summary',
        component: SummaryStepComponent
      }
    ];

    this.setPageStatus('READY');
  }

  runRules($event: { currentStep: VizardStep; answers: MyVizardType }) {
    const { currentStep, answers } = $event;

    console.log('Running rules:', currentStep, answers);

    if (currentStep.id === 'organisationsStep') {
      // If some selected organisation has more than one unit, add units step.
      // Otherwise, remove
      const selectedOrganisationsHaveUnits = answers.selectedOrganisations.some(org => org.units.length > 1);

      if (selectedOrganisationsHaveUnits) {
        this.vizardService.triggerAddStep(
          {
            id: 'unitsStep',
            title: 'Units',
            component: UnitsStepComponent
          },
          2
        );
      } else {
        answers.selectedUnits = [];
        this.vizardService.triggerRemoveStep('unitsStep');
      }
    }
  }

  submit(answers: MyVizardType) {
    console.log('Form Submitted:', answers);
  }
}
