import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { locationItems } from '@modules/stores/innovation/config/innovation-catalog.config';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovationGroupedStatusEnum } from '@modules/stores/innovation/innovation.enums';

import { DatesHelper, UtilsHelper } from '@app/base/helpers';
import { Filter, FiltersModel } from '@modules/core/models/filters/filters.model';
import {
  careSettingsItems,
  categoriesItems,
  diseasesConditionsImpactItems,
  keyHealthInequalitiesItems
} from '@modules/stores/innovation/innovation-record/202304/forms.config';
import { InnovationCardData } from './innovation-advanced-search-card.component';
import { getConfig } from './innovations-advanced-review.config';

type FilterKeysType =
  | 'locations'
  | 'engagingOrganisations'
  | 'supportStatuses'
  | 'groupedStatuses'
  | 'diseasesAndConditions';

type AdvancedReviewSortByKeys = 'support.updatedAt' | 'updatedAt' | 'submittedAt' | 'name' | 'countryName';

type AdvancedReviewSortByKeysType = {
  [key in AdvancedReviewSortByKeys]: {
    text: string;
    order: 'ascending' | 'descending';
  };
};

/**
 * TODO:
 * Add search handler
 */
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

  form = new FormGroup({ search: new FormControl('', { updateOn: 'blur' }) }, { updateOn: 'change' });

  anyFilterSelected = false;

  datasets: {
    [key in FilterKeysType]: { label: string; value: string }[];
  } = {
    locations: locationItems.filter(i => i.label !== 'SEPARATOR').map(i => ({ label: i.label, value: i.value })),
    engagingOrganisations: [],
    supportStatuses: [],
    groupedStatuses: [],
    diseasesAndConditions: diseasesConditionsImpactItems
  };

  filtersModel!: FiltersModel;
  formTest!: FormGroup;

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

    this.baseUrl = this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/`;

    this.setPageTitle('Advanced search');

    this.sortByData = {
      'support.updatedAt': { text: 'Last status update', order: 'descending' },
      updatedAt: { text: 'Last updated record', order: 'descending' },
      submittedAt: { text: 'Last submitted innovation', order: 'descending' },
      name: { text: 'Innovation name', order: 'ascending' },
      countryName: { text: 'Location', order: 'ascending' }
    };

    this.sortByComponentInputList = [
      { key: 'submittedAt', text: this.sortByData.submittedAt.text },
      { key: 'name', text: this.sortByData.name.text },
      { key: 'countryName', text: this.sortByData.countryName.text }
    ];

    if (this.isAdminType) {
      this.setPageTitle('Innovations');

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
    this.organisationsService.getOrganisationsList({ unitsInformation: false }).subscribe({
      next: response => {
        const { filters, datasets } = getConfig(this.stores.authentication.state.userContext?.type);

        if (this.isAdminType) {
          datasets.engagingOrganisations = response.map(o => ({ value: o.id, label: o.name }));
          datasets.supportStatuses = [];
          datasets.groupedStatuses = Object.keys(InnovationGroupedStatusEnum).map(status => ({
            label: this.translate(`shared.catalog.innovation.grouped_status.${status}.name`),
            value: status
          }));
        } else {
          const orgId = this.stores.authentication.getUserInfo().organisations[0].id;
          datasets.engagingOrganisations = response
            .filter(o => o.id !== orgId)
            .map(o => ({ value: o.id, label: o.name }));
        }

        let previousFilters = sessionStorage.getItem('innovationListFilters');
        if (previousFilters) {
          previousFilters = JSON.parse(previousFilters);
        }

        this.filtersModel = new FiltersModel({ filters, datasets, data: previousFilters });
        this.formTest = this.filtersModel.form;

        this.subscriptions.push(
          this.formTest.valueChanges.pipe(debounceTime(1000)).subscribe(() => this.onFormChange())
        );

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

    this.paginationParams.order = { [this.orderBy]: ['ascending'].includes(this.orderDir) ? 'ASC' : 'DESC' };
    this.paginationParams.skip = (this.pageNumber - 1) * this.pageSize;

    const { filters } = this.filtersModel.getCurrentStateFilters();
    const apiQueryFilters = Object.fromEntries(Object.entries(filters).filter(([_k, v]) => !UtilsHelper.isEmpty(v)));

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
          const translatedAacInvolvement = result.involvedAACProgrammes?.map(item => (item === 'No' ? 'None' : item));
          const engagingUnits = result.engagingUnits ? result.engagingUnits.map(unit => unit.acronym) : [];

          const innovationData: InnovationCardData = {
            id: result.id,
            name: result.name,
            owner: result.owner?.companyName ?? result.owner?.name ?? 'Deleted user',
            countryName: result.countryName ?? null,
            postCode: result.postcode,
            categories: this.translateLists(result.categories, categoriesItems, result.otherCategoryDescription),
            careSettings: this.translateLists(result.careSettings, careSettingsItems, result.otherCareSetting),
            diseasesAndConditions: this.translateLists(result.diseasesAndConditions, diseasesConditionsImpactItems),
            keyHealthInequalities: this.translateLists(
              result.keyHealthInequalities,
              keyHealthInequalitiesItems,
              'None'
            ),
            involvedAACProgrammes: translatedAacInvolvement ?? ['Question not answered'],
            submittedAt: result.submittedAt,
            engagingUnits: engagingUnits,
            supportStatus: {
              status: result.support ? result.support.status : '',
              updatedAt: result.support ? result.support.updatedAt! : ''
            },
            innovationStatus: { status: result.groupedStatus, updatedAt: result.updatedAt }
          };

          this.innovationCardsData.push(innovationData);
        });

        this.setPageStatus('READY');
      });
  }

  onFormChange(): void {
    this.setPageStatus('LOADING');

    const state = this.filtersModel.getCurrentStateFilters();
    this.anyFilterSelected = state.selected > 0;
    this.pageNumber = 1;

    // persist in session storage
    sessionStorage.setItem('innovationListFilters', JSON.stringify(this.formTest.value));

    this.getInnovationsList();
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

  onRemoveFilter(filterKey: string, selection: string): void {
    this.filtersModel.removeSelection(filterKey, selection);
  }

  getDaterangeFilterTitle(filter: Filter): string {
    if (filter.type !== 'DATE_RANGE') return '';

    const date = this.filtersModel.getFilterValue(filter);
    return DatesHelper.translateTwoDatesOrder(date.startDate, date.endDate);
  }

  onCheckboxInputFilter(filter: Filter, e: Event): void {
    const search = (e.target as HTMLInputElement).value;
    this.filtersModel.updateDataset(filter, search);
  }

  private translateLists(rawArr: null | string[], translations: any[], other?: null | string): string[] {
    return rawArr?.map(i => this.findTranslation(translations, i, other)) ?? ['Question not answered'];
  }

  private findTranslation(array: any[], value: string, other?: null | string): string {
    if (value === 'NONE' || value === 'OTHER') {
      return other ?? value;
    }
    return array.find(c => c.value === value)?.label ?? value;
  }
}
