import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { TableModel } from '@app/base/models';
import { CustomValidators } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';


import { UsersStepInputType, UsersStepOutputType } from './users-step.types';

import { GetOrganisationUnitUsersOutDTO, OrganisationsService } from '@modules/feature-modules/admin/services/organisations.service';


@Component({
  selector: 'app-admin-wizards-organisation-unit-inactivate-users-step',
  templateUrl: './users-step.component.html'
})
export class WizardOrganisationUnitInactivateUsersStepComponent extends CoreComponent implements WizardStepComponentType<UsersStepInputType, UsersStepOutputType>, OnInit {

  @Input() title = '';
  @Input() data: UsersStepInputType = {
    organisation: { id: '' },
    organisationUnit: { id: '', name: '' },
    agreeUsers: false
  };
  @Output() cancelEvent = new EventEmitter<WizardStepEventType<UsersStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<UsersStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<UsersStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<UsersStepOutputType>>();

  // submitButton = { isActive: true, label: 'Confirm and notify organisations' };

  tableList = new TableModel<GetOrganisationUnitUsersOutDTO['data'][0], { onlyActive: boolean }>({
    pageSize: 10
  });

  form = new FormGroup({
    agreeUsers: new FormControl(false, CustomValidators.required('You need to confirm to proceed'))
  }, { updateOn: 'blur' });

  constructor(
    private organisationsService: OrganisationsService
  ) {

    super();
    this.setPageTitle(this.title);

  }

  ngOnInit(): void {

    this.tableList.setVisibleColumns({
      userAccount: { label: 'User account', orderable: false }
    }).setFilters({ onlyActive: true });

    this.form.get('agreeUsers')!.setValue(this.data.agreeUsers);

    this.getUsersList();

  }


  getUsersList(): void {

    this.organisationsService.getOrganisationUnitUsers(this.data.organisation.id, this.data.organisationUnit.id, this.tableList.getAPIQueryParams()).subscribe(
      response => {
        this.tableList.setData(response.data, response.count);
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

    if (!this.form.get('agreeUsers')!.value) {
      this.form.markAllAsTouched();
      return false;
    }

    return true;

  }


  onPreviousStep(): void {
    this.previousStepEvent.emit({
      isComplete: true, data: {
        agreeUsers: this.form.get('agreeUsers')!.value,
        userCount: this.tableList.getTotalRowsNumber()
      }
    });
  }

  onNextStep(): void {

    if (!this.verifyOutputData()) { return; }

    if (this.form.valid) {
      this.nextStepEvent.emit({
        isComplete: true, data: {
          agreeUsers: true,
          userCount: this.tableList.getTotalRowsNumber()
        }
      });
    }

  }

}
