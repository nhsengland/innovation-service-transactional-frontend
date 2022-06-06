import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent, FormArray, FormControl, FormGroup } from '@app/base';
import { TableModel } from '@app/base/models';

import { INNOVATION_SECTIONS } from '@modules/stores/innovation/innovation.config';
import { INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation/innovation.models';

import { AccessorService, getAdvanceActionsListEndpointOutDTO } from '../../services/accessor.service';

type FilterKeysType = 'innovationStatus' | 'innovationSection';

@Component({
  selector: 'app-accessor-pages-actions-advanced-filter',
  templateUrl: './actions-advanced-filter.component.html'
})
export class ActionAdvancedFilterComponent extends CoreComponent implements OnInit {

  actionsList: TableModel<getAdvanceActionsListEndpointOutDTO['data'][0],
    { name: string, innovationStatus: string[], innovationSection: string[] }>;

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  form = new FormGroup({
    search: new FormControl(),
    innovationStatus: new FormArray([]),
    innovationSection: new FormArray([])
  }, { updateOn: 'change' });

  anyFilterSelected = false;
  filters: {
    key: FilterKeysType,
    title: string,
    showHideStatus: 'opened' | 'closed',
    selected: { label: string, value: string }[]
  }[] = [
      { key: 'innovationStatus', title: 'Status', showHideStatus: 'closed', selected: [] },
      { key: 'innovationSection', title: 'Innovation record section', showHideStatus: 'closed', selected: [] }
    ];

  datasets: { [key in FilterKeysType]: { label: string, value: string }[] } = {
    innovationStatus: [],
    innovationSection: []
  };

  innovationsList: any;

  constructor(
    private accessorService: AccessorService
  ) {

    super();
    this.setPageTitle('Actions');

    this.actionsList = new TableModel({});

    this.actionsList.setVisibleColumns({
      section: { label: 'Action', orderable: true },
      innovationName: { label: 'Innovation', orderable: true },
      createdAt: { label: 'Initiated', orderable: true },
      status: { label: 'Status', align: 'right', orderable: true }
    }).setOrderBy('createdAt', 'descending');

  }

  ngOnInit(): void {

    this.datasets.innovationStatus = Object.entries(INNOVATION_SECTION_ACTION_STATUS).
      map(([key, item]) => ({ label: item.label, value: key })).
      filter(i => ['REQUESTED', 'IN_REVIEW', 'COMPLETED', 'DECLINED', 'CANCELLED'].includes(i.value));

    this.datasets.innovationSection = INNOVATION_SECTIONS.reduce((sectionGroupAcc: { value: string, label: string }[], sectionGroup, i) => {
      return [
        ...sectionGroupAcc,
        ...sectionGroup.sections.reduce((sectionAcc: { value: string, label: string }[], section, j) => {
          return [...sectionAcc, ...[{ value: section.id, label: `${i + 1}.${j + 1} ${section.title}` }]];
        }, [])
      ];
    }, []);

    this.subscriptions.push(
      this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange())
    );

    this.onFormChange();

  }

  getActionsList(): void {

    this.setPageStatus('LOADING');

    this.accessorService.getAdvanceActionsList(this.actionsList.getAPIQueryParams()).subscribe(
      response => {
        this.actionsList.setData(response.data, response.count);
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

    this.actionsList
      .clearData()
      .setFilters({
        name: this.form.get('search')!.value,
        innovationStatus: this.form.get('innovationStatus')!.value,
        innovationSection: this.form.get('innovationSection')!.value,
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
