import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation/innovation.models';
import { getInnovationRecordConfig } from '@modules/stores/innovation/innovation-record/ir-versions.config';

import { InnovationActionsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsActionsListFilterType, InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationActionStatusEnum, InnovationSectionEnum, InnovationStatusEnum } from '@modules/stores/innovation';

type FilterKeysType = 'status' | 'sections' | 'innovationStatus';

@Component({
  selector: 'shared-pages-actions-advanced-search',
  templateUrl: './actions-advanced-search.component.html'
})
export class PageActionsAdvancedSearchComponent extends CoreComponent implements OnInit {

  actionsList = new TableModel<InnovationActionsListDTO['data'][0], InnovationsActionsListFilterType>({});

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  form = new FormGroup({
    innovationName: new FormControl<string>(''),
    status: new FormArray<FormControl<InnovationActionStatusEnum>>([]),
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
      { key: 'status', title: 'Status', showHideStatus: 'closed', selected: [], active: false },
      { key: 'sections', title: 'Innovation record section', showHideStatus: 'closed', selected: [], active: false },
      { key: 'innovationStatus', title: 'Needs assessment status', showHideStatus: 'closed', selected: [], active: false }
    ];

  datasets: { [key in FilterKeysType]: { label: string, value: InnovationActionStatusEnum | InnovationStatusEnum |  string }[] } = {
    status: [],
    sections: [],
    innovationStatus: []
  };

  innovationsList: any;

  constructor(
    private innovationsService: InnovationsService
  ) {

    super();

    let title = 'Actions advanced search';

    if(this.stores.authentication.isAssessmentType()) {
      title = 'Actions';
    }

    this.setPageTitle(title);

    this.actionsList.setVisibleColumns({
      section: { label: 'Actions', orderable: true },
      innovationName: { label: 'Innovations', orderable: true },
      updatedAt: { label: 'Updated', orderable: true },
      status: { label: 'Status', align: 'right', orderable: true }
    }).setOrderBy('updatedAt', 'descending');

  }

  ngOnInit(): void {

    let filters: FilterKeysType[] = ['status', 'sections'];

    this.datasets.status = Object.entries(INNOVATION_SECTION_ACTION_STATUS).
      map(([key, item]) => ({ label: item.label, value: key })).
      filter(i => [
        InnovationActionStatusEnum.REQUESTED,
        InnovationActionStatusEnum.SUBMITTED,
        InnovationActionStatusEnum.COMPLETED,
        InnovationActionStatusEnum.DECLINED,
        InnovationActionStatusEnum.DELETED,
        InnovationActionStatusEnum.CANCELLED
      ].includes(i.value as InnovationActionStatusEnum));

    this.datasets.sections = getInnovationRecordConfig().reduce((sectionGroupAcc: { value: string, label: string }[], sectionGroup, i) => {
      return [
        ...sectionGroupAcc,
        ...sectionGroup.sections.reduce((sectionAcc: { value: string, label: string }[], section, j) => {
          return [...sectionAcc, ...[{ value: section.id, label: `${i + 1}.${j + 1} ${section.title}` }]];
        }, [])
      ];
    }, []);

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

  getActionsList(): void {

    this.setPageStatus('LOADING');

    this.innovationsService.getActionsList(this.actionsList.getAPIQueryParams()).subscribe(response => {
      this.actionsList.setData(response.data, response.count);
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
    this.anyFilterSelected = this.filters.filter(i => i.selected.length > 0).length > 0;

    this.actionsList
      .clearData()
      .setFilters({
        ...(this.form.get('innovationName')?.value ? { innovationName: this.form.get('innovationName')?.value || '' } : {}),
        ...(this.form.get('status')?.value ? { status: this.form.get('status')?.value } : {}),
        ...(this.form.get('sections')?.value ? { sections: this.form.get('sections')?.value } : {}),
        ...(this.form.get('innovationStatus')?.value ? { innovationStatus: this.form.get('innovationStatus')?.value } : {}),
        createdByMe: this.stores.authentication.isAssessmentType() ? this.form.get('createdByMe')?.value ?? true : true,
        fields: ['notifications']
      });

    this.getActionsList();

  }


  onTableOrder(column: string): void {
    this.actionsList.setOrderBy(column);
    this.getActionsList();
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
    this.actionsList.setPage(event.pageNumber);
    this.getActionsList();
  }

}
