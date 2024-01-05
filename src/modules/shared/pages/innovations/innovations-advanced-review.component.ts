import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, isEmpty } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { locationItems } from '@modules/stores/innovation/config/innovation-catalog.config';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovationGroupedStatusEnum } from '@modules/stores/innovation/innovation.enums';

import { InnovationCardData } from './innovation-advanced-search-card.component';
import {
  careSettingsItems,
  categoriesItems,
  diseasesConditionsImpactItems,
  keyHealthInequalitiesItems
} from '@modules/stores/innovation/innovation-record/202304/forms.config';
import { catalogOfficeLocation } from '@modules/stores/innovation/innovation-record/202304/catalog.types';
import { UtilsHelper } from '@app/base/helpers';

type FilterKeysType = 'locations' | 'engagingOrganisations' | 'supportStatuses' | 'groupedStatuses';

type AdvancedReviewSortByKeys = 'support.updatedAt' | 'updatedAt' | 'submittedAt' | 'name' | 'countryName';

type AdvancedReviewSortByKeysType = {
  [key in AdvancedReviewSortByKeys]: {
    text: string;
    order: 'ascending' | 'descending';
  };
};

@Component({
  selector: 'shared-pages-innovations-advanced-review',
  templateUrl: './innovations-advanced-review.component.html'
})
export class PageInnovationsAdvancedReviewComponent extends CoreComponent implements OnInit {
  baseUrl: string;

  isAdminType: boolean;
  isAccessorType: boolean;

  pageSize: number = 20;
  pageNumber: number = 1;
  orderBy: AdvancedReviewSortByKeys = 'updatedAt';
  orderDir: 'ascending' | 'descending' = 'descending';

  paginationParams: {
    take: number;
    skip: number;
    order: { [Property in AdvancedReviewSortByKeys]?: 'ASC' | 'DESC' };
  } = {
    take: this.pageSize,
    skip: (this.pageNumber - 1) * this.pageSize,
    order: { [this.orderBy]: this.orderDir }
  };

  filtersList: { [filter: string]: string } | {} = {};

  innovationCardsData: InnovationCardData[] = [];
  innovationsCount: number = 0;

  sortByData: AdvancedReviewSortByKeysType;
  sortByComponentInputList: { key: AdvancedReviewSortByKeys; text: string }[] = [];

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

  selectedFilters: {
    key: FilterKeysType;
    title: string;
    showHideStatus: 'opened' | 'closed';
    selected: { label: string; value: string }[];
    scrollable?: boolean;
    active: boolean;
  }[] = [];

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

    if (this.isAdminType) {
      this.setPageTitle('Innovations');
    }

    this.sortByData = {
      'support.updatedAt': {
        text: 'Last status update',
        order: 'descending'
      },
      updatedAt: {
        text: 'Last updated record',
        order: 'descending'
      },
      submittedAt: {
        text: 'Last submitted innovation',
        order: 'descending'
      },
      name: {
        text: 'Innovation name',
        order: 'ascending'
      },
      countryName: {
        text: 'Location',
        order: 'ascending'
      }
    };

    this.sortByComponentInputList = [
      { key: 'submittedAt', text: this.sortByData.submittedAt.text },
      { key: 'name', text: this.sortByData.name.text },
      { key: 'countryName', text: this.sortByData.countryName.text }
    ];

    if (this.isAdminType) {
      this.orderBy = 'updatedAt';
      this.sortByComponentInputList.splice(0, 0, { key: 'updatedAt', text: this.sortByData.updatedAt.text });
    }

    if (this.isAccessorType) {
      this.orderBy = 'support.updatedAt';
      this.sortByComponentInputList.splice(0, 0, {
        key: 'support.updatedAt',
        text: this.sortByData['support.updatedAt'].text
      });
    }
  }

  ngOnInit(): void {
    let filters: FilterKeysType[] = ['engagingOrganisations', 'locations', 'supportStatuses'];

    if (this.isAdminType) {
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
        if (this.isAdminType) {
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

  getInnovationsList(): void {
    this.setPageStatus('LOADING');

    this.selectedFilters = this.filters.filter(filter => filter.selected.length > 0);

    this.paginationParams.order = { [this.orderBy]: ['ascending'].includes(this.orderDir) ? 'ASC' : 'DESC' };
    this.paginationParams.skip = (this.pageNumber - 1) * this.pageSize;

    const apiQueryFilters = Object.fromEntries(
      Object.entries(this.form.value).filter(([_k, v]) => !UtilsHelper.isEmpty(v))
    );

    let queryFields: Parameters<InnovationsService['getInnovationsList2']>[0] = [
      'id',
      'name',
      'status',
      'groupedStatus',
      'submittedAt',
      'updatedAt',
      'careSettings',
      'otherCareSetting',
      'categories',
      'countryName',
      'diseasesAndConditions',
      'involvedAACProgrammes',
      'keyHealthInequalities',
      'mainCategory',
      'otherCategoryDescription',
      'postcode',
      'owner.name',
      'owner.companyName',
      'engagingUnits',
      'support.status',
      'support.updatedAt'
    ];

    if (this.isAdminType) {
      // filter out unavailable fields if Admin
      queryFields = queryFields.filter(item => !['support.status', 'support.updatedAt'].includes(item));
    }
    if (this.isAccessorType) {
      // filter out unavailable fields for QA/A
      queryFields = queryFields.filter(item => !['involvedAACProgrammes', 'keyHealthInequalities'].includes(item));
    }

    this.innovationsService
      .getInnovationsList2(queryFields, apiQueryFilters, this.paginationParams)
      .subscribe(response => {
        this.innovationsCount = response.count;
        this.innovationCardsData = [];

        response.data.forEach(result => {
          const translatedCategories: string[] = result.categories
            ? result.categories.map(item => {
                return item !== 'OTHER'
                  ? categoriesItems.find(entry => entry.value === item)?.label ?? item
                  : result.otherCategoryDescription ?? item;
              })
            : ['Question not answered'];

          const translatedCareSettings: string[] = result.careSettings
            ? result.careSettings.map(item => {
                return item !== 'OTHER'
                  ? careSettingsItems.find(entry => entry.value === item)?.label ?? item
                  : result.otherCareSetting ?? item;
              })
            : ['Question not answered'];

          const translatedDiseasesAndConditions: string[] = result.diseasesAndConditions
            ? result.diseasesAndConditions.map(item => {
                return diseasesConditionsImpactItems.find(entry => entry.value === item)?.label ?? item;
              })
            : ['Question not answered'];

          const translatedKeyHealthInequalities: string[] = result.keyHealthInequalities
            ? result.keyHealthInequalities.map(item => {
                return item === 'NONE'
                  ? 'None'
                  : keyHealthInequalitiesItems.find(entry => entry.value === item)?.label ?? item;
              })
            : ['Question not answered'];

          const translatedAacInvolvement: string[] = result.involvedAACProgrammes
            ? result.involvedAACProgrammes.map(item => {
                return item === 'No' ? 'None' : item;
              })
            : ['Question not answered'];

          const engagingUnits = result.engagingUnits ? result.engagingUnits.map(unit => unit.acronym) : [];

          const innovationData: InnovationCardData = {
            id: result.id,
            name: result.name,
            owner: result.owner?.companyName ?? result.owner?.name ?? 'Deleted user',
            countryName: result.countryName ?? null,
            postCode: result.postcode,
            categories: translatedCategories,
            careSettings: translatedCareSettings,
            diseasesAndConditions: translatedDiseasesAndConditions,
            keyHealthInequalities: translatedKeyHealthInequalities,
            involvedAACProgrammes: translatedAacInvolvement,
            submittedAt: result.submittedAt,
            engagingUnits: engagingUnits,
            supportStatus: {
              status: result.support ? result.support.status : '',
              updatedAt: result.support ? result.support.updatedAt! : ''
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

  onSortByChange(selectKey: string): void {
    this.orderBy = selectKey as AdvancedReviewSortByKeys;
    this.orderDir = this.sortByData[selectKey as AdvancedReviewSortByKeys].order;
    this.pageNumber = 1;
    this.getInnovationsList();
  }
}
