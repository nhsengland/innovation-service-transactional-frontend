import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormArray, FormGroup } from '@app/base/forms';
import { TableModel } from '@app/base/models';

import { ContextInnovationType } from '@modules/stores/context/context.types';

import { ActivityLogTypesEnum, ACTIVITY_LOG_ITEMS } from '@modules/stores/innovation';
import { ActivityLogOutDTO } from '@modules/stores/innovation/innovation.service';
import { DatesHelper } from '@app/base/helpers';


enum FilterTypeEnum {
  CHECKBOX = 'CHECKBOX',
  DATERANGE = 'DATERANGE',
}

type FilterKeysType = 'activityTypes' | 'activityDate';
type ActivitiesListType = ActivityLogOutDTO['data'][0] & { showHideStatus: 'opened' | 'closed', showHideText: string };

type FiltersType = {
  key: FilterKeysType,
  title: string,
  showHideStatus: 'opened' | 'closed',
  type: FilterTypeEnum;
  selected: {
    label: string,
    value: string;
    formControl?: string,
  }[];
}

type DatasetType = {
  [key: string]: {
    label: string,
    description?: string,
    value: string,
    formControl?: string,
  }[]
}


@Component({
  selector: 'shared-pages-innovation-activity-log',
  templateUrl: './innovation-activity-log.component.html'
})
export class PageInnovationActivityLogComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' | 'assessment' = '';
  innovation: ContextInnovationType;

  ACTIVITY_LOG_ITEMS = ACTIVITY_LOG_ITEMS;

  activitiesList = new TableModel<ActivitiesListType, { activityTypes: ActivityLogTypesEnum[], startDate: string, endDate: string }>();

  currentDateOrderBy: 'ascending' | 'descending';

  form = new FormGroup({
    activityTypes: new FormArray([]),
    startDate: new FormControl(null, CustomValidators.parsedDateStringValidator()),
    endDate: new FormControl(null, CustomValidators.parsedDateStringValidator()),
  }, { updateOn: 'change' });

  anyFilterSelected = false;
  filters: FiltersType[] = [
    {
      key: 'activityTypes',
      title: 'Activity Types',
      showHideStatus: 'closed',
      type: FilterTypeEnum.CHECKBOX,
      selected: []
    },
    {
      key: 'activityDate',
      title: 'Activity Date',
      showHideStatus: 'closed',
      type: FilterTypeEnum.DATERANGE,
      selected: []
    }
  ];

  datasets: DatasetType = {
    activityTypes: Object.keys(ActivityLogTypesEnum)
      .filter(item => item !== ActivityLogTypesEnum.COMMENTS)
      .map(i => ({
        label: this.translate(`shared.catalog.innovation.activity_log_groups.${i}.title`),
        value: i,
        description: this.translate(`shared.catalog.innovation.activity_log_groups.${i}.description`)
      })),
    activityDate: [
      {
        label: "Activity date after",
        description: "For example, 2005 or 21/11/2014",
        value: "",
        formControl: "startDate",
      },
      {
        label: "Activity date before",
        description: "For example, 2005 or 21/11/2014",
        value: "",
        formControl: "endDate",
      }
    ]
  };

  get selectedFilters(): FiltersType[] {
    if (!this.anyFilterSelected) { return []; }
    return this.filters.filter(i => i.selected.length > 0);
  }

  constructor() {

    super();
    this.innovation = this.stores.context.getInnovation();

    this.setPageTitle('Activity log');
    this.setBackLink('Go back', `/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}`, `to ${this.innovation.name} innovation`);

    this.activitiesList.setOrderBy('createdAt', 'descending');
    this.currentDateOrderBy = 'descending';

  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.form.valueChanges.pipe(debounceTime(1000)).subscribe(() => this.onFormChange())
    );

    this.onFormChange();

  }


  getActivitiesLogList(): void {

    this.setPageStatus('LOADING');

    this.stores.innovation.getActivityLog$(this.innovation.id, this.activitiesList.getAPIQueryParams()).subscribe(
      response => {

        this.activitiesList.setData(
          response.data.map(i => ({ ...i, showHideStatus: 'closed', showHideText: 'Show details' })),
          response.count
        );

        this.setPageStatus('READY');

      }
    );

  }


  onFormChange(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

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
    this.anyFilterSelected = this.filters.filter(i => i.selected.length > 0).length > 0;

    this.activitiesList.setFilters({
      activityTypes: this.form.get('activityTypes')!.value,
      startDate: this.getDateByControlName('startDate') ?? '',
      endDate: this.getDateByControlName('endDate') ?? '',
    });

    this.getActivitiesLogList();

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


  onDateOrderBy(order: 'ascending' | 'descending'): void {
    this.currentDateOrderBy = order;
    this.activitiesList.setOrderBy('createdAt', order);
    this.getActivitiesLogList();
  }

  onShowHideClicked(activity: ActivitiesListType): void {

    switch (activity.showHideStatus) {
      case 'opened':
        activity.showHideStatus = 'closed';
        activity.showHideText = `Show details`;
        break;
      case 'closed':
        activity.showHideStatus = 'opened';
        activity.showHideText = `Hide details`;
        break;
      default:
        break;
    }

  }

  onPageChange(event: { pageNumber: number }): void {
    this.activitiesList.setPage(event.pageNumber);
    this.getActivitiesLogList();
  }

  // Daterange helpers
  getDaterangeFilterTitle(filter: FiltersType): string {
    const afterDate = this.form.get(this.datasets[filter.key][0].formControl!)!.value;
    const beforeDate = this.form.get(this.datasets[filter.key][1].formControl!)!.value;

    if (afterDate !== null && beforeDate === null) return "Activity after";

    if (afterDate === null && beforeDate !== null) return "Activity before";

    return "Activity between";
  }

  onRemoveDateRangeFilter(formControlName: string, value: string): void {

    const formValue = this.getDateByControlName(formControlName);

    if (formValue === value) {
      this.form.patchValue({
        [formControlName]: null
      })
    }

  }

  getDateByControlName(formControlName: string) {
    const value = this.form.get(formControlName)!.value;
    return DatesHelper.parseIntoValidFormat(value);
  }

}
