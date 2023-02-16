import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { locationItems } from '@modules/stores/innovation/config/innovation-catalog.config';
import { mainCategoryItems } from '@modules/stores/innovation/sections/catalogs.config';

import { InnovationsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsListFiltersType, InnovationsService } from '@modules/shared/services/innovations.service';

import { DatesHelper } from '@app/base/helpers';
import { DateISOType } from '@app/base/types';
import { InnovationGroupedStatusEnum } from '@modules/stores/innovation/innovation.enums';


type FilterKeysType = 'mainCategories' | 'locations' | 'groupedStatuses';

@Component({
  selector: 'app-assessment-pages-innovations-list',
  templateUrl: './innovations-list.component.html'
})
export class InnovationsListComponent extends CoreComponent implements OnInit {

  innovationsList = new TableModel<
    InnovationsListDTO['data'][0] & { groupedStatus: InnovationGroupedStatusEnum },
    InnovationsListFiltersType
  >({ pageSize: 20 });

  form = new FormGroup({
    search: new FormControl(''),
    assignedToMe: new FormControl(true),
    groupedStatuses: new FormArray([]),
    mainCategories: new FormArray([]),
    locations: new FormArray([]),
  }, { updateOn: 'change' });

  anyFilterSelected = false;
  filters: {
    key: FilterKeysType,
    title: string,
    showHideStatus: 'opened' | 'closed',
    selected: { label: string, value: string }[],
    active: boolean
  }[] = [
      { key: 'groupedStatuses', title: 'Status', showHideStatus: 'closed', selected: [], active: false },
      { key: 'mainCategories', title: 'Main category', showHideStatus: 'closed', selected: [], active: false },
      { key: 'locations', title: 'Location', showHideStatus: 'closed', selected: [], active: false },
    ];

  datasets: { [key in FilterKeysType]: { label: string, value: string }[] } = {
    mainCategories: mainCategoryItems.map(i => ({ label: i.label, value: i.value })),
    locations: locationItems.filter(i => i.label !== 'SEPARATOR').map(i => ({ label: i.label, value: i.value })),
    groupedStatuses: []
  };


  constructor(
    private innovationsService: InnovationsService
  ) {

    super();

    this.setPageTitle('Innovations');

    this.innovationsList.setVisibleColumns({
      name: { label: 'Innovation', orderable: true },
      submittedAt: { label: 'Submitted', orderable: true },
      assessedBy: { label: 'Assessed by', orderable: true },
      statusUpdatedAt: { label: 'Updated status', orderable: true },
      groupedStatus: { label: 'Status', orderable: false },
    }).setOrderBy('submittedAt', 'ascending');

  }

  ngOnInit(): void {

    let filters: FilterKeysType[] = ['groupedStatuses', 'locations', 'mainCategories'];

    this.datasets.groupedStatuses = Object.keys(
      [InnovationGroupedStatusEnum.AWAITING_NEEDS_ASSESSMENT, InnovationGroupedStatusEnum.AWAITING_NEEDS_REASSESSMENT, InnovationGroupedStatusEnum.NEEDS_ASSESSMENT]
    ).map(groupedStatus => ({ label: this.translate(`shared.catalog.innovation.grouped_status.${groupedStatus}.name`), value: groupedStatus }))

    this.filters = this.filters.map(filter => ({ ...filter, active: filters.includes(filter.key) }));

    this.subscriptions.push(
      this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange())
    );

    this.onFormChange();

  }


  getInnovationsList(): void {

    this.setPageStatus('LOADING');

    this.innovationsService.getInnovationsList(this.innovationsList.getAPIQueryParams()).subscribe(response => {
      this.innovationsList.setData(
        response.data.map(innovation => ({
          ...innovation,
          groupedStatus: this.getGroupedStatus(innovation),
        })
        ),
        response.count);
      this.setPageStatus('READY');
    });

  }


  onFormChange(): void {

    this.setPageStatus('LOADING');

    this.filters.forEach(filter => {
      const f = this.form.get(filter.key)!.value as string[];
      filter.selected = this.datasets[filter.key].filter(i => f.includes(i.value));
    });

    /* istanbul ignore next */
    this.anyFilterSelected = this.filters.filter(i => i.selected.length > 0).length > 0 || !!this.form.get('assignedToMe')?.value || !!this.form.get('suggestedOnly')?.value;

    this.innovationsList.setFilters({
      name: this.form.get('search')?.value,
      mainCategories: this.form.get('mainCategories')?.value,
      locations: this.form.get('locations')?.value,
      groupedStatuses: this.form.get('groupedStatuses')?.value,
      assignedToMe: this.form.get('assignedToMe')?.value ?? false,
    });

    this.innovationsList.setPage(1);

    this.getInnovationsList();

  }

  onTableOrder(column: string): void {

    this.innovationsList.setOrderBy(column);
    this.getInnovationsList();
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

    this.innovationsList.setPage(event.pageNumber);
    this.getInnovationsList();

  }

  getDateDifferenceInDays(date: DateISOType | null) {
    return DatesHelper.dateDiff(date ?? '', new Date().toISOString());
  }

  private getGroupedStatus(innovation: InnovationsListDTO['data'][0]) {
    return this.stores.innovation.getGroupedInnovationStatus(
      innovation.status,
      (innovation.supports ?? []).map(support => support.status),
      innovation.assessment?.reassessmentCount ?? 0
    );
  }

}
