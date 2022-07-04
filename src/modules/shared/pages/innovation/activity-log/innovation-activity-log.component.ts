import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent, FormArray, FormGroup } from '@app/base';
import { TableModel } from '@app/base/models';

import { EnvironmentInnovationType } from '@modules/stores/environment/environment.types';

import { ActivityLogTypesEnum, ACTIVITY_LOG_ITEMS } from '@modules/stores/innovation';
import { ActivityLogOutDTO } from '@modules/stores/innovation/innovation.service';


type FilterKeysType = 'activityTypes';
type ActivitiesListType = ActivityLogOutDTO['data'][0] & { showHideStatus: 'opened' | 'closed', showHideText: string };
type FiltersType = { key: FilterKeysType, title: string, showHideStatus: 'opened' | 'closed', selected: { label: string, value: string }[] };


@Component({
  selector: 'shared-pages-innovation-activity-log',
  templateUrl: './innovation-activity-log.component.html'
})
export class PageInnovationActivityLogComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' | 'assessment' = '';
  innovation: EnvironmentInnovationType;

  INNOVATION_SUPPORT_STATUS = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  ACTIVITY_LOG_ITEMS = ACTIVITY_LOG_ITEMS;

  activitiesList: TableModel<ActivitiesListType, { activityTypes: keyof ActivityLogTypesEnum }>;

  currentDateOrderBy: 'ascending' | 'descending';

  form = new FormGroup({
    activityTypes: new FormArray([])
  }, { updateOn: 'change' });

  anyFilterSelected = false;
  filters: FiltersType[] = [{ key: 'activityTypes', title: 'Activity Types', showHideStatus: 'opened', selected: [] }];

  datasets: { [key in FilterKeysType]: { label: string, value: string, description: string }[] } = {
    activityTypes: Object.keys(ActivityLogTypesEnum).map(i => ({
      label: this.translate(`shared.catalog.innovation.activity_log_groups.${i}.title`),
      value: i,
      description: this.translate(`shared.catalog.innovation.activity_log_groups.${i}.description`)
    }))
  };


  get selectedFilters(): FiltersType[] {
    if (!this.anyFilterSelected) { return []; }
    return this.filters.filter(i => i.selected.length > 0);
  }


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.setPageTitle('Activity log');

    this.module = this.activatedRoute.snapshot.data.module;
    this.innovation = this.stores.environment.getInnovation();

    this.activitiesList = new TableModel({ orderBy: 'createdAt', orderDir: 'descending' });
    this.currentDateOrderBy = 'descending';

  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange())
    );

    this.onFormChange();

  }


  getActivitiesLogList(): void {

    this.setPageStatus('LOADING');

    this.stores.innovation.getActivityLog$(this.module, this.innovation.id, this.activitiesList.getAPIQueryParams()).subscribe(
      response => {

        this.activitiesList.setData(
          response.data.map(i => ({ ...i, showHideStatus: 'closed', showHideText: 'Show details' })),
          response.count
        );

        this.setPageStatus('READY');

      },
      error => {
        this.setPageStatus('ERROR');
        this.logger.error(error);
      }
    );

  }


  onFormChange(): void {

    this.setPageStatus('LOADING');

    this.filters.forEach(filter => {
      const f = this.form.get(filter.key)!.value as string[];
      filter.selected = this.datasets[filter.key].filter(i => f.includes(i.value));
    });

    /* istanbul ignore next */
    this.anyFilterSelected = this.filters.filter(i => i.selected.length > 0).length > 0;

    this.activitiesList.setFilters({
      activityTypes: this.form.get('activityTypes')!.value
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

}
