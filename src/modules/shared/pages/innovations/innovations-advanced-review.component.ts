import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { locationItems } from '@modules/stores/innovation/config/innovation-catalog.config';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';

import { InnovationsListDTO, InnovationsListFiltersType } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { catalogOfficeLocation } from '@modules/stores/innovation/innovation-record/202304/catalog.types';
import { InnovationGroupedStatusEnum } from '@modules/stores/innovation/innovation.enums';

type FilterKeysType = 'locations' | 'engagingOrganisations' | 'supportStatuses' | 'groupedStatuses';

@Component({
  selector: 'shared-pages-innovations-advanced-review',
  templateUrl: './innovations-advanced-review.component.html'
})
export class PageInnovationsAdvancedReviewComponent extends CoreComponent implements OnInit {
  innovationsList = new TableModel<
    InnovationsListDTO['data'][0] & {
      supportInfo?: { status: null | InnovationSupportStatusEnum };
      groupedStatus: InnovationGroupedStatusEnum;
      engagingOrgs: InnovationsListDTO['data'][0]['supports'];
    },
    InnovationsListFiltersType
  >({ pageSize: 20 });

  form = new FormGroup(
    {
      search: new FormControl('', { updateOn: 'blur' }),
      locations: new FormArray([]),
      supportStatuses: new FormArray([]),
      groupedStatuses: new FormArray([]),
      engagingOrganisations: new FormArray([]),
      assignedToMe: new FormControl(false),
      suggestedOnly: new FormControl(true)
    },
    { updateOn: 'change' }
  );

  anyFilterSelected = false;
  filters: {
    key: FilterKeysType;
    title: string;
    showHideStatus: 'opened' | 'closed';
    selected: { label: string; value: string }[];
    active: boolean;
  }[] = [
    { key: 'locations', title: 'Location', showHideStatus: 'closed', selected: [], active: false },
    { key: 'groupedStatuses', title: 'Innovation status', showHideStatus: 'closed', selected: [], active: false },
    {
      key: 'engagingOrganisations',
      title: 'Engaging organisations',
      showHideStatus: 'closed',
      selected: [],
      active: false
    },
    { key: 'supportStatuses', title: 'Support status', showHideStatus: 'closed', selected: [], active: false }
  ];

  datasets: { [key in FilterKeysType]: { label: string; value: string }[] } = {
    locations: locationItems.filter(i => i.label !== 'SEPARATOR').map(i => ({ label: i.label, value: i.value })),
    engagingOrganisations: [],
    supportStatuses: [],
    groupedStatuses: []
  };

  constructor(
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService
  ) {
    super();

    // Force reload if running on server because of SSR and session storage
    if (this.isRunningOnServer()) {
      this.router.navigate([]);
    }

    this.setPageTitle('Innovations advanced search');

    if (this.stores.authentication.isAdminRole()) {
      this.setPageTitle('Innovations');
    }

    let columns: {
      [key: string]: string | { label: string; align?: 'left' | 'right' | 'center'; orderable?: boolean };
    } = {
      name: { label: 'Innovation', orderable: true },
      submittedAt: { label: 'Submitted', orderable: true },
      mainCategory: { label: 'Main category', orderable: true },
      location: { label: 'Location', orderable: true },
      supportStatus: { label: 'Support status', align: 'right', orderable: false }
    };
    const orderBy: { key: string; order?: 'descending' | 'ascending' } = { key: 'submittedAt', order: 'descending' };

    if (this.stores.authentication.isAdminRole()) {
      columns = {
        name: { label: 'Innovation', orderable: true },
        updatedAt: { label: 'Updated', orderable: true },
        groupedStatus: { label: 'Innovation status', orderable: false },
        engagingOrgs: { label: 'Engaging orgs', align: 'right', orderable: false }
      };
      orderBy.key = 'updatedAt';
    }

    this.innovationsList.setVisibleColumns(columns).setOrderBy(orderBy.key, orderBy.order);
  }

  ngOnInit(): void {
    let filters: FilterKeysType[] = ['engagingOrganisations', 'locations', 'supportStatuses'];

    if (this.stores.authentication.isAdminRole()) {
      filters = ['engagingOrganisations', 'groupedStatuses'];
      this.form.get('suggestedOnly')?.setValue(false);
      this.datasets.groupedStatuses = Object.keys(InnovationGroupedStatusEnum).map(groupedStatus => ({
        label: this.translate(`shared.catalog.innovation.grouped_status.${groupedStatus}.name`),
        value: groupedStatus
      }));
    } else if (this.stores.authentication.isAccessorRole()) {
      this.datasets.supportStatuses = Object.entries(INNOVATION_SUPPORT_STATUS)
        .map(([key, item]) => ({ label: item.label, value: key }))
        .filter(i => ['ENGAGING', 'CLOSED'].includes(i.value));
    } else if (this.stores.authentication.isQualifyingAccessorRole()) {
      this.datasets.supportStatuses = Object.entries(INNOVATION_SUPPORT_STATUS).map(([key, item]) => ({
        label: item.label,
        value: key
      }));
    }

    this.filters = this.filters.map(filter => ({ ...filter, active: filters.includes(filter.key) }));

    this.organisationsService.getOrganisationsList({ unitsInformation: false }).subscribe({
      next: response => {
        if (this.stores.authentication.isAdminRole() === true) {
          this.datasets.engagingOrganisations = response.map(i => ({ label: i.name, value: i.id }));
        } else {
          const myOrganisation = this.stores.authentication.getUserInfo().organisations[0].id;
          this.datasets.engagingOrganisations = response
            .filter(i => i.id !== myOrganisation)
            .map(i => ({ label: i.name, value: i.id }));
        }

        // If we have previous filters, set them
        const previousFilters = sessionStorage.getItem('innovationListFilters');
        if (previousFilters) {
          const filters = JSON.parse(previousFilters);
          Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v: string) => {
                const formFilter = this.form.get(key) as FormArray;
                formFilter.push(new FormControl(v), { emitEvent: false });
              });
            } else {
              this.form.get(key)?.setValue(value, { emitEvent: false });
            }
          });
        }

        // Formchange must be triggered only after organisations are loaded so that it is populated
        this.onFormChange();
      },
      error: error => {
        this.logger.error(error);
      }
    });

    this.subscriptions.push(this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange()));
  }

  getInnovationsList(column?: string): void {
    this.setPageStatus('LOADING');

    // Temporarily until we use the new API for all
    if (this.stores.authentication.isQualifyingAccessorRole() || this.stores.authentication.isAdminRole()) {
      const { locations, assignedToMe, suggestedOnly, engagingOrganisations, supportStatuses } =
        this.innovationsList.filters;
      const { order, skip, take } = this.innovationsList.getAPIQueryParams();
      this.innovationsService
        .getInnovationsList2(
          ['id', 'name', 'careSettings'],
          {
            locations: locations as catalogOfficeLocation[],
            assignedToMe,
            suggestedOnly,
            engagingOrganisations,
            supportStatuses
          },
          { order, skip, take }
        )
        .subscribe(response => {
          console.log(response);
        });
      // TODO Handle it here, just logging for now but this should replace the requests for the cards
    }

    this.innovationsService
      .getInnovationsList({ queryParams: this.innovationsList.getAPIQueryParams(), fields: ['groupedStatus'] })
      .subscribe(response => {
        this.innovationsList.setData(
          response.data.map(innovation => {
            let status = null;

            if (this.stores.authentication.isAdminRole() === false) {
              status =
                (innovation.supports || []).find(
                  s => s.organisation.unit.id === this.stores.authentication.getUserContextInfo()?.organisationUnit?.id
                )?.status ?? InnovationSupportStatusEnum.UNASSIGNED;
            }

            return {
              ...innovation,
              ...{
                supportInfo: {
                  status
                }
              },
              groupedStatus: innovation.groupedStatus ?? InnovationGroupedStatusEnum.RECORD_NOT_SHARED, // default never happens
              engagingOrgs: innovation.supports?.filter(
                support => support.status === InnovationSupportStatusEnum.ENGAGING
              )
            };
          }),
          response.count
        );
        if (this.isRunningOnBrowser() && column) this.innovationsList.setFocusOnSortedColumnHeader(column);
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
    this.anyFilterSelected =
      this.filters.filter(i => i.selected.length > 0).length > 0 ||
      !!this.form.get('assignedToMe')?.value ||
      !!this.form.get('suggestedOnly')?.value;

    this.innovationsList.setFilters({
      name: this.form.get('search')?.value,
      mainCategories: this.form.get('mainCategories')?.value,
      locations: this.form.get('locations')?.value,
      engagingOrganisations: this.form.get('engagingOrganisations')?.value,
      supportStatuses: this.form.get('supportStatuses')?.value,
      groupedStatuses: this.form.get('groupedStatuses')?.value,
      ...(this.stores.authentication.isAccessorType() && {
        assignedToMe: this.form.get('assignedToMe')?.value ?? false,
        suggestedOnly: this.form.get('suggestedOnly')?.value ?? false
      })
    });

    this.innovationsList.setPage(1);

    // persist in session storage
    sessionStorage.setItem('innovationListFilters', JSON.stringify(this.form.value));

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
}
