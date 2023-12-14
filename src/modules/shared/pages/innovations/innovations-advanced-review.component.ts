import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { locationItems } from '@modules/stores/innovation/config/innovation-catalog.config';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';

import {
  InnovationListSelectType,
  InnovationsListDTO,
  InnovationsListFiltersType,
  InnovationsListInDTO
} from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { InnovationGroupedStatusEnum, InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { DateISOType } from '@app/base/types';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum } from '@app/base/enums';
import { AuthenticationStore } from '@modules/stores';
import { AuthenticationModel } from '@modules/stores/authentication/authentication.models';
import { InnovationCardData } from './innovation-advanced-search-card.component';
import {
  careSettingsItems,
  categoriesItems,
  diseasesConditionsImpactItems,
  keyHealthInequalitiesItems
} from '@modules/stores/innovation/innovation-record/202304/forms.config';

type FilterKeysType = 'locations' | 'engagingOrganisations' | 'supportStatuses' | 'groupedStatuses';

@Component({
  selector: 'shared-pages-innovations-advanced-review',
  templateUrl: './innovations-advanced-review.component.html'
})
export class PageInnovationsAdvancedReviewComponent extends CoreComponent implements OnInit {
  baseUrl: string;

  currentUserContext: AuthenticationModel['userContext'];

  pageSize: number = 20;
  pageNumber: number = 1;
  filtersList: { [filter: string]: string } | {} = {};
  orderBy: InnovationListSelectType | null = null;
  orderDir: 'ascending' | 'descending' = 'ascending';

  innovationCardInfoMockData: InnovationsListInDTO = {
    count: 1738,
    data: [
      {
        id: '80C1E756-515C-EE11-9937-000D3A7F2739',
        name: 'Amazing Innovation',
        ownerName: 'Random Company 1',
        mainCategory: ['MEDICAL_DEVICE', 'EDUCATION', 'MODELS_CARE'],
        careSettings: ['ACUTE_TRUSTS_INPATIENT', 'AMBULANCE', 'WRONG_SETTING'],
        diseasesAndConditions: [
          'MUSCULOSKELETAL_CONDITIONS_OSTEOPOROSIS',
          'RESPIRATORY_CONDITIONS_MESOTHELIOMA',
          'SLEEP_AND_SLEEP_CONDITIONS'
        ],
        description: 'Just a great innovation...',
        status: 'IN_PROGRESS' as InnovationStatusEnum,
        groupedStatus: 'RECEIVING_SUPPORT' as InnovationGroupedStatusEnum,
        statusUpdatedAt: '2023-09-26T14:38:32.392Z',
        submittedAt: '2023-09-26T14:37:19.303Z',
        updatedAt: '2023-12-06T10:46:22.862Z',
        countryName: 'Portugal',
        postCode: null,
        otherMainCategoryDescription: null,
        assessment: {
          id: 'C783A442-7A5C-EE11-9937-000D3A7F2739',
          createdAt: '2023-09-26T14:37:47.886Z',
          assignedTo: {
            name: '[Test] Rob Test'
          },
          finishedAt: '2023-09-26T14:38:32.392Z',
          reassessmentCount: 0
        },

        supports: [
          {
            id: '253C10A4-1061-EE11-B004-000D3AD4EF6F',
            status: InnovationSupportStatusEnum.WAITING,
            updatedAt: '2023-10-10T11:28:28.623Z',
            organisation: {
              id: '7BD3B905-7CB6-EC11-997E-0050F25A43BD',
              name: 'Health Innovation Network',
              acronym: 'HIN',
              unit: {
                id: '982AB20B-7CB6-EC11-997E-0050F25A43BD',
                name: 'Health Innovation East',
                acronym: 'EAST'
              }
            }
          },
          {
            id: '0BEEBA5E-C763-EE11-B006-6045BD0E72ED',
            status: InnovationSupportStatusEnum.CLOSED,
            updatedAt: '2023-11-28T14:26:09.060Z',
            organisation: {
              id: '50413668-5BBA-EC11-997E-0050F25A43BD',
              name: 'Northern Sea fictional group',
              acronym: 'NORTH',
              unit: {
                id: '739BF5B6-5BBA-EC11-997E-0050F25A43BD',
                name: 'Buchan Deep fictional research',
                acronym: 'NORTH02'
              }
            }
          }
        ],
        notifications: 3
      },
      {
        id: '88FBD652-195C-EE11-9937-000D3A7F2739',
        name: 'Refined Fresh Cheese',
        ownerName: 'Bla bla LDA',
        mainCategory: ['DATA_MONITORING', 'TRAVEL_TRANSPORT'],
        careSettings: ['LOCAL_AUTHORITY_EDUCATION', 'PRIMARY_CARE', 'SOCIAL_CARE'],
        diseasesAndConditions: [],
        description:
          'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
        status: 'IN_PROGRESS' as InnovationStatusEnum,
        groupedStatus: 'RECEIVING_SUPPORT' as InnovationGroupedStatusEnum,
        statusUpdatedAt: '2023-09-26T03:06:35.000Z',
        submittedAt: '2023-09-26T03:05:47.146Z',
        updatedAt: '2023-09-26T03:06:35.013Z',
        countryName: 'England',
        postCode: 'BH15 1EG',
        otherMainCategoryDescription: null,
        assessment: {
          id: 'F53A5FA8-195C-EE11-9937-000D3A7F2739',
          createdAt: '2023-09-26T03:06:17.376Z',
          assignedTo: {
            name: '[Test] Rob Test'
          },
          finishedAt: '2023-09-26T03:06:35.000Z',
          reassessmentCount: 0
        },
        supports: [
          {
            id: 'AA423BF0-E25C-EE11-9937-000D3A7F2739',
            status: InnovationSupportStatusEnum.ENGAGING,
            updatedAt: '2023-09-27T03:07:06.796Z',
            organisation: {
              id: '7BD3B905-7CB6-EC11-997E-0050F25A43BD',
              name: 'Health Innovation Network',
              acronym: 'HIN',
              unit: {
                id: '982AB20B-7CB6-EC11-997E-0050F25A43BD',
                name: 'Health Innovation East',
                acronym: 'EAST'
              }
            }
          },
          {
            id: '0BEEBA5E-C763-EE11-B006-6045BD0E72ED',
            status: InnovationSupportStatusEnum.ENGAGING,
            updatedAt: '2023-12-11T11:55:34.486Z',
            organisation: {
              id: '50413668-5BBA-EC11-997E-0050F25A43BD',
              name: 'Northern Sea fictional group',
              acronym: 'NORTH',
              unit: {
                id: '739BF5B6-5BBA-EC11-997E-0050F25A43BD',
                name: 'Buchan Deep fictional research',
                acronym: 'NORTH02'
              }
            }
          }
        ],
        notifications: 0
      },
      {
        id: 'A3B79BC5-4859-EE11-9937-000D3A7F2739',
        name: 'DC Tasks innovation test',
        ownerName: 'Acme INC.',
        mainCategory: ['ESTATES_FACILITIES', 'FOOD_NUTRITION', 'PHARMACEUTICAL'],
        careSettings: [],
        diseasesAndConditions: ['SKIN_CONDITIONS'],
        description: 'This is a innovation to display tasks.',
        status: 'IN_PROGRESS' as InnovationStatusEnum,
        groupedStatus: 'RECEIVING_SUPPORT' as InnovationGroupedStatusEnum,
        statusUpdatedAt: '2023-09-22T13:11:20.832Z',
        submittedAt: '2023-09-22T13:09:58.146Z',
        updatedAt: '2023-11-17T14:42:46.932Z',
        countryName: 'Portugal',
        postCode: null,
        otherMainCategoryDescription: null,
        assessment: {
          id: '31BBDE6D-4959-EE11-9937-000D3A7F2739',
          createdAt: '2023-09-22T13:10:41.590Z',
          assignedTo: {
            name: '[Test] Rob Test'
          },
          finishedAt: '2023-09-22T13:11:20.832Z',
          reassessmentCount: 0
        },
        supports: [
          {
            id: '8C70EE2C-5585-EE11-8925-7C1E520432D9',
            status: 'CLOSED' as InnovationSupportStatusEnum,
            updatedAt: '2023-11-17T14:25:45.010Z',
            organisation: {
              id: '7BD3B905-7CB6-EC11-997E-0050F25A43BD',
              name: 'Health Innovation Network',
              acronym: 'HIN',
              unit: {
                id: '982AB20B-7CB6-EC11-997E-0050F25A43BD',
                name: 'Health Innovation East',
                acronym: 'EAST'
              }
            }
          }
        ],
        notifications: 0
      },
      {
        id: '23CC6CB2-F82D-ED11-AE83-0050F25A312B',
        name: '1.1 not exist in list',
        ownerName: 'Some Company',
        mainCategory: ['ESTATES_FACILITIES', 'FOOD_NUTRITION', 'PHARMACEUTICAL'],
        careSettings: ['END_LIFE_CARE', 'INDUSTRY'],
        diseasesAndConditions: ['SKIN_CONDITIONS'],
        description: 't',
        status: 'IN_PROGRESS' as InnovationStatusEnum,
        groupedStatus: 'AWAITING_SUPPORT' as InnovationGroupedStatusEnum,
        statusUpdatedAt: '2023-11-06T17:46:16.375Z',
        submittedAt: '2023-11-06T17:41:31.753Z',
        updatedAt: '2023-11-06T17:46:16.383Z',
        countryName: 'Armenia',
        postCode: null,
        otherMainCategoryDescription: null,
        assessment: {
          id: '4D6969C8-CB7C-EE11-8925-6045BDFBB2B2',
          createdAt: '2023-11-06T17:41:59.723Z',
          assignedTo: {
            name: '[Test] Rob Test'
          },
          finishedAt: '2023-11-06T17:46:16.375Z',
          reassessmentCount: 0
        },
        notifications: 0
      }
    ]
  };
  innovationCardsData: InnovationCardData[] = [];

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

    // this.innovationsList.setVisibleColumns(columns).setOrderBy(orderBy.key, orderBy.order);
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

    Object.values(this.innovationCardInfoMockData.data).forEach(data =>
      this.innovationCardsData.push(this.parseCardInfo(data))
    );

    const apiQueryParams = {
      order: this.orderBy
        ? { [this.orderBy]: ['none', 'ascending'].includes(this.orderDir) ? 'ASC' : 'DESC' }
        : undefined,
      take: this.pageSize,
      skip: (this.pageNumber - 1) * this.pageSize
    };

    // temporarily added all to test the response
    const apiQueryFields = [
      'id',
      'name',
      'status',
      'groupedStatus',
      'submittedAt',
      'updatedAt',
      // Document fields
      'careSettings',
      'categories',
      'countryName',
      'diseasesAndConditions',
      'involvedAACProgrammes',
      'keyHealthInequalities',
      'mainCategory',
      'otherCategoryDescription',
      // Relation fields
      'ownerId',
      'engagingOrganisations',
      'engagingUnits',
      'suggestedOrganisations',
      'support.status',
      'support.updatedAt'
    ];

    const apiQueryFilters = {
      ...(this.form.get('search')?.value ? { name: this.form.get('search')?.value } : null),
      ...(this.form.get('mainCategories')?.value ? { mainCategories: this.form.get('mainCategories')?.value } : null),
      ...(this.form.get('locations')?.value ? { locations: this.form.get('locations')?.value } : null),
      ...(this.form.get('engagingOrganisations')?.value
        ? { engagingOrganisations: this.form.get('engagingOrganisations')?.value }
        : null),
      ...(this.form.get('supportStatuses')?.value
        ? { supportStatuses: this.form.get('supportStatuses')?.value }
        : null),
      ...(this.form.get('groupedStatuses')?.value
        ? { groupedStatuses: this.form.get('groupedStatuses')?.value }
        : null),
      ...(this.stores.authentication.isAccessorType() && {
        assignedToMe: this.form.get('assignedToMe')?.value ?? null,
        suggestedOnly: this.form.get('suggestedOnly')?.value ?? null
      })
    };

    // this.innovationsService.getInnovationsList2(apiQueryFields, apiQueryFilters, apiQueryParams).subscribe(response => {
    //   response.forEach(innovation => {
    //     const data: InnovationCardData = {
    //       innovationId: innovation.id,
    //       innovationName: innovation.name,
    //       ownerName: innovation.owner.name,
    //       countryName: innovation.countryName,
    //       postCode: innovation.postCode,
    //       categories: innovation.categories,
    //       careSettings: parsedCareSettings,
    //       diseasesAndConditions: parsedDiseasesAndConditions,
    //       healthInequalities: [],
    //       aacInvolvement: ['None'],
    //       submittedAt: supportData.submittedAt,
    //       engagingUnits: engagingUnits,
    //       supportStatus: {
    //         status: currentStatus?.status ?? 'UNASSIGNED',
    //         updatedAt: currentStatus?.updatedAt ?? supportData.submittedAt!
    //       },
    //       innovationStatus: {
    //         status: supportData.groupedStatus ?? '',
    //         updatedAt: supportData.statusUpdatedAt ?? supportData.submittedAt!
    //       }
    //     };

    //     this.innovationCardsData.push(data);
    //   });
    // });

    // this.innovationsService
    //   .getInnovationsList({ queryParams: this.innovationsList.getAPIQueryParams(), fields: ['groupedStatus'] })
    //   .subscribe(response => {
    // this.innovationsList.setData(
    //   response.data.map(innovation => {
    //     let status = null;

    //     if (this.stores.authentication.isAdminRole() === false) {
    //       status =
    //         (innovation.supports || []).find(
    //           s => s.organisation.unit.id === this.stores.authentication.getUserContextInfo()?.organisationUnit?.id
    //         )?.status ?? InnovationSupportStatusEnum.UNASSIGNED;
    //     }

    //     return {
    //       ...innovation,
    //       ...{
    //         supportInfo: {
    //           status
    //         }
    //       },
    //       groupedStatus: innovation.groupedStatus ?? InnovationGroupedStatusEnum.RECORD_NOT_SHARED, // default never happens
    //       engagingOrgs: innovation.supports?.filter(
    //         support => support.status === InnovationSupportStatusEnum.ENGAGING
    //       )
    //     };
    //   }),
    //   response.count
    // );
    // if (this.isRunningOnBrowser() && column) this.innovationsList.setFocusOnSortedColumnHeader(column);
    //       this.setPageStatus('READY');
    //     });
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

    this.filtersList = {
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
    };

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

  parseCardInfo(supportData: InnovationsListInDTO['data'][0]): InnovationCardData {
    const engagingUnits: string[] =
      supportData.supports?.filter(item => item.status === 'ENGAGING').map(item => item.organisation.unit.acronym) ??
      [];

    const parsedMainCategories: string[] = supportData.mainCategory!.map(item => {
      return item !== 'NONE'
        ? categoriesItems.find(entry => entry.value === item)?.label ?? item
        : supportData.otherMainCategoryDescription ?? item;
    });

    const parsedCareSettings: string[] = supportData.careSettings.map(item => {
      return careSettingsItems.find(entry => entry.value === item)?.label ?? item;
    });

    const parsedDiseasesAndConditions: string[] = supportData.diseasesAndConditions.map(item => {
      return diseasesConditionsImpactItems.find(entry => entry.value === item)?.label ?? item;
    });

    const parsedHealthInequalities: string[] = supportData.diseasesAndConditions.map(item => {
      return item === 'NONE' ? 'None' : keyHealthInequalitiesItems.find(entry => entry.value === item)?.label ?? item;
    });

    const parsedAacInvolvement: string[] = supportData.diseasesAndConditions.map(item => {
      return item === 'No' ? 'None' : item;
    });

    const currentStatus:
      | {
          id: string;
          status: InnovationSupportStatusEnum;
          updatedAt: DateISOType;
          organisation: {
            id: string;
            name: string;
            acronym: null | string;
            unit: {
              id: string;
              name: string;
              acronym: string;
              users?: { name: string; role: AccessorOrganisationRoleEnum | InnovatorOrganisationRoleEnum }[];
            };
          };
        }
      | undefined = supportData.supports?.find(
      element => element.organisation.id === this.currentUserContext?.organisation?.id
    );

    return {
      innovationId: supportData.id,
      innovationName: supportData.name,
      ownerName: supportData.ownerName,
      countryName: supportData.countryName ?? '',
      postCode: supportData.postCode ?? '',
      categories: parsedMainCategories,
      careSettings: parsedCareSettings,
      diseasesAndConditions: parsedDiseasesAndConditions,
      healthInequalities: [],
      aacInvolvement: ['None'],
      submittedAt: supportData.submittedAt,
      engagingUnits: engagingUnits,
      supportStatus: {
        status: currentStatus?.status ?? 'UNASSIGNED',
        updatedAt: currentStatus?.updatedAt ?? supportData.submittedAt!
      },
      innovationStatus: {
        status: supportData.groupedStatus ?? '',
        updatedAt: supportData.statusUpdatedAt ?? supportData.submittedAt!
      }
    };
  }

  onSearchClick() {
    this.form.updateValueAndValidity({ onlySelf: true });
  }
}
