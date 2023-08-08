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

import { InnovationsStepInputType, InnovationsStepOutputType } from './innovations-step.types';


@Component({
  selector: 'app-admin-wizards-organisation-unit-inactivate-innovations-step',
  templateUrl: './innovations-step.component.html'
})
export class WizardOrganisationUnitInactivateInnovationsStepComponent extends CoreComponent implements WizardStepComponentType<InnovationsStepInputType, InnovationsStepOutputType>, OnInit {

  @Input() title = '';
  @Input() data: InnovationsStepInputType = {
    organisation: { id: '' },
    organisationUnit: { id: '', name: '' },
    agreeInnovations: false
  };
  @Output() cancelEvent = new EventEmitter<WizardStepEventType<InnovationsStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<InnovationsStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<InnovationsStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<InnovationsStepOutputType>>();

  innovationsList = new TableModel<InnovationsListDTO['data'][0], InnovationsListFiltersType>({
    pageSize: 10
  });
  innovationStatistics: {status: InnovationSupportStatusEnum, count: number}[] = [];

  form = new FormGroup({
    agreeInnovations: new UntypedFormControl(false, CustomValidators.required('You need to confirm to proceed'))
  }, { updateOn: 'blur' });


  constructor(
    private innovationsService: InnovationsService,
    private statisticsService: StatisticsService
  ) {

    super();
    this.setPageTitle(this.title);
    this.innovationsList = new TableModel({});
  }

  ngOnInit(): void {
    this.innovationsList.setVisibleColumns({
      innovation: { label: 'Innovation', orderable: false },
      status: { label: 'Status', orderable: false }
    }).setFilters({
      supportStatuses: [
        InnovationSupportStatusEnum.ENGAGING,
        InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED
      ],
      engagingOrganisationUnits: [this.data.organisationUnit.id]
    });

    this.form.get('agreeInnovations')!.setValue(this.data.agreeInnovations);

    this.getUsersList();
  }


  getUsersList(column?: string): void {

    forkJoin([
      this.innovationsService.getInnovationsList({ queryParams: this.innovationsList.getAPIQueryParams() }),
      this.statisticsService.getOrganisationUnitStatistics(this.data.organisationUnit.id, { statistics: [OrganisationUnitStatisticsEnum.INNOVATIONS_PER_UNIT] }),
    ]).subscribe({
      next: ([innovations, statistics]) => {
        this.innovationsList.setData(innovations.data, innovations.count);

        this.innovationStatistics = [
          {
            status: InnovationSupportStatusEnum.ENGAGING,
            count: statistics[OrganisationUnitStatisticsEnum.INNOVATIONS_PER_UNIT].ENGAGING
          },
          {
            status: InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED,
            count: statistics[OrganisationUnitStatisticsEnum.INNOVATIONS_PER_UNIT].FURTHER_INFO_REQUIRED
          }
        ];
        if (this.isRunningOnBrowser() && column) this.innovationsList.setFocusOnSortedColumnHeader(column);
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  onTableOrder(column: string): void {
    this.innovationsList.setOrderBy(column);
    this.getUsersList(column);
  }

  onPageChange(event: { pageNumber: number }): void {
    this.innovationsList.setPage(event.pageNumber);
    this.getUsersList();
  }


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
        agreeInnovations: this.form.get('agreeInnovations')!.value,
        innovationsCount: this.innovationsList.getTotalRowsNumber()
      }
    });
  }

  onNextStep(): void {

    if (!this.verifyOutputData()) { return; }

    if (this.form.valid) {
      this.nextStepEvent.emit({
        isComplete: true, data: {
          agreeInnovations: true,
          innovationsCount: this.innovationsList.getTotalRowsNumber()
        }
      });
    }

  }

  getUnitStatusSupport(supports?: {
    id: string,
    status: InnovationSupportStatusEnum,
    organisation: {
      id: string,
      unit: {
        id: string,
      }
    }
  }[]): InnovationSupportStatusEnum {
    return supports && supports.length > 0 ? supports[0].status :  InnovationSupportStatusEnum.NOT_YET;
  }

}
