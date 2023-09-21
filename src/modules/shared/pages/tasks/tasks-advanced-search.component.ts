import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { getAllSectionsList } from '@modules/stores/innovation/innovation-record/ir-versions.config';

import { InnovationActionsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService, InnovationsTasksListFilterType } from '@modules/shared/services/innovations.service';
import { InnovationSectionEnum, InnovationStatusEnum, InnovationTaskStatusEnum } from '@modules/stores/innovation';

type FilterKeysType = 'status' | 'sections' | 'innovationStatus';

@Component({
  selector: 'shared-pages-tasks-advanced-search',
  templateUrl: './tasks-advanced-search.component.html'
})
export class PageTasksAdvancedSearchComponent extends CoreComponent implements OnInit {

  tasksList = new TableModel<InnovationActionsListDTO['data'][0], InnovationsTasksListFilterType>({});

  form = new FormGroup({
    innovationName: new FormControl<string>(''),
    status: new FormArray<FormControl<InnovationTaskStatusEnum>>([]),
    sections: new FormArray<FormControl<InnovationSectionEnum>>([]),
    innovationStatus: new FormArray<FormControl<InnovationStatusEnum>>([]),
    createdByMe: new FormControl(false),
  }, { updateOn: 'change' });

  anyFilterSelected = false;
  filters: {
    key: FilterKeysType,
    title: string,
    showHideStatus: 'opened' | 'closed',
    selected: { label: string, value: string }[],
    active: boolean,
  }[] = [
      { key: 'status', title: 'Task status', showHideStatus: 'closed', selected: [], active: false },
      { key: 'sections', title: 'Innovation record section', showHideStatus: 'closed', selected: [], active: false },
      { key: 'innovationStatus', title: 'Needs assessment status', showHideStatus: 'closed', selected: [], active: false }
    ];

  datasets: { [key in FilterKeysType]: { label: string, value: InnovationTaskStatusEnum | InnovationStatusEnum |  string }[] } = {
    status: [],
    sections: [],
    innovationStatus: []
  };

  pageInformation: { leadText: string };

  constructor(private innovationsService: InnovationsService) {

    super();

    this.setPageTitle('Tasks');

    this.tasksList.setVisibleColumns({
      section: { label: 'Tasks', orderable: true },
      innovationName: { label: 'Innovations', orderable: true },
      updatedAt: { label: 'Updated', orderable: true },
      status: { label: 'Status', align: 'right', orderable: true }
    }).setOrderBy('updatedAt', 'descending');

    this.pageInformation = {
      leadText: this.stores.authentication.isAssessmentType() ? 'Tasks assigned by needs assessment team' : `Tasks assigned by ${this.stores.authentication.getAccessorOrganisationUnitName()}`
    }

  }

  ngOnInit(): void {

    let filters: FilterKeysType[] = ['status', 'sections'];

    this.datasets.status = [InnovationTaskStatusEnum.OPEN, InnovationTaskStatusEnum.DONE, InnovationTaskStatusEnum.CANCELLED, InnovationTaskStatusEnum.DECLINED]
      .map(status => ({ label: this.translate(`shared.catalog.innovation.task_status.${status}.name`), value: status }));

    this.datasets.sections = getAllSectionsList();

    if(this.stores.authentication.isAssessmentType()) {
      filters.push('innovationStatus');

      this.datasets.innovationStatus = [
        { label: 'Needs assessment in progress', value: InnovationStatusEnum.NEEDS_ASSESSMENT },
        { label: 'Needs assessment completed', value: InnovationStatusEnum.IN_PROGRESS }
      ]
    }

    this.filters = this.filters.map(filter => ({ ...filter, active: filters.includes(filter.key) }));

    this.subscriptions.push(
      this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange())
    );

    this.onFormChange();

  }

  getTasksList(column?: string): void {

    this.setPageStatus('LOADING');

    this.innovationsService.getTasksList(this.tasksList.getAPIQueryParams()).subscribe(response => {
      this.tasksList.setData(response.data, response.count);
      if (this.isRunningOnBrowser() && column) this.tasksList.setFocusOnSortedColumnHeader(column);
      this.setPageStatus('READY');
    });

  }

  onFormChange(): void {

    this.setPageStatus('LOADING');

    this.filters.forEach(filter => {
      const f = this.form.get(filter.key)!.value as string[];
      filter.selected = this.datasets[filter.key].filter(i => f.includes(i.value));
    });
    this.anyFilterSelected = this.filters.filter(i => i.selected.length > 0).length > 0;

    this.tasksList
      .clearData()
      .setFilters({
        ...(this.form.get('innovationName')?.value ? { innovationName: this.form.get('innovationName')?.value ?? '' } : {}),
        ...(this.form.get('status')?.value ? { status: this.form.get('status')?.value } : {}),
        ...(this.form.get('sections')?.value ? { sections: this.form.get('sections')?.value } : {}),
        ...(this.form.get('innovationStatus')?.value ? { innovationStatus: this.form.get('innovationStatus')?.value } : {}),
        createdByMe: this.form.get('createdByMe')?.value ?? false,
        fields: ['notifications']
      });

    this.getTasksList();

  }


  onTableOrder(column: string): void {
    this.tasksList.setOrderBy(column);
    this.getTasksList(column);
  }


  onOpenCloseFilter(filterKey: FilterKeysType): void {
    const filter = this.filters.find(i => i.key === filterKey);
    switch (filter?.showHideStatus) {
      case 'opened':
        filter.showHideStatus = 'closed';
        break;
      case 'closed':
        filter.showHideStatus = 'opened';
        break;
      default:
        break;
    }

  }

  onRemoveFilter(filterKey: FilterKeysType, value: string): void {

    const formFilter = this.form.get(filterKey) as FormArray;
    const formFilterIndex = formFilter.controls.findIndex(i => i.value === value);

    if (formFilterIndex > -1) {
      formFilter.removeAt(formFilterIndex);
    }

  }

  onPageChange(event: { pageNumber: number }): void {
    this.tasksList.setPage(event.pageNumber);
    this.getTasksList();
  }

}
