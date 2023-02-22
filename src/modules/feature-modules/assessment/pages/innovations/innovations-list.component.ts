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
import { CustomValidators } from '@modules/shared/forms';
import { InnovationGroupedStatusEnum } from '@modules/stores/innovation/innovation.enums';

enum FilterTypeEnum {
  CHECKBOX = 'CHECKBOX',
  DATERANGE = 'DATERANGE',
}

type FilterKeysType = 'mainCategories' | 'locations' | 'groupedStatuses' | 'submittedDate';

type DatasetType = {
  [key: string]: {
    label: string,
    description?: string,
    value: string,
    formControl?: string
  }[]
}

type FiltersType = {
  key: FilterKeysType,
  title: string,
  showHideStatus: 'opened' | 'closed',
  type: FilterTypeEnum;
  selected: {
    label: string,
    value: string;
    formControl?: string
  }[],
  active: boolean
}

@Component({
  selector: 'app-assessment-pages-innovations-list',
  templateUrl: './innovations-list.component.html',
  styleUrls: ['./innovations-list.component.scss']
})
export class InnovationsListComponent extends CoreComponent implements OnInit {

  innovationsList = new TableModel<
    InnovationsListDTO['data'][0] & { submittedAtDaysDiff: number },
    InnovationsListFiltersType
  >({ pageSize: 20 });

  form = new FormGroup({
    search: new FormControl(''),
    assignedToMe: new FormControl(true),
    groupedStatuses: new FormArray([]),
    mainCategories: new FormArray([]),
    locations: new FormArray([]),
    submittedStartDate: new FormControl(null, CustomValidators.parsedDateStringValidator()),
    submittedEndDate: new FormControl(null, CustomValidators.parsedDateStringValidator()),
  }, { updateOn: 'blur' });

  anyFilterSelected = false;
  filters: FiltersType[] = [
    { key: 'groupedStatuses', title: 'Status', showHideStatus: 'closed', type: FilterTypeEnum.CHECKBOX, selected: [], active: false },
    { key: 'submittedDate', title: 'Filter by date', showHideStatus: 'closed', type: FilterTypeEnum.DATERANGE, selected: [], active: false },
    { key: 'mainCategories', title: 'Primary category', showHideStatus: 'closed', type: FilterTypeEnum.CHECKBOX, selected: [], active: false },
    { key: 'locations', title: 'Location', showHideStatus: 'closed', type: FilterTypeEnum.CHECKBOX, selected: [], active: false },
  ];

  datasets: DatasetType = {
    mainCategories: mainCategoryItems.map(i => ({ label: i.label, value: i.value })),
    locations: locationItems.filter(i => i.label !== 'SEPARATOR').map(i => ({ label: i.label, value: i.value })),
    groupedStatuses: [],
    submittedDate: [
      {
        label: "Submitted after",
        description: "For example, 2005 or 21/11/2014",
        value: "",
        formControl: "submittedStartDate",
      },
      {
        label: "Submitted before",
        description: "For example, 2005 or 21/11/2014",
        value: "",
        formControl: "submittedEndDate",
      }
    ]
  };

  get selectedFilters(): FiltersType[] {
    if (!this.anyFilterSelected) { return []; }
    return this.filters.filter(i => i.selected.length > 0);
  }

  constructor(
    private innovationsService: InnovationsService
  ) {

    super();

    this.setPageTitle('Innovations');

    this.innovationsList.setVisibleColumns({
      name: { label: 'Innovation', orderable: true },
      submittedAt: { label: 'Submitted', orderable: true },
      assessedBy: { label: 'Assessed by', orderable: true },
      groupedStatus: { label: 'Status', orderable: false, align: 'right' },
    }).setOrderBy('submittedAt', 'descending');

  }

  ngOnInit(): void {

    let filters: FilterKeysType[] = ['groupedStatuses', 'locations', 'mainCategories'];

    this.datasets.groupedStatuses = [InnovationGroupedStatusEnum.AWAITING_NEEDS_ASSESSMENT, InnovationGroupedStatusEnum.AWAITING_NEEDS_REASSESSMENT, InnovationGroupedStatusEnum.NEEDS_ASSESSMENT]
      .map(groupedStatus => ({ label: this.translate(`shared.catalog.innovation.grouped_status.${groupedStatus}.name`), value: groupedStatus }))

    this.filters = this.filters.map(filter => ({ ...filter, active: filters.includes(filter.key) }));

    this.subscriptions.push(
      this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange())
    );

    this.onFormChange();

  }


  getInnovationsList(): void {

    this.setPageStatus('LOADING');

    this.innovationsService.getInnovationsList({ queryParams: this.innovationsList.getAPIQueryParams(), fields: ["groupedStatus"] }).subscribe(response => {
      this.innovationsList.setData(
        response.data.map(innovation => ({
          ...innovation,
          submittedAtDaysDiff: this.getDateDifferenceInDays(innovation.submittedAt),
        })
        ),
        response.count);
      this.setPageStatus('READY');
    });

  }


  onFormChange(): void {

    this.setPageStatus('LOADING');

    for (const filter of this.filters) {

      if (filter.type === FilterTypeEnum.CHECKBOX) {
        const f = this.form.get(filter.key)!.value as string[];
        filter.selected = this.datasets[filter.key].filter(i => f.includes(i.value));
      }

      if (filter.type === FilterTypeEnum.DATERANGE) {
        const selected = [];

        for (const option of this.datasets[filter.key]) {
          const date = this.getDateByControlName(option.formControl!);

          if (date !== null) {
            selected.push({
              ...option,
              value: date
            })
          }
        }

        filter.selected = selected;
      }
    }

    /* istanbul ignore next */
    this.anyFilterSelected = this.filters.filter(i => i.selected.length > 0).length > 0 || !!this.form.get('assignedToMe')?.value;

    const groupedStatusesFilter = this.form.get('groupedStatuses')?.value;
    const startDate = this.getDateByControlName('submittedStartDate') ?? undefined;
    const endDate = this.getDateByControlName('submittedEndDate') ?? undefined;

    console.log(groupedStatusesFilter);
    this.innovationsList.setFilters({
      name: this.form.get('search')?.value,
      mainCategories: this.form.get('mainCategories')?.value,
      locations: this.form.get('locations')?.value,
      groupedStatuses: groupedStatusesFilter && groupedStatusesFilter.length > 0
        ? groupedStatusesFilter
        : [InnovationGroupedStatusEnum.AWAITING_NEEDS_ASSESSMENT, InnovationGroupedStatusEnum.AWAITING_NEEDS_REASSESSMENT, InnovationGroupedStatusEnum.NEEDS_ASSESSMENT],
      assignedToMe: this.form.get('assignedToMe')?.value ?? false,
      ...(startDate || endDate ? {
        dateFilter: [{
          field: 'submittedAt',
          startDate,
          endDate,
        }]
      } : {})
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

  // Daterange helpers
  getDaterangeFilterTitle(filter: FiltersType): string {

    const afterDate = this.form.get(this.datasets[filter.key][0].formControl!)!.value;
    const beforeDate = this.form.get(this.datasets[filter.key][1].formControl!)!.value;

    if (afterDate !== null && (beforeDate === null || beforeDate === '')) return "Submitted after";

    if ((afterDate === null || afterDate === '') && beforeDate !== null) return "Submitted before";

    return "Submitted between";

  }

  onRemoveDateRangeFilter(formControlName: string, value: string): void {

    const formValue = this.getDateByControlName(formControlName);

    if (formValue === value) {
      this.form.patchValue({ [formControlName]: null });
    }

  }

  getDateByControlName(formControlName: string) {
    const value = this.form.get(formControlName)!.value;
    return DatesHelper.parseIntoValidFormat(value);
  }

}
