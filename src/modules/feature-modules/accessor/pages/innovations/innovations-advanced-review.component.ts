import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { locationItems } from '@modules/stores/innovation/config/innovation-catalog.config';
import { mainCategoryItems } from '@modules/stores/innovation/sections/catalogs.config';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';

import { InnovationsListDTO, InnovationsListFiltersType, InnovationsService } from '@modules/shared/services/innovations.service';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';


type FilterKeysType = 'mainCategories' | 'locations' | 'engagingOrganisations' | 'supportStatuses';


@Component({
  selector: 'app-accessor-pages-innovations-advanced-review',
  templateUrl: './innovations-advanced-review.component.html'
})
export class InnovationsAdvancedReviewComponent extends CoreComponent implements OnInit {

  innovationsList = new TableModel<
    InnovationsListDTO['data'][0] & { supportInfo: { status: null | InnovationSupportStatusEnum } },
    InnovationsListFiltersType
  >({ pageSize: 20 });

  form = new FormGroup({
    search: new FormControl(''),
    mainCategories: new FormArray([]),
    locations: new FormArray([]),
    supportStatuses: new FormArray([]),
    engagingOrganisations: new FormArray([]),
    assignedToMe: new FormControl(false),
    suggestedOnly: new FormControl(true)
  }, { updateOn: 'change' });

  anyFilterSelected = false;
  filters: {
    key: FilterKeysType,
    title: string,
    showHideStatus: 'opened' | 'closed',
    selected: { label: string, value: string }[]
  }[] = [
      { key: 'mainCategories', title: 'Main category', showHideStatus: 'closed', selected: [] },
      { key: 'locations', title: 'Location', showHideStatus: 'closed', selected: [] },
      { key: 'engagingOrganisations', title: 'Engaging organisations', showHideStatus: 'closed', selected: [] },
      { key: 'supportStatuses', title: 'Support status', showHideStatus: 'closed', selected: [] }
    ];

  datasets: { [key in FilterKeysType]: { label: string, value: string }[] } = {
    mainCategories: mainCategoryItems.map(i => ({ label: i.label, value: i.value })),
    locations: locationItems.filter(i => i.label !== 'SEPARATOR').map(i => ({ label: i.label, value: i.value })),
    engagingOrganisations: [],
    supportStatuses: []
  };


  constructor(
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService
  ) {

    super();
    this.setPageTitle('Innovations advanced search');

    this.innovationsList.setVisibleColumns({
      name: { label: 'Innovation', orderable: true },
      submittedAt: { label: 'Submitted', orderable: true },
      mainCategory: { label: 'Main category', orderable: true },
      countryName: { label: 'Location', orderable: true },
      supportStatus: { label: 'Support status', align: 'right', orderable: false }
    }).setOrderBy('submittedAt', 'descending');

  }

  ngOnInit(): void {

    if (this.stores.authentication.isAccessorRole()) {
      this.datasets.supportStatuses = Object.entries(INNOVATION_SUPPORT_STATUS).map(([key, item]) => ({ label: item.label, value: key })).filter(i => ['ENGAGING', 'COMPLETE'].includes(i.value));
    } else if (this.stores.authentication.isQualifyingAccessorRole()) {
      this.datasets.supportStatuses = Object.entries(INNOVATION_SUPPORT_STATUS).map(([key, item]) => ({ label: item.label, value: key }));
    }

    this.organisationsService.getAccessorsOrganisations().subscribe({
      next: response => {
        const myOrganisation = this.stores.authentication.getUserInfo().organisations[0].id;
        this.datasets.engagingOrganisations = response.filter(i => i.id !== myOrganisation).map(i => ({ label: i.name, value: i.id }));
      },
      error: error => {
        this.logger.error(error);
      }
    });

    this.subscriptions.push(
      this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange())
    );

    this.onFormChange();

  }


  getInnovationsList(): void {

    this.setPageStatus('LOADING');

    this.innovationsService.getInnovationsList(this.innovationsList.getAPIQueryParams()).subscribe(response => {
      this.innovationsList.setData(
        response.data.map(item => ({
          ...item,
          supportInfo: {
            status: (item.supports || []).find(s =>
              s.organisation.unit.id === this.stores.authentication.getUserInfo().organisations[0].organisationUnits[0].id
            )?.status ?? InnovationSupportStatusEnum.UNASSIGNED
          }
        })),
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
      engagingOrganisations: this.form.get('engagingOrganisations')?.value,
      supportStatuses: this.form.get('supportStatuses')?.value,
      assignedToMe: this.form.get('assignedToMe')?.value ?? false,
      suggestedOnly: this.form.get('suggestedOnly')?.value ?? false
    });

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

}
