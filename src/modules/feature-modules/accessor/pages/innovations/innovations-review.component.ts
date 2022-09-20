import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormControl, FormGroup } from '@app/base/forms';
import { TableModel } from '@app/base/models';
import { NotificationValueType } from '@app/base/types';

import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';

import { AccessorService, getInnovationsListEndpointOutDTO } from '../../services/accessor.service';


type TabType = {
  key: keyof typeof INNOVATION_SUPPORT_STATUS;
  title: string;
  mainDescription: string;
  secondaryDescription?: string;
  numberDescription?: string;
  showAssignedToMeFilter: boolean;
  showSuggestedOnlyFilter: boolean;
  link: string;
  queryParams: { status: keyof typeof INNOVATION_SUPPORT_STATUS; };
  notifications: NotificationValueType;
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
    assignedToMe: new UntypedFormControl(false),
    suggestedOnly: new UntypedFormControl(true)
  }, { updateOn: 'change' });

  innovationsList: TableModel<(getInnovationsListEndpointOutDTO['data'][0])>;

  innovationStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();
    this.setPageTitle('Innovations');

    if (this.stores.authentication.isAccessorRole()) {

      this.defaultStatus = 'ENGAGING';
      this.tabs = [
        {
          key: 'ENGAGING',
          title: 'Engaging',
          mainDescription: 'Innovations being supported, assessed or guided by your organisation.',
          numberDescription: 'innovations in active engagement',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'ENGAGING' },
          notifications: null
        },
        {
          key: 'COMPLETE',
          title: 'Completed',
          mainDescription: 'Your organisation has completed an engagement with these innovations.',
          numberDescription: 'innovations with completed engagements',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'COMPLETE' },
          notifications: null
        }
      ];

    } else if (this.stores.authentication.isQualifyingAccessorRole()) {

      this.defaultStatus = 'UNASSIGNED';
      this.tabs = [
        {
          key: 'UNASSIGNED',
          title: 'Unassigned',
          mainDescription: 'Innovations awaiting status assignment from your organisation.',
          secondaryDescription: 'If your organisation has been suggested to support an innovation, you must assign a status within 30 days of submission.',
          numberDescription: 'unassigned innovations',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: true,
          link: '/accessor/innovations', queryParams: { status: 'UNASSIGNED' },
          notifications: null
        },
        {
          key: 'ENGAGING',
          title: 'Engaging',
          mainDescription: 'Innovations being supported, assessed or guided by your organisation.',
          showAssignedToMeFilter: true,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'ENGAGING' },
          notifications: null
        },
        {
          key: 'FURTHER_INFO_REQUIRED',
          title: 'Further info',
          mainDescription: 'Further information is needed from the innovator to make a decision.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'FURTHER_INFO_REQUIRED' },
          notifications: null
        },
        {
          key: 'WAITING',
          title: 'Waiting',
          mainDescription: 'Waiting for an internal decision to progress.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'WAITING' },
          notifications: null
        },
        {
          key: 'NOT_YET',
          title: 'Not yet',
          mainDescription: 'Innovations not yet ready for your support offer.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'NOT_YET' },
          notifications: null
        },
        {
          key: 'UNSUITABLE',
          title: 'Unsuitable',
          mainDescription: 'Your organisation has no suitable offer for these innovations.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'UNSUITABLE' },
          notifications: null
        },
        {
          key: 'COMPLETE',
          title: 'Completed',
          mainDescription: 'Your organisation has completed an engagement with these innovations.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'COMPLETE' },
          notifications: null
        }
      ];
    }

    this.currentTab = {
      key: 'UNASSIGNED',
      title: '',
      mainDescription: '',
      showAssignedToMeFilter: false,
      showSuggestedOnlyFilter: false,
      link: '',
      queryParams: { status: 'UNASSIGNED' },
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

    this.accessorService.getInnovationsList(this.innovationsList.getAPIQueryParams()).subscribe(
      response => {
        this.innovationsList.setData(response.data, response.count);
        this.currentTab.numberDescription = `${response.count} ${this.currentTab.numberDescription}`;
        this.setPageStatus('READY');
      },
      error => {
        this.setPageStatus('ERROR');
        this.logger.error(error);
      }
    );

  }

  prepareInnovationsList(status: keyof typeof INNOVATION_SUPPORT_STATUS): void {

    switch (status) {

      case 'UNASSIGNED':
        this.innovationsList
          .clearData()
          .setFilters({
            status: this.currentTab.key,
            assignedToMe: false,
            suggestedOnly: this.form.get('suggestedOnly')!.value
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

      case 'ENGAGING':
        this.innovationsList
          .clearData()
          .setFilters({
            status: this.currentTab.key,
            assignedToMe: this.form.get('assignedToMe')!.value,
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

      case 'FURTHER_INFO_REQUIRED':
      case 'WAITING':
      case 'NOT_YET':
      case 'UNSUITABLE':
      case 'COMPLETE':
        this.innovationsList
          .clearData()
          .setFilters({
            status: this.currentTab.key,
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
