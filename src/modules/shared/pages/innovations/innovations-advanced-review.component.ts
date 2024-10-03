import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovationGroupedStatusEnum } from '@modules/stores/innovation/innovation.enums';

import { FiltersModel } from '@modules/core/models/filters/filters.model';

import { InnovationCardData } from './innovation-advanced-search-card.component';
import { getConfig } from './innovations-advanced-review.config';
import { ActivatedRoute } from '@angular/router';
import { IrSchemaTranslatorItemMapType } from '@modules/stores/innovation/innovation-record/innovation-record-schema/innovation-record-schema.models';

type AdvancedReviewSortByKeys =
  | 'support.updatedAt'
  | 'updatedAt'
  | 'submittedAt'
  | 'name'
  | 'countryName'
  | 'statusUpdatedAt'
  | 'relevance';

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
  isAssessmentType: boolean;

  pageSize: number = 20;
  pageNumber: number = 1;
  orderBy: AdvancedReviewSortByKeys = 'relevance';
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

  filtersModel!: FiltersModel;
  form!: FormGroup;

  currentPageTitle: string = '';
  search?: string;

  constructor(
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService,
    private activatedRoute: ActivatedRoute
  ) {
    super();

    this.isAdminType = this.stores.authentication.isAdminRole();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();

    // Force reload if running on server because of SSR and session storage
    if (this.isRunningOnServer()) {
      this.router.navigate([]);
    }

    this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations`;

    this.setPageTitle('Advanced search');

    this.sortByData = {
      'support.updatedAt': { text: 'Last status update', order: 'descending' },
      updatedAt: { text: 'Last updated record', order: 'descending' },
      submittedAt: { text: 'Last submitted innovation', order: 'descending' },
      name: { text: 'Innovation name', order: 'ascending' },
      countryName: { text: 'Location', order: 'ascending' },
      statusUpdatedAt: { text: 'Last status update', order: 'descending' },
      relevance: { text: 'Relevance', order: 'descending' }
    };

    this.sortByComponentInputList = [
      { key: 'relevance', text: this.sortByData.relevance.text },
      { key: 'submittedAt', text: this.sortByData.submittedAt.text },
      { key: 'name', text: this.sortByData.name.text },
      { key: 'countryName', text: this.sortByData.countryName.text }
    ];

    this.orderBy = 'relevance';
    if (this.isAdminType) {
      this.setPageTitle('Innovations');
      this.sortByComponentInputList.splice(1, 0, { key: 'updatedAt', text: this.sortByData.updatedAt.text });
    } else if (this.isAccessorType) {
      this.sortByComponentInputList.splice(1, 0, {
        key: 'support.updatedAt',
        text: this.sortByData['support.updatedAt'].text
      });
    } else if (this.isAssessmentType) {
      this.sortByComponentInputList.splice(1, 0, {
        key: 'statusUpdatedAt',
        text: this.sortByData['statusUpdatedAt'].text
      });
    }
  }

  ngOnInit(): void {
    this.organisationsService.getOrganisationsList({ unitsInformation: false }).subscribe({
      next: response => {
        const { filters, datasets } = getConfig(
          this.stores.context.getIrSchema(),
          this.stores.authentication.state.userContext?.type
        );

        datasets.engagingOrganisations = response.map(o => ({ value: o.id, label: o.name }));

        if (this.isAdminType) {
          datasets.supportStatuses = [];
          datasets.groupedStatuses = Object.keys(InnovationGroupedStatusEnum).map(status => ({
            label: this.translate(`shared.catalog.innovation.grouped_status.${status}.name`),
            value: status
          }));
        } else if (this.isAssessmentType) {
          datasets.supportStatuses = [];
          datasets.groupedStatuses = Object.keys(InnovationGroupedStatusEnum)
            .filter(
              status =>
                status !== InnovationGroupedStatusEnum.RECORD_NOT_SHARED &&
                status !== InnovationGroupedStatusEnum.WITHDRAWN
            )
            .map(status => ({
              label: this.translate(`shared.catalog.innovation.grouped_status.${status}.name`),
              value: status
            }));
        }

        let previousFilters = sessionStorage.getItem('innovationListFilters');
        if (previousFilters) {
          previousFilters = JSON.parse(previousFilters);
        }

        this.filtersModel = new FiltersModel({ filters, datasets, data: previousFilters });
        this.form = this.filtersModel.form;

        this.currentPageTitle = this.pageTitle;

        this.subscriptions.push(
          this.activatedRoute.queryParams.subscribe(params => {
            // To keep the same page title when updating query params.
            this.setPageTitle(this.currentPageTitle);
            this.search = params.search;
            if (this.search && this.search !== this.form.value.search) {
              this.form.get('search')?.setValue(this.search);
            } else if (!this.search) {
              this.onFormChange();
            }
          }),
          this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => {
            this.onFormChange();
          })
        );

        this.onFormChange();
      },
      error: error => {
        this.logger.error(error);
      }
    });
  }

  getInnovationsList(): void {
    this.setPageStatus('LOADING');

    this.paginationParams.order = { [this.orderBy]: ['ascending'].includes(this.orderDir) ? 'ASC' : 'DESC' };
    this.paginationParams.skip = (this.pageNumber - 1) * this.pageSize;

    this.filtersModel.handleStateChanges();

    let queryFields: Parameters<InnovationsService['getInnovationsSearch']>[0] = [
      'id',
      'name',
      'status',
      'statusUpdatedAt',
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
      'support.updatedAt',
      'support.closedReason'
    ];

    if (this.isAdminType) {
      // filter out unavailable fields if Admin
      queryFields = queryFields.filter(
        item => !['support.status', 'support.updatedAt', 'support.closedReason'].includes(item)
      );
    } else if (this.isAccessorType) {
      // filter out unavailable fields for QA/A
      queryFields = queryFields.filter(item => !['involvedAACProgrammes', 'keyHealthInequalities'].includes(item));
    } else if (this.isAssessmentType) {
      // filter out unavailable fields for Assessment
      queryFields = queryFields.filter(
        item =>
          ![
            'support.status',
            'support.updatedAt',
            'support.closedReason',
            'involvedAACProgrammes',
            'keyHealthInequalities'
          ].includes(item)
      );
    }

    this.innovationsService
      .getInnovationsSearch(queryFields, this.filtersModel.getAPIQueryParams(), this.paginationParams)
      .subscribe(response => {
        this.innovationsCount = response.count;
        this.innovationCardsData = [];

        response.data.forEach(result => {
          const translatedAacInvolvement = result.involvedAACProgrammes?.map(item => (item === 'No' ? 'None' : item));
          const engagingUnits = result.engagingUnits ? result.engagingUnits.map(unit => unit.acronym) : [];

          const innovationData: InnovationCardData = {
            id: result.id,
            name: result.name,
            status: result.status,
            statusUpdatedAt: result.statusUpdatedAt,
            groupedStatus: result.groupedStatus,
            updatedAt: result.updatedAt,
            owner: result.owner?.companyName ?? result.owner?.name ?? 'Deleted user',
            countryName: result.countryName ?? null,
            postCode: result.postcode,
            categories: this.translateLists(
              result.categories,
              this.stores.schema.getIrSchemaTranslationsMap().questions.get('categories')?.items,
              result.otherCategoryDescription
            ),
            careSettings: this.translateLists(
              result.careSettings,
              this.stores.schema.getIrSchemaTranslationsMap().questions.get('careSettings')?.items,
              result.otherCareSetting
            ),
            diseasesAndConditions: this.translateLists(
              result.diseasesAndConditions,
              this.stores.schema.getIrSchemaTranslationsMap().questions.get('diseasesConditionsImpact')?.items,
              'None'
            ),
            keyHealthInequalities: this.translateLists(
              result.keyHealthInequalities,
              this.stores.schema.getIrSchemaTranslationsMap().questions.get('keyHealthInequalities')?.items,

              'None'
            ),
            involvedAACProgrammes: translatedAacInvolvement ?? ['Question not answered'],
            submittedAt: result.submittedAt,
            engagingUnits: engagingUnits,
            support: result.support && {
              status: result.support.status,
              updatedAt: result.support.updatedAt,
              closedReason: result.support.closedReason
            },
            highlights: result.highlights
          };

          this.innovationCardsData.push(innovationData);
        });

        this.setPageStatus('READY');
      });
  }

  onFormChange(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
    }

    this.pageNumber = 1;

    // If 'search' has a different value from 'form search field' value, the user typed a new value into 'form search field'.
    const currentSearch = this.form.value.search;
    if (this.search != currentSearch && (this.search !== undefined || (this.search === undefined && currentSearch))) {
      this.updateSearchQueryParams(currentSearch);
    }

    sessionStorage.setItem('innovationListFilters', JSON.stringify(this.form.value));

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

  private translateLists(
    rawArr: null | string[],
    translations: IrSchemaTranslatorItemMapType | undefined,
    other?: null | string
  ): string[] {
    return rawArr?.length
      ? rawArr.map(i => (translations ? this.findTranslation(translations, i, other) : i))
      : ['Question not answered'];
  }

  private findTranslation(translation: IrSchemaTranslatorItemMapType, value: string, other?: null | string): string {
    if (value === 'NONE' || value === 'OTHER') {
      return other ?? value;
    }
    return translation.get(value)?.label ?? value;
  }

  private updateSearchQueryParams(currentSearch: string): void {
    const url = this.router
      .createUrlTree([], {
        relativeTo: this.activatedRoute,
        queryParams: { search: currentSearch },
        queryParamsHandling: 'merge'
      })
      .toString();

    this.location.replaceState(url);

    // To update 'search' query param.
    if (this.isAdminType) {
      this.redirectTo(`${this.baseUrl}`, { search: currentSearch });
    } else {
      this.redirectTo(`${this.baseUrl}/advanced-search`, {
        search: currentSearch
      });
    }
  }
}
