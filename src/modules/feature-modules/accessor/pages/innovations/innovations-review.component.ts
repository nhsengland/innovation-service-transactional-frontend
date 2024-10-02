import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormControl, FormGroup, Validators } from '@app/base/forms';
import { TableModel } from '@app/base/models';
import { DateISOType, NotificationValueType } from '@app/base/types';

import { InnovationsListFiltersType } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { categoriesItems } from '@modules/stores/innovation/innovation-record/202304/forms.config';
import { InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';

type TabType = {
  key: InnovationSupportStatusEnum | 'ALL';
  title: string;
  mainDescription: string;
  secondaryDescription?: string;
  showAssignedToMeFilter: boolean;
  showSuggestedOnlyFilter: boolean;
  showClosedByMyOrganisationFilter: boolean;
  link: string;
  queryParams: { status: InnovationSupportStatusEnum | 'ALL'; assignedToMe?: boolean; suggestedOnly?: boolean };
  queryFields: Parameters<InnovationsService['getInnovationsList']>[0];
  notifications: NotificationValueType;
};

@Component({
  selector: 'app-accessor-pages-innovations-review',
  templateUrl: './innovations-review.component.html'
})
export class InnovationsReviewComponent extends CoreComponent implements OnInit {
  defaultStatus: '' | 'SUGGESTED' | 'ENGAGING' = '';

  userUnitAcronym: string;
  userUnit: string;

  tabs: TabType[] = [];
  currentTab: TabType;

  form = new FormGroup({
    search: new FormControl('', { validators: [Validators.maxLength(200)], updateOn: 'blur' }),
    tabsFilters: new FormGroup(
      {
        assignedToMe: new FormControl(false),
        suggestedOnly: new FormControl(true),
        closedByMyOrganisation: new FormControl(false)
      },
      { updateOn: 'change' }
    )
  });

  innovationsList: TableModel<
    {
      id: string;
      name: string;
      updatedAt: DateISOType | null;
      submittedAt: DateISOType | null;
      mainCategory: string | null;
      countryName: string | null;
      postCode: string | null;
      accessors: string[];
      assessment: {
        id: string;
        finishedAt: DateISOType | null;
      } | null;
      notifications: number;
      engagingOrganisations: string[];
      support: {
        status: InnovationSupportStatusEnum;
        updatedAt: DateISOType | null;
        updatedBy: string | null;
        closedReason?: {
          value: InnovationStatusEnum.ARCHIVED | 'STOPPED_SHARED' | InnovationSupportStatusEnum.CLOSED | null;
          label: string | null;
        };
      } | null;
      suggestion: {
        suggestedBy: string[];
        suggestedOn: DateISOType;
      } | null;
    },
    InnovationsListFiltersType
  >;

  innovationStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();
    this.userUnitAcronym = this.stores.authentication.state.userContext?.organisationUnit?.acronym ?? '';
    this.userUnit = this.stores.authentication.state.userContext?.organisationUnit?.name ?? '';

    this.setPageTitle('Innovations', { hint: `${this.userUnit}` });

    if (this.stores.authentication.isAccessorRole()) {
      this.defaultStatus = 'ENGAGING';
      this.tabs = [
        {
          key: InnovationSupportStatusEnum.ENGAGING,
          title: 'Engaging',
          mainDescription: 'Innovations being supported or assessed by your organisation.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          showClosedByMyOrganisationFilter: false,
          link: '/accessor/innovations',
          queryParams: { status: InnovationSupportStatusEnum.ENGAGING },
          queryFields: [
            'id',
            'name',
            'updatedAt',
            'mainCategory',
            'assessment.id',
            'assessment.finishedAt',
            'support.status',
            'support.updatedAt',
            'statistics.notifications',
            'engagingOrganisations',
            'engagingUnits'
          ],
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.CLOSED,
          title: 'Closed',
          mainDescription: 'All innovations that your organisation has engaged with in the past.',
          secondaryDescription:
            'These have either been closed by your organisation, or the innovator has archived their innovation, or stopped sharing their data with your organisation.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          showClosedByMyOrganisationFilter: true,
          link: '/accessor/innovations',
          queryParams: { status: InnovationSupportStatusEnum.CLOSED },
          queryFields: [
            'id',
            'name',
            'assessment.id',
            'assessment.finishedAt',
            'support.status',
            'support.updatedAt',
            'support.updatedBy',
            'support.closedReason',
            'statistics.notifications',
            'engagingOrganisations'
          ],
          notifications: null
        }
      ];
    } else if (this.stores.authentication.isQualifyingAccessorRole()) {
      this.defaultStatus = 'SUGGESTED';
      this.tabs = [
        {
          key: 'ALL',
          title: 'All',
          mainDescription: 'All innovations shared with your organisation.',
          showAssignedToMeFilter: true,
          showSuggestedOnlyFilter: true,
          showClosedByMyOrganisationFilter: false,
          link: '/accessor/innovations',
          queryParams: { status: 'ALL', suggestedOnly: false, assignedToMe: false },
          queryFields: [
            'id',
            'name',
            'submittedAt',
            'countryName',
            'mainCategory',
            'assessment.id',
            'assessment.finishedAt',
            'support.status',
            'statistics.notifications'
          ],
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.SUGGESTED,
          title: 'Unassigned',
          mainDescription: 'Innovations awaiting status assignment from your organisation.',
          secondaryDescription:
            'If your organisation has been suggested to support an innovation, you must assign a status within 30 days of submission.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: true,
          showClosedByMyOrganisationFilter: false,
          link: '/accessor/innovations',
          queryParams: { status: InnovationSupportStatusEnum.SUGGESTED },
          queryFields: [
            'id',
            'name',
            'submittedAt',
            'countryName',
            'mainCategory',
            'assessment.id',
            'assessment.finishedAt',
            'support.status',
            'statistics.notifications',
            'engagingOrganisations',
            'suggestion.suggestedOn',
            'suggestion.suggestedBy'
          ],
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.ENGAGING,
          title: 'Engaging',
          mainDescription: 'Innovations being supported or assessed by your organisation.',
          showAssignedToMeFilter: true,
          showSuggestedOnlyFilter: false,
          showClosedByMyOrganisationFilter: false,
          link: '/accessor/innovations',
          queryParams: { status: InnovationSupportStatusEnum.ENGAGING },
          queryFields: [
            'id',
            'name',
            'mainCategory',
            'assessment.id',
            'assessment.finishedAt',
            'support.status',
            'support.updatedAt',
            'statistics.notifications',
            'engagingOrganisations',
            'engagingUnits'
          ],
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.WAITING,
          title: 'Waiting',
          mainDescription: 'Waiting for an internal decision to progress.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          showClosedByMyOrganisationFilter: false,
          link: '/accessor/innovations',
          queryParams: { status: InnovationSupportStatusEnum.WAITING },
          queryFields: [
            'id',
            'name',
            'countryName',
            'mainCategory',
            'assessment.id',
            'assessment.finishedAt',
            'support.status',
            'support.updatedAt',
            'statistics.notifications',
            'engagingOrganisations'
          ],
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.UNSUITABLE,
          title: 'Unsuitable',
          mainDescription: 'Your organisation has no suitable offer for these innovations.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          showClosedByMyOrganisationFilter: false,
          link: '/accessor/innovations',
          queryParams: { status: InnovationSupportStatusEnum.UNSUITABLE },
          queryFields: [
            'id',
            'name',
            'countryName',
            'mainCategory',
            'assessment.id',
            'assessment.finishedAt',
            'support.status',
            'support.updatedAt',
            'statistics.notifications',
            'engagingOrganisations'
          ],
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.CLOSED,
          title: 'Closed',
          mainDescription: 'All innovations that your organisation has engaged with in the past.',
          secondaryDescription:
            'These have either been closed by your organisation, or the innovator has archived their innovation, or stopped sharing their data with your organisation.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          showClosedByMyOrganisationFilter: true,
          link: '/accessor/innovations',
          queryParams: { status: InnovationSupportStatusEnum.CLOSED },
          queryFields: [
            'id',
            'name',
            'assessment.id',
            'assessment.finishedAt',
            'support.status',
            'support.updatedAt',
            'support.updatedBy',
            'support.closedReason',
            'statistics.notifications',
            'engagingOrganisations'
          ],
          notifications: null
        }
      ];
    }

    this.currentTab = {
      key: InnovationSupportStatusEnum.SUGGESTED,
      title: '',
      mainDescription: '',
      showAssignedToMeFilter: false,
      showSuggestedOnlyFilter: false,
      showClosedByMyOrganisationFilter: false,
      link: '',
      queryParams: { status: InnovationSupportStatusEnum.SUGGESTED },
      queryFields: [],
      notifications: null
    };

    this.innovationsList = new TableModel({});
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(queryParams => this.onRouteChange(queryParams)),
      this.form.controls.search.valueChanges.subscribe(() => this.onSearchChange()),
      this.form.controls.tabsFilters.valueChanges.subscribe(() => this.onTabsFiltersChange())
    );
  }

  getInnovationsList(column?: string): void {
    this.setPageStatus('LOADING');

    const { take, skip, order, filters } = this.innovationsList.getAPIQueryParams();

    this.innovationsService.getInnovationsList(this.currentTab.queryFields, filters, { take, skip, order }).subscribe({
      next: response => {
        this.innovationsList.setData(
          response.data.map((item, index) => {
            return {
              id: item.id,
              name: item.name,
              updatedAt: item.updatedAt,
              submittedAt: item.submittedAt,
              mainCategory: item.mainCategory
                ? item.mainCategory === 'OTHER'
                  ? 'Other'
                  : categoriesItems.find(entry => entry.value === item.mainCategory)?.label ?? item.mainCategory
                : '',
              countryName: item.countryName,
              postCode: item.postcode,
              assessment: item.assessment,
              notifications: item.statistics?.notifications,
              accessors: (response.data[index].engagingUnits ?? []).flatMap(s =>
                (s.assignedAccessors ?? []).map(u => u.name)
              ),
              engagingOrganisations: item.engagingOrganisations?.map(org => org.acronym) ?? [],
              support: item.support && {
                status: item.support.status,
                updatedAt: item.support.updatedAt,
                updatedBy: item.support.updatedBy,
                closedReason: {
                  value: item.support.closedReason,
                  label:
                    item.support.closedReason === InnovationStatusEnum.ARCHIVED
                      ? 'Archived'
                      : item.support.closedReason === 'STOPPED_SHARED'
                        ? 'Stopped sharing'
                        : item.support.closedReason === InnovationSupportStatusEnum.CLOSED
                          ? 'Closed'
                          : null
                }
              },
              suggestion: item.suggestion && {
                suggestedBy: item.suggestion.suggestedBy,
                suggestedOn: item.suggestion.suggestedOn
              }
            };
          }),
          response.count
        );
        if (this.isRunningOnBrowser() && column) this.innovationsList.setFocusOnSortedColumnHeader(column);
        this.setPageStatus('READY');
      }
    });
  }

  prepareInnovationsList(status: InnovationSupportStatusEnum | 'ALL'): void {
    // Filter out 'ALL' from array, so only status InnovationSupportStatusEnum remain
    const filteredArr: InnovationSupportStatusEnum[] | undefined =
      this.currentTab.queryParams.status !== 'ALL' ? [this.currentTab.queryParams.status] : undefined;

    switch (status) {
      case InnovationSupportStatusEnum.SUGGESTED:
        this.innovationsList
          .clearData()
          .setFilters({
            supportStatuses: filteredArr,
            assignedToMe: false,
            suggestedOnly: this.form.get('tabsFilters')?.get('suggestedOnly')?.value ?? false,
            closedByMyOrganisation: false
          })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            'suggestion.suggestedOn': { label: 'Suggested on', orderable: true },
            'suggestion.suggestedBy': { label: 'Suggested by', orderable: false },
            mainCategory: { label: 'Main category', orderable: true },
            engagingOrganisations: { label: 'Engaging organisations', align: 'right', orderable: false }
          })
          .setOrderBy('submittedAt', 'descending');
        break;

      case InnovationSupportStatusEnum.ENGAGING:
        this.innovationsList
          .clearData()
          .setFilters({
            supportStatuses: filteredArr,
            assignedToMe: this.form.get('tabsFilters')?.get('assignedToMe')?.value ?? false,
            suggestedOnly: false,
            closedByMyOrganisation: false
          })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            'support.updatedAt': { label: 'Support updated', orderable: true },
            mainCategory: { label: 'Main category', orderable: true },
            accessors: { label: 'Accessor', orderable: false },
            engagingOrganisations: { label: 'Engaging organisations', align: 'right', orderable: false }
          })
          .setOrderBy('support.updatedAt', 'descending');
        break;

      case InnovationSupportStatusEnum.WAITING:
      case InnovationSupportStatusEnum.UNSUITABLE:
        this.innovationsList
          .clearData()
          .setFilters({
            supportStatuses: filteredArr,
            assignedToMe: false,
            suggestedOnly: false,
            closedByMyOrganisation: false
          })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            'support.updatedAt': { label: 'Support updated', orderable: true },
            mainCategory: { label: 'Main category', orderable: true },
            countryName: { label: 'Location', orderable: true },
            engagingOrganisations: { label: 'Engaging organisations', align: 'right', orderable: false }
          })
          .setOrderBy('support.updatedAt', 'descending');
        break;

      case InnovationSupportStatusEnum.CLOSED:
        this.innovationsList
          .clearData()
          .setFilters({
            supportStatuses: filteredArr,
            assignedToMe: false,
            suggestedOnly: false,
            closedByMyOrganisation: this.form.get('tabsFilters')?.get('closedByMyOrganisation')?.value ?? false
          })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            'support.updatedAt': { label: 'Closed date', orderable: true },
            'support.updatedBy': { label: 'Closed by', orderable: false },
            'support.closedReason': { label: 'Reason', orderable: true },
            engagingOrganisations: { label: 'Engaging organisations', align: 'right', orderable: false }
          })
          .setOrderBy('support.updatedAt', 'descending');
        break;

      case 'ALL':
        this.innovationsList
          .clearData()
          .setFilters({
            supportStatuses: undefined,
            assignedToMe: this.form.get('tabsFilters')?.get('assignedToMe')?.value ?? false,
            suggestedOnly: this.form.get('tabsFilters')?.get('suggestedOnly')?.value ?? false,
            closedByMyOrganisation: false
          })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            submittedAt: { label: 'Submitted', orderable: true },
            mainCategory: { label: 'Main category', orderable: true },
            countryName: { label: 'Location', orderable: true },
            'support.status': { label: 'Support status', align: 'right', orderable: false }
          })
          .setOrderBy('submittedAt', 'descending');
        break;
    }
  }

  onRouteChange(queryParams: Params): void {
    this.setPageTitle('Innovations', { hint: `${this.userUnit}` });

    const currentStatus = queryParams.status;
    const currentTabIndex = this.tabs.findIndex(tab => tab.key === currentStatus);

    if (!currentStatus || currentTabIndex === -1) {
      this.router.navigate(['/accessor/innovations'], { queryParams: { status: this.defaultStatus } });
      return;
    }

    this.currentTab = this.tabs[currentTabIndex];

    if (queryParams.assignedToMe === 'false' && queryParams.suggestedOnly === 'false') {
      this.form.controls.tabsFilters.reset();
    } else if (queryParams.assignedToMe) {
      this.form.get('tabsFilters')?.get('assignedToMe')?.setValue(true);
    }

    if (this.currentTab.key === InnovationSupportStatusEnum.SUGGESTED) {
      this.form.get('tabsFilters')?.get('suggestedOnly')?.setValue(true);
    }

    this.prepareInnovationsList(this.currentTab.key);
    this.getInnovationsList();
  }

  onTabsFiltersChange(): void {
    this.prepareInnovationsList(this.currentTab.key);
    this.getInnovationsList();
  }

  onSearchChange(): void {
    const searchControl = this.form.controls.search;
    if (!searchControl.valid) {
      searchControl.markAsTouched();
      return;
    }

    this.redirectTo(`/${this.userUrlBasePath()}/innovations/advanced-search`, {
      search: this.form.get('search')?.value
    });
  }

  onTableOrder(column: string): void {
    this.innovationsList.setOrderBy(column);
    this.getInnovationsList(column);
  }

  onPageChange(event: { pageNumber: number }): void {
    this.innovationsList.setPage(event.pageNumber);
    this.getInnovationsList();
  }

  onSearchClick(): void {
    this.form.controls.search.updateValueAndValidity({ onlySelf: true });
  }
}
