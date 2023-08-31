import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup } from '@app/base/forms';
import { TableModel } from '@app/base/models';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { InnovationsListDTO, InnovationsListFiltersType } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationUnitStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';

import { OrganisationsStepInputType, OrganisationsStepOutputType } from './organisations-step.types';


@Component({
  selector: 'shared-pages-innovation-messages-wizard-thread-new-organisations-step',
  templateUrl: './organisations-step.component.html'
})
export class WizardInnovationThreadNewOrganisationsStepComponent extends CoreComponent implements WizardStepComponentType<OrganisationsStepInputType, OrganisationsStepOutputType>, OnInit {

  @Input() title = '';
  @Input() data: OrganisationsStepInputType = {
    innovation: { id: '' },
    selectedUsersList: []
  };
  @Output() cancelEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<OrganisationsStepOutputType>>();


  form = new FormGroup({
    agreeInnovations: new UntypedFormControl(false, CustomValidators.required('You need to confirm to proceed'))
  }, { updateOn: 'blur' });


  constructor(
    private innovationsService: InnovationsService,
    private statisticsService: StatisticsService
  ) { super(); }

  ngOnInit(): void {

    this.setPageTitle(this.title);
    this.setBackLink('Go back', this.onPreviousStep.bind(this));

    this.form.get('agreeInnovations')!.setValue(true);

    // this.getUsersList();

  }


  // getUsersList(column?: string): void {

  // forkJoin([
  //   this.innovationsService.getInnovationsList({ queryParams: this.innovationsList.getAPIQueryParams() }),
  //   this.statisticsService.getOrganisationUnitStatistics(this.data.organisationUnit.id, { statistics: [OrganisationUnitStatisticsEnum.INNOVATIONS_PER_UNIT] }),
  // ]).subscribe({
  //   next: ([innovations, statistics]) => {
  //     this.innovationsList.setData(innovations.data, innovations.count);

  //     this.innovationStatistics = [
  //       {
  //         status: InnovationSupportStatusEnum.ENGAGING,
  //         count: statistics[OrganisationUnitStatisticsEnum.INNOVATIONS_PER_UNIT].ENGAGING
  //       },
  //       {
  //         status: InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED,
  //         count: statistics[OrganisationUnitStatisticsEnum.INNOVATIONS_PER_UNIT].FURTHER_INFO_REQUIRED
  //       }
  //     ];
  //     if (this.isRunningOnBrowser() && column) this.innovationsList.setFocusOnSortedColumnHeader(column);
  //     this.setPageStatus('READY');
  //   },
  //   error: () => {
  //     this.setPageStatus('ERROR');
  //     this.setAlertUnknownError();
  //   }
  // });
  // }



  verifyOutputData(): boolean {

    if (!this.form.get('agreeInnovations')!.value) {
      this.form.markAllAsTouched();
      return false;
    }

    return true;

  }


  onPreviousStep(): void {
    this.previousStepEvent.emit({
      isComplete: true, data: {
        usersList: []
        // agreeInnovations: this.form.get('agreeInnovations')!.value,

      }
    });
  }

  onNextStep(): void {

    if (!this.verifyOutputData()) { return; }

    if (this.form.valid) {
      this.nextStepEvent.emit({
        isComplete: true, data: {
          usersList: []
        }
      });
    }

  }

}
