import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { TableModel } from '@app/base/models';
import { CustomValidators } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';

import { GetOrganisationUnitInnovationsListDTO, OrganisationsService, organisationUsersOutDTO } from '@modules/shared/services/organisations.service';

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


  innovationStatusCounters: GetOrganisationUnitInnovationsListDTO['innovationsByStatus'] = [];
  tableList = new TableModel<GetOrganisationUnitInnovationsListDTO['innovationsList'][0], {}>();

  form = new FormGroup({
    agreeInnovations: new FormControl(false, CustomValidators.required('You need to confirm to proceed'))
  }, { updateOn: 'blur' });


  constructor(
    private organisationsService: OrganisationsService
  ) {

    super();
    this.setPageTitle(this.title);
  }

  ngOnInit(): void {

    this.tableList.setVisibleColumns({
      innovation: { label: 'Innovation', orderable: false },
      status: { label: 'Status', orderable: false }
    });

    this.form.get('agreeInnovations')!.setValue(this.data.agreeInnovations);

    this.getUsersList();

  }


  getUsersList(): void {

    this.organisationsService.getOrganisationUnitInnovationsList(this.data.organisation.id, this.data.organisationUnit.id, this.tableList.getAPIQueryParams()).subscribe(
      response => {
        this.innovationStatusCounters = response.innovationsByStatus;
        this.tableList.setData(response.innovationsList, response.count);
        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('ERROR');
        this.setAlertDataLoadError();
      }
    );

  }

  onTableOrder(column: string): void {
    this.tableList.setOrderBy(column);
    this.getUsersList();
  }

  onPageChange(event: { pageNumber: number }): void {
    this.tableList.setPage(event.pageNumber);
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
        innovationsCount: this.tableList.getTotalRowsNumber()
      }
    });
  }

  onNextStep(): void {

    if (!this.verifyOutputData()) { return; }

    if (this.form.valid) {
      this.nextStepEvent.emit({
        isComplete: true, data: {
          agreeInnovations: true,
          innovationsCount: this.tableList.getTotalRowsNumber()
        }
      });
    }

  }

}
