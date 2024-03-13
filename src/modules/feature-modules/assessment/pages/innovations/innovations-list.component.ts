import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { debounceTime, map } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { DatesHelper } from '@app/base/helpers';
import { TableModel } from '@app/base/models';

import { locationItems } from '@modules/stores/innovation/config/innovation-catalog.config';
import { InnovationGroupedStatusEnum } from '@modules/stores/innovation/innovation.enums';

import { DateISOType } from '@app/base/types';
import { CustomValidators } from '@modules/shared/forms';
import { InnovationsListFiltersType } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';

enum FilterTypeEnum {
  CHECKBOX = 'CHECKBOX',
  DATERANGE = 'DATERANGE'
}

type FilterKeysType = 'locations' | 'groupedStatuses' | 'submittedDate';

type DatasetType = {
  [key: string]: {
    label: string;
    description?: string;
    value: string;
    formControl?: string;
  }[];
};

type FiltersType = {
  key: FilterKeysType;
  title: string;
  showHideStatus: 'opened' | 'closed';
  type: FilterTypeEnum;
  selected: { label: string; value: string; formControl?: string }[];
  active: boolean;
};

@Component({
  selector: 'app-assessment-pages-innovations-list',
  templateUrl: './innovations-list.component.html'
})
export class InnovationsListComponent extends CoreComponent implements OnInit {
  innovationsList = new TableModel<
    {
      id: string;
      name: string;
      groupedStatus: InnovationGroupedStatusEnum;
      submittedAt: DateISOType | null;
      statusUpdatedAt: DateISOType;
      assessment: {
        id: string;
        assignedTo: string | null;
        updatedAt: DateISOType;
        daysFromSubmittedAtToToday: number | null;
        overdueStatus: 'EXEMPT' | 'OVERDUE' | 'ALMOST_DUE' | null;
      } | null;
    },
    InnovationsListFiltersType
  >({ pageSize: 20 });

  form = new FormGroup(
    {
      search: new FormControl(''),
      assignedToMe: new FormControl(false, { updateOn: 'change' }),
      groupedStatuses: new FormArray<FormControl<InnovationGroupedStatusEnum>>([]),
      locations: new FormArray([]),
      submittedStartDate: new FormControl(null, CustomValidators.parsedDateStringValidator()),
      submittedEndDate: new FormControl(null, CustomValidators.parsedDateStringValidator())
    },
    { updateOn: 'blur' }
  );

  anyFilterSelected = false;

  filters: FiltersType[] = [
    {
      key: 'groupedStatuses',
      title: 'Status',
      showHideStatus: 'closed',
      type: FilterTypeEnum.CHECKBOX,
      selected: [],
      active: true
    },
    {
      key: 'submittedDate',
      title: 'Filter by date',
      showHideStatus: 'closed',
      type: FilterTypeEnum.DATERANGE,
      selected: [],
      active: true
    },
    {
      key: 'locations',
      title: 'Location',
      showHideStatus: 'closed',
      type: FilterTypeEnum.CHECKBOX,
      selected: [],
      active: true
    }
  ];

  datasets: DatasetType = {
    locations: locationItems.filter(i => i.label !== 'SEPARATOR').map(i => ({ label: i.label, value: i.value })),
    groupedStatuses: [],
    submittedDate: [
      {
        label: 'Submitted after',
        description: 'For example, 2005 or 21/11/2014',
        value: '',
        formControl: 'submittedStartDate'
      },
      {
        label: 'Submitted before',
        description: 'For example, 2005 or 21/11/2014',
        value: '',
        formControl: 'submittedEndDate'
      }
    ]
  };

  get selectedFilters(): FiltersType[] {
    if (!this.anyFilterSelected) {
      return [];
    }
    return this.filters.filter(i => i.selected.length > 0);
  }

  showOnlyCompleted = false;

  availableGroupedStatus: InnovationGroupedStatusEnum[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.availableGroupedStatus = [
      InnovationGroupedStatusEnum.AWAITING_NEEDS_ASSESSMENT,
      InnovationGroupedStatusEnum.AWAITING_NEEDS_REASSESSMENT,
      InnovationGroupedStatusEnum.NEEDS_ASSESSMENT
    ];

    this.innovationsList
      .setVisibleColumns({
        name: { label: 'Innovation', orderable: true },
        submittedAt: { label: 'Submitted', orderable: true },
        assessedBy: { label: 'Assessed by', orderable: false },
        groupedStatus: { label: 'Status', orderable: false, align: 'right' }
      })
      .setOrderBy('submittedAt', 'descending');
  }

  ngOnInit(): void {
    this.setDatasetGroupedStatuses();

    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(({ status }: Params) => {
        this.setPageTitle('Innovations');
        let preSelectedStatus: undefined | InnovationGroupedStatusEnum[];
        this.setDefaultFilters();

        switch (status) {
          case 'COMPLETED':
            this.showOnlyCompleted = true;
            this.setPageTitle('Needs assessment complete');
            this.setBackLink('Go back', `${this.userUrlBasePath()}/innovations`);
            this.availableGroupedStatus = [
              InnovationGroupedStatusEnum.AWAITING_SUPPORT,
              InnovationGroupedStatusEnum.RECEIVING_SUPPORT,
              InnovationGroupedStatusEnum.NO_ACTIVE_SUPPORT,
              InnovationGroupedStatusEnum.ARCHIVED
            ];
            break;
          case 'NEEDS_ASSESSMENT':
            this.form.get('assignedToMe')?.setValue(true);
            preSelectedStatus = [InnovationGroupedStatusEnum.NEEDS_ASSESSMENT];
            break;
          case 'WAITING_NEEDS_ASSESSMENT':
            preSelectedStatus = [
              InnovationGroupedStatusEnum.AWAITING_NEEDS_ASSESSMENT,
              InnovationGroupedStatusEnum.AWAITING_NEEDS_REASSESSMENT
            ];
            break;
          default:
        }

        this.setDatasetGroupedStatuses();

        if (preSelectedStatus) {
          preSelectedStatus.forEach(status =>
            (this.form.get('groupedStatuses') as FormArray).push(new FormControl(status))
          );

          const groupedStatusesFilter: FiltersType | undefined = this.filters.find(f => f.key === 'groupedStatuses');
          if (groupedStatusesFilter) {
            groupedStatusesFilter.showHideStatus = 'opened';
          }
        }
      }),

      this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange())
    );

    this.onFormChange();
  }

  setDefaultFilters(): void {
    this.availableGroupedStatus = [
      InnovationGroupedStatusEnum.AWAITING_NEEDS_ASSESSMENT,
      InnovationGroupedStatusEnum.AWAITING_NEEDS_REASSESSMENT,
      InnovationGroupedStatusEnum.NEEDS_ASSESSMENT
    ];
    this.form.get('assignedToMe')?.setValue(false);
    (this.form.get('groupedStatuses') as FormArray).clear();
    this.showOnlyCompleted = false;
  }

  setDatasetGroupedStatuses(): void {
    const descriptions = new Map([
      [
        InnovationGroupedStatusEnum.AWAITING_SUPPORT,
        'Waiting for an organisation unit to start supporting this innovation.'
      ],
      [InnovationGroupedStatusEnum.RECEIVING_SUPPORT, 'At least one organisation is supporting the innovation.'],
      [InnovationGroupedStatusEnum.NO_ACTIVE_SUPPORT, 'There are no organisations supporting this innovation.']
    ]);

    this.datasets.groupedStatuses = this.availableGroupedStatus.map(groupedStatus => ({
      label: this.translate(`shared.catalog.innovation.grouped_status.${groupedStatus}.name`),
      value: groupedStatus,
      description: descriptions.get(groupedStatus)
    }));
  }

  getInnovationsList(column?: string): void {
    this.setPageStatus('LOADING');

    const { take, skip, filters, order } = this.innovationsList.getAPIQueryParams();

    this.innovationsService
      .getInnovationsList(
        [
          'id',
          'name',
          'groupedStatus',
          'submittedAt',
          'statusUpdatedAt',
          'assessment.id',
          'assessment.assignedTo',
          'assessment.isExempt',
          'assessment.updatedAt'
        ],
        filters,
        { take, skip, order }
      )
      .pipe(
        map(response => ({
          data: response.data.map(innovation => ({
            ...innovation,
            assessment: innovation.assessment
              ? {
                  id: innovation.assessment.id,
                  assignedTo: innovation.assessment.assignedTo,
                  updatedAt: innovation.assessment.updatedAt,
                  daysFromSubmittedAtToToday: this.getOverdueDays(innovation.submittedAt),
                  overdueStatus: this.getOverdueStatus(innovation.assessment.isExempt, innovation.submittedAt)
                }
              : null
          })),
          count: response.count
        }))
      )
      .subscribe(response => {
        this.innovationsList.setData(response.data, response.count);

        if (this.isRunningOnBrowser() && column) {
          this.innovationsList.setFocusOnSortedColumnHeader(column);
        }

        this.setPageStatus('READY');
      });
  }

  onFormChange(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

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
            selected.push({ ...option, value: date });
          }
        }

        filter.selected = selected;
      }
    }

    /* istanbul ignore next */
    this.anyFilterSelected =
      this.filters.filter(i => i.selected.length > 0).length > 0 || !!this.form.get('assignedToMe')?.value;

    const groupedStatusesFilter = this.form.get('groupedStatuses')?.value;
    const startDate = this.getDateByControlName('submittedStartDate') ?? undefined;
    const endDate = this.getDateByControlName('submittedEndDate') ?? undefined;

    this.innovationsList.setFilters({
      search: this.form.get('search')?.value ?? undefined,
      locations: this.form.get('locations')?.value,
      groupedStatuses:
        groupedStatusesFilter && groupedStatusesFilter.length > 0 ? groupedStatusesFilter : this.availableGroupedStatus,
      assignedToMe: this.form.get('assignedToMe')?.value ?? false,
      ...(startDate || endDate ? { dateFilters: [{ field: 'submittedAt', startDate, endDate }] } : {})
    });

    this.innovationsList.setPage(1);

    this.getInnovationsList();
  }

  onTableOrder(column: string): void {
    this.innovationsList.setOrderBy(column);
    this.getInnovationsList(column);
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

  onSearchClick() {
    this.form.updateValueAndValidity({ onlySelf: true });
  }

  // Daterange helpers
  getDaterangeFilterTitle(filter: FiltersType): string {
    const afterDate = this.form.get(this.datasets[filter.key][0].formControl!)!.value;
    const beforeDate = this.form.get(this.datasets[filter.key][1].formControl!)!.value;

    if (afterDate !== null && (beforeDate === null || beforeDate === '')) return 'Submitted after';

    if ((afterDate === null || afterDate === '') && beforeDate !== null) return 'Submitted before';

    return 'Submitted between';
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

  getOverdueStatus(isExempted: boolean, submittedAt: string | null) {
    if (!submittedAt) {
      return null;
    } // this shouldn't happen since submittedAt is required to reach the assessment phase
    if (isExempted) {
      return 'EXEMPT' as const;
    } else {
      const daysFromSubmittedAtToToday = this.getOverdueDays(submittedAt) ?? 0;
      return daysFromSubmittedAtToToday >= 15
        ? ('OVERDUE' as const)
        : daysFromSubmittedAtToToday >= 10
          ? ('ALMOST_DUE' as const)
          : null;
    }
  }

  getOverdueDays(submittedAt: string | null) {
    return submittedAt ? DatesHelper.dateDiff(submittedAt, new Date().toISOString()) : null;
  }
}
