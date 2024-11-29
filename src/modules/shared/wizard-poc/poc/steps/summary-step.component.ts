import { DatesHelper } from '@app/base/helpers';
import { CoreComponent } from './../../../../../app/base/core.component';
import { Component, Input, OnInit } from '@angular/core';
import { MyVizardType } from '../page-with-vizard';
import { VizardService } from '../../vizard.service';

export type SummaryStepAnswersInput = MyVizardType;

@Component({
  selector: 'app-summary-step',
  templateUrl: './summary-step.component.html'
})
export class SummaryStepComponent extends CoreComponent implements OnInit {
  @Input({ required: true }) title = '';
  @Input({ required: true }) answers!: SummaryStepAnswersInput;

  displayOrganisations?: string[];
  displayDate?: string;

  constructor(private vizardService: VizardService<SummaryStepAnswersInput>) {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    this.displayOrganisations = this.getOrganisationsText();
    this.displayDate = DatesHelper.getDateString(this.answers.year, this.answers.month, this.answers.day);

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  getOrganisationsText(): string[] {
    const selectedUnitsIds = this.answers.selectedUnits.map(unit => unit.id);
    const organisationsNames = this.answers.selectedOrganisations
      .map(org => {
        if (org.units.length === 1) {
          return org.units[0].name;
        } else {
          const unitName = org.units.filter(unit => selectedUnitsIds.includes(unit.id)).flatMap(unit => unit.name);
          return unitName;
        }
      })
      .flat();

    return organisationsNames.sort((a, b) => a.localeCompare(b));
  }

  onPreviousStep(): void {
    this.vizardService.triggerPrevious();
  }

  onGoToStep(stepId: string): void {
    this.vizardService.triggerGoToStep(stepId);
  }

  onSubmit() {
    this.vizardService.triggerSubmit();
  }
}
