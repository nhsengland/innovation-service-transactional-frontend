import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { FormGroup } from '@app/base/forms';
import { TableModel } from '@app/base/models';

import { InnovationActivityLogListDTO } from '@modules/shared/services/innovations.dtos';
import { ContextInnovationType, ActivityLogTypesEnum } from '@modules/stores';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { Dataset, FiltersModel } from '@modules/core/models/filters/filters.model';
import { getConfig } from './innovation-activity-log.config';
import { ACTIVITY_LOG_ITEMS } from '@modules/stores/ctx/innovation/innovation.models';

type ActivitiesListType = InnovationActivityLogListDTO['data'][0] & {
  showHideStatus: 'opened' | 'closed';
  showHideText: string;
};

@Component({
  selector: 'shared-pages-innovation-activity-log',
  templateUrl: './innovation-activity-log.component.html'
})
export class PageInnovationActivityLogComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;

  ACTIVITY_LOG_ITEMS = ACTIVITY_LOG_ITEMS;

  activitiesList = new TableModel<ActivitiesListType, Record<string, any>>();

  currentDateOrderBy: 'ascending' | 'descending';

  filtersModel!: FiltersModel;
  form!: FormGroup;

  constructor(private innovationsService: InnovationsService) {
    super();
    this.innovation = this.ctx.innovation.info();

    this.activitiesList.setOrderBy('createdAt', 'descending');
    this.currentDateOrderBy = 'descending';
  }

  ngOnInit(): void {
    const { filters } = getConfig();
    const datasets: Record<string, Dataset> = {
      activityTypes: Object.keys(ActivityLogTypesEnum)
        .filter(i => i !== ActivityLogTypesEnum.COMMENTS)
        .map(i => ({
          value: i,
          label: this.translate(`shared.catalog.innovation.activity_log_groups.${i}.title`),
          description: this.translate(`shared.catalog.innovation.activity_log_groups.${i}.description`)
        }))
    };

    this.filtersModel = new FiltersModel({ filters, datasets });
    this.form = this.filtersModel.form;

    this.subscriptions.push(this.form.valueChanges.pipe(debounceTime(1000)).subscribe(() => this.onFormChange()));

    this.setPageTitle('Activity log');
    this.setBackLink('Go back');

    this.onFormChange();
  }

  getActivitiesLogList(): void {
    this.setPageStatus('LOADING');

    this.innovationsService
      .getInnovationActivityLog(this.innovation.id, this.activitiesList.getAPIQueryParams())
      .subscribe(response => {
        this.activitiesList.setData(
          response.data.map(i => ({ ...i, showHideStatus: 'closed', showHideText: 'Show details' })),
          response.count
        );

        this.setPageStatus('READY');
      });
  }

  onFormChange(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
    }

    this.setPageStatus('LOADING');

    this.filtersModel.handleStateChanges();
    this.activitiesList.setFilters(this.filtersModel.getAPIQueryParams());

    this.activitiesList.setPage(1);
    this.getActivitiesLogList();
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
