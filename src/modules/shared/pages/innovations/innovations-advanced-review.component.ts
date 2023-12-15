import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { locationItems } from '@modules/stores/innovation/config/innovation-catalog.config';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';

import { InnovationListSelectType, InnovationsListInDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { InnovationGroupedStatusEnum, InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';

import { AuthenticationStore } from '@modules/stores';
import { AuthenticationModel } from '@modules/stores/authentication/authentication.models';
import { InnovationCardData } from './innovation-advanced-search-card.component';
import {
  careSettingsItems,
  categoriesItems,
  diseasesConditionsImpactItems,
  keyHealthInequalitiesItems
} from '@modules/stores/innovation/innovation-record/202304/forms.config';
import { catalogOfficeLocation } from '@modules/stores/innovation/innovation-record/202304/catalog.types';

type FilterKeysType = 'locations' | 'engagingOrganisations' | 'supportStatuses' | 'groupedStatuses';

@Component({
  selector: 'shared-pages-innovations-advanced-review',
  templateUrl: './innovations-advanced-review.component.html'
})
export class PageInnovationsAdvancedReviewComponent extends CoreComponent implements OnInit {
  baseUrl: string;

  currentUserContext: AuthenticationModel['userContext'];

  isAdminType: boolean = false;
  isAccessorType: boolean = false;

  pageSize: number = 20;
  pageNumber: number = 1;
  filtersList: { [filter: string]: string } | {} = {};
  orderBy: InnovationListSelectType = 'updatedAt';
  orderDir: 'ascending' | 'descending' = 'descending';

  innovationCardsData: InnovationCardData[] = [];
  innovationsCount: number = 0;

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
    scrollable?: boolean;
    active: boolean;
  }[] = [
    { key: 'locations', title: 'Location', showHideStatus: 'closed', selected: [], active: false },
    { key: 'groupedStatuses', title: 'Innovation status', showHideStatus: 'closed', selected: [], active: false },
    {
      key: 'engagingOrganisations',
      title: 'Engaging organisations',
      showHideStatus: 'closed',
      selected: [],
      scrollable: true,
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
    private organisationsService: OrganisationsService,
    private authenticationStore: AuthenticationStore
  ) {
    super();

    this.isAdminType = this.stores.authentication.isAdminRole();
    this.isAccessorType = this.stores.authentication.isAccessorType();

    // Force reload if running on server because of SSR and session storage
    if (this.isRunningOnServer()) {
      this.router.navigate([]);
    }

    if (this.isRunningOnServer()) {
      this.router.navigate([]);
    }

    this.baseUrl = this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/`;

    this.setPageTitle('Advanced search');

    if (this.stores.authentication.isAdminRole()) {
      this.setPageTitle('Innovations');
    }

    const orderBy: { key: string; order?: 'descending' | 'ascending' } = { key: 'submittedAt', order: 'descending' };

    if (this.stores.authentication.isAdminRole()) {
      this.orderBy = 'updatedAt';
    }
  }

  ngOnInit(): void {
    let filters: FilterKeysType[] = ['engagingOrganisations', 'locations', 'supportStatuses'];

    this.currentUserContext = this.authenticationStore.getUserContextInfo();

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
      },
      error: error => {
        this.logger.error(error);
      }
    });

    this.subscriptions.push(this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange()));
  }

  getInnovationsList(): void {
    this.setPageStatus('LOADING');

    const paginationParams = {
      take: this.pageSize,
      skip: (this.pageNumber - 1) * this.pageSize,
      order: this.orderBy
        ? { [this.orderBy]: ['none', 'ascending'].includes(this.orderDir) ? 'ASC' : 'DESC' }
        : undefined
    };

    const apiQueryFilters = {
      // ...(this.form.get('search')?.value ? { name: this.form.get('search')?.value as string } : { search: '' }),
      ...(this.form.get('locations')?.value
        ? { locations: this.form.get('locations')?.value as catalogOfficeLocation[] }
        : null),
      ...(this.form.get('engagingOrganisations')?.value
        ? { engagingOrganisations: this.form.get('engagingOrganisations')?.value }
        : null),
      ...(this.form.get('supportStatuses')?.value
        ? { supportStatuses: this.form.get('supportStatuses')?.value }
        : undefined),
      ...(this.stores.authentication.isAccessorType() && {
        assignedToMe: this.form.get('assignedToMe')?.value ?? undefined,
        suggestedOnly: this.form.get('suggestedOnly')?.value ?? undefined
      })
    };

    this.innovationsService
      .getInnovationsList2(
        [
          'id',
          'name',
          'status',
          'groupedStatus',
          'submittedAt',
          'updatedAt',
          'careSettings',
          'categories',
          'countryName',
          'diseasesAndConditions',
          'involvedAACProgrammes',
          'keyHealthInequalities',
          'mainCategory',
          'otherCategoryDescription',
          'postcode',
          'owner.name',
          'engagingUnits',
          'support.status',
          'support.updatedAt'
        ],
        apiQueryFilters,
        paginationParams
      )
      .subscribe(response => {
        this.innovationsCount = response.count;
        this.innovationCardsData = [];

        response.data.forEach(result => {
          const translatedCategories: string[] = result.categories
            ? (result.categories as []).map(item => {
                return item !== 'NONE'
                  ? categoriesItems.find(entry => entry.value === item)?.label ?? item
                  : result.otherCategoryDescription ?? item;
              })
            : [];

          const translatedCareSettings: string[] = result.careSettings
            ? (result.careSettings as []).map(item => {
                return careSettingsItems.find(entry => entry.value === item)?.label ?? item;
              })
            : [];

          const translatedDiseasesAndConditions: string[] = result.diseasesAndConditions
            ? (result.diseasesAndConditions as []).map(item => {
                return diseasesConditionsImpactItems.find(entry => entry.value === item)?.label ?? item;
              })
            : [];

          const translatedKeyHealthInequalities: string[] = result.keyHealthInequalities
            ? (result.keyHealthInequalities as []).map(item => {
                return item === 'NONE'
                  ? 'None'
                  : keyHealthInequalitiesItems.find(entry => entry.value === item)?.label ?? item;
              })
            : [];

          const translatedAacInvolvement: string[] = result.involvedAACProgrammes
            ? (result.involvedAACProgrammes as []).map(item => {
                return item === 'No' ? 'None' : item;
              })
            : [];

          const engagingUnits = result.engagingUnits
            ? (
                result.engagingUnits as {
                  unitId: string;
                  name: string;
                  acronym: string;
                }[]
              ).map(unit => unit.acronym)
            : [];

          const innovationData: InnovationCardData = {
            innovationId: result.id,
            innovationName: result.name,
            ownerName: result.owner.name && 'Deleted user',
            countryName: result.countryName,
            postCode: result.postcode,
            categories: translatedCategories,
            careSettings: translatedCareSettings,
            diseasesAndConditions: translatedDiseasesAndConditions,
            keyHealthInequalities: translatedKeyHealthInequalities,
            involvedAACProgrammes: translatedAacInvolvement,
            submittedAt: result.submittedAt,
            engagingUnits: engagingUnits,
            supportStatus: {
              status: result.support.status,
              updatedAt: result.support.updatedAt || ''
            },
            innovationStatus: {
              status: result.groupedStatus,
              updatedAt: result.updatedAt
            }
          };

          this.innovationCardsData.push(innovationData);
        });

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

    this.pageNumber = 1;

    // persist in session storage
    sessionStorage.setItem('innovationListFilters', JSON.stringify(this.form.value));

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
    this.pageNumber = event.pageNumber;
    this.getInnovationsList();
  }

  onSearchClick() {
    this.form.updateValueAndValidity({ onlySelf: true });
  }
}
