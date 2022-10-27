import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormControl, FormGroup } from '@app/base/forms';
import { TableModel } from '@app/base/models';
import { DateISOType, NotificationValueType } from '@app/base/types';

import { InnovationsListFiltersType, InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationsListDTO } from '@modules/shared/services/innovations.dtos';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';


type TabType = {
  key: InnovationSupportStatusEnum,
  title: string,
  mainDescription: string,
  secondaryDescription?: string,
  numberDescription?: string,
  showAssignedToMeFilter: boolean,
  showSuggestedOnlyFilter: boolean,
  link: string,
  queryParams: { status: InnovationSupportStatusEnum },
  notifications: NotificationValueType,
};


@Component({
  selector: 'app-accessor-pages-innovations-review',
  templateUrl: './innovations-review.component.html'
})
export class InnovationsReviewComponent extends CoreComponent implements OnInit {

  defaultStatus: '' | 'UNASSIGNED' | 'ENGAGING' = '';

  tabs: TabType[] = [];
  currentTab: TabType;

  form = new FormGroup({
    assignedToMe: new FormControl(false),
    suggestedOnly: new FormControl(true)
  }, { updateOn: 'change' });

  innovationsList: TableModel<
    InnovationsListDTO['data'][0] & { supportInfo: { accessorsNames: string[], supportingOrganisations: string[], updatedAt: null | DateISOType } },
    InnovationsListFiltersType
  >;

  innovationStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Innovations');

    if (this.stores.authentication.isAccessorRole()) {

      this.defaultStatus = 'ENGAGING';
      this.tabs = [
        {
          key: InnovationSupportStatusEnum.ENGAGING,
          title: 'Engaging',
          mainDescription: 'Innovations being supported, assessed or guided by your organisation.',
          numberDescription: 'innovations in active engagement',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: InnovationSupportStatusEnum.ENGAGING },
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.COMPLETE,
          title: 'Completed',
          mainDescription: 'Your organisation has completed an engagement with these innovations.',
          numberDescription: 'innovations with completed engagements',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: InnovationSupportStatusEnum.COMPLETE },
          notifications: null
        }
      ];

    } else if (this.stores.authentication.isQualifyingAccessorRole()) {

      this.defaultStatus = 'UNASSIGNED';
      this.tabs = [
        {
          key: InnovationSupportStatusEnum.UNASSIGNED,
          title: 'Unassigned',
          mainDescription: 'Innovations awaiting status assignment from your organisation.',
          secondaryDescription: 'If your organisation has been suggested to support an innovation, you must assign a status within 30 days of submission.',
          numberDescription: 'unassigned innovations',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: true,
          link: '/accessor/innovations', queryParams: { status: InnovationSupportStatusEnum.UNASSIGNED },
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.ENGAGING,
          title: 'Engaging',
          mainDescription: 'Innovations being supported, assessed or guided by your organisation.',
          showAssignedToMeFilter: true,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: InnovationSupportStatusEnum.ENGAGING },
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED,
          title: 'Further info',
          mainDescription: 'Further information is needed from the innovator to make a decision.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED },
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.WAITING,
          title: 'Waiting',
          mainDescription: 'Waiting for an internal decision to progress.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: InnovationSupportStatusEnum.WAITING },
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.NOT_YET,
          title: 'Not yet',
          mainDescription: 'Innovations not yet ready for your support offer.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: InnovationSupportStatusEnum.NOT_YET },
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.UNSUITABLE,
          title: 'Unsuitable',
          mainDescription: 'Your organisation has no suitable offer for these innovations.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: InnovationSupportStatusEnum.UNSUITABLE },
          notifications: null
        },
        {
          key: InnovationSupportStatusEnum.COMPLETE,
          title: 'Completed',
          mainDescription: 'Your organisation has completed an engagement with these innovations.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: InnovationSupportStatusEnum.COMPLETE },
          notifications: null
        }
      ];
    }

    this.currentTab = {
      key: InnovationSupportStatusEnum.UNASSIGNED,
      title: '',
      mainDescription: '',
      showAssignedToMeFilter: false,
      showSuggestedOnlyFilter: false,
      link: '',
      queryParams: { status: InnovationSupportStatusEnum.UNASSIGNED },
      notifications: null
    };

    this.innovationsList = new TableModel({});

  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(queryParams => this.onRouteChange(queryParams)),
      this.form.valueChanges.subscribe(() => this.onFormChange())
    );

  }

  getInnovationsList(): void {

    this.setPageStatus('LOADING');

    this.innovationsService.getInnovationsList(this.innovationsList.getAPIQueryParams()).subscribe(response => {
      this.innovationsList.setData(
        response.data.map(item => {

          const supportingOrganisations = (item.supports ?? [])
            .filter(s => s.status === InnovationSupportStatusEnum.ENGAGING)
            .map(s => s.organisation.acronym || '');

          return {
            ...item,
            supportInfo: {
              accessorsNames: (item.supports ?? []).flatMap(s => (s.organisation.unit.users ?? []).map(u => u.name)),
              supportingOrganisations: [...new Set(supportingOrganisations)], // Remove duplicates.
              updatedAt: item.supports && item.supports.length > 0 ? item.supports[0].updatedAt : null
            }
          };

        }),
        response.count);
      this.currentTab.numberDescription = `${response.count} ${this.currentTab.numberDescription}`;
      this.setPageStatus('READY');
    });

  }

  prepareInnovationsList(status: InnovationSupportStatusEnum): void {

    switch (status) {

      case InnovationSupportStatusEnum.UNASSIGNED:
        this.innovationsList
          .clearData()
          .setFilters({
            supportStatuses: [this.currentTab.key],
            assignedToMe: false,
            suggestedOnly: this.form.get('suggestedOnly')?.value ?? false
          })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            submittedAt: { label: 'Submitted', orderable: true },
            mainCategory: { label: 'Main category', orderable: true },
            countryName: { label: 'Location', orderable: true },
            engagingOrganisations: { label: 'Engaging organisations', align: 'right', orderable: false }
          })
          .setOrderBy('submittedAt', 'descending');
        break;

      case InnovationSupportStatusEnum.ENGAGING:
        this.innovationsList
          .clearData()
          .setFilters({
            supportStatuses: [this.currentTab.key],
            assignedToMe: this.form.get('assignedToMe')?.value ?? false,
            suggestedOnly: false
          })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            updatedAt: { label: 'Updated', orderable: true },
            mainCategory: { label: 'Main category', orderable: true },
            accessors: { label: 'Accessor', orderable: false },
            engagingOrganisations: { label: 'Engaging organisations', align: 'right', orderable: false }
          })
          .setOrderBy('updatedAt', 'descending');
        break;

      case InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED:
      case InnovationSupportStatusEnum.WAITING:
      case InnovationSupportStatusEnum.NOT_YET:
      case InnovationSupportStatusEnum.UNSUITABLE:
      case InnovationSupportStatusEnum.COMPLETE:
        this.innovationsList
          .clearData()
          .setFilters({
            supportStatuses: [this.currentTab.key],
            assignedToMe: false,
            suggestedOnly: false
          })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            updatedAt: { label: 'Updated', orderable: true },
            mainCategory: { label: 'Main category', orderable: true },
            countryName: { label: 'Location', orderable: true },
            engagingOrganisations: { label: 'Engaging organisations', align: 'right', orderable: false }
          })
          .setOrderBy('updatedAt', 'descending');
        break;

    }

  }

  onRouteChange(queryParams: Params): void {

    this.setPageTitle('Innovations');

    const currentStatus = queryParams.status;
    const currentTabIndex = this.tabs.findIndex(tab => tab.queryParams.status === currentStatus) || 0;

    if (!currentStatus || currentTabIndex === -1) {
      this.router.navigate(['/accessor/innovations'], { queryParams: { status: this.defaultStatus } });
      return;
    }

    this.currentTab = this.tabs[currentTabIndex];

    this.prepareInnovationsList(this.currentTab.key);
    this.getInnovationsList();

  }

  onFormChange(): void {

    this.prepareInnovationsList(this.currentTab.key);
    this.getInnovationsList();

  }

  onTableOrder(column: string): void {

    this.innovationsList.setOrderBy(column);
    this.getInnovationsList();

  }

  onPageChange(event: { pageNumber: number }): void {

    this.innovationsList.setPage(event.pageNumber);
    this.getInnovationsList();

  }

}
