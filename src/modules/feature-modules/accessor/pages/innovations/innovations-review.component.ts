import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { TableModel } from '@app/base/models';
import { NotificationService } from '@modules/shared/services/notification.service';

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
  notifications?: number;
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
  });

  innovationsList: TableModel<(getInnovationsListEndpointOutDTO['data'][0])>;

  innovationStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService,
    private notificationService: NotificationService,
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
          link: '/accessor/innovations', queryParams: { status: 'ENGAGING' }
        },
        {
          key: 'COMPLETE',
          title: 'Completed',
          mainDescription: 'Your organisation has completed an engagement with these innovations.',
          numberDescription: 'innovations with completed engagements',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'COMPLETE' }
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
          link: '/accessor/innovations', queryParams: { status: 'UNASSIGNED' }
        },
        {
          key: 'ENGAGING',
          title: 'Engaging',
          mainDescription: 'Innovations being supported, assessed or guided by your organisation.',
          showAssignedToMeFilter: true,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'ENGAGING' }
        },
        {
          key: 'FURTHER_INFO_REQUIRED',
          title: 'Further info',
          mainDescription: 'Further information is needed from the innovator to make a decision.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'FURTHER_INFO_REQUIRED' }
        },
        {
          key: 'WAITING',
          title: 'Waiting',
          mainDescription: 'Waiting for an internal decision to progress.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'WAITING' }
        },
        {
          key: 'NOT_YET',
          title: 'Not yet',
          mainDescription: 'Innovations not yet ready for your support offer.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'NOT_YET' }
        },
        {
          key: 'UNSUITABLE',
          title: 'Unsuitable',
          mainDescription: 'Your organisation has no suitable offer for these innovations.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'UNSUITABLE' }
        },
        {
          key: 'COMPLETE',
          title: 'Completed',
          mainDescription: 'Your organisation has completed an engagement with these innovations.',
          showAssignedToMeFilter: false,
          showSuggestedOnlyFilter: false,
          link: '/accessor/innovations', queryParams: { status: 'COMPLETE' }
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
      queryParams: { status: 'UNASSIGNED' }
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

  getNotificationsGroupedByStatus(): void {
    this.notificationService.getAllUnreadNotificationsGroupedByStatus('SUPPORT_STATUS').subscribe(
      response => {
        for (const t of this.tabs) {
          t.notifications = response[t.key] || 0;
        }
      }
    );
  }

  onRouteChange(queryParams: Params): void {

    const currentStatus = queryParams.status;
    const currentTabIndex = this.tabs.findIndex(tab => tab.queryParams.status === currentStatus) || 0;

    if (!currentStatus || currentTabIndex === -1) {
      this.router.navigate(['/accessor/innovations'], { queryParams: { status: this.defaultStatus } });
      return;
    }

    this.currentTab = this.tabs[currentTabIndex];

    this.innovationsList.setData([]).setFilters({ status: this.currentTab.key, ...this.form.value });

    this.innovationsList.page = 1;

    switch (currentStatus) {

      case 'UNASSIGNED':
        this.innovationsList.setVisibleColumns({
          name: { label: 'Innovation', orderable: true },
          submittedAt: { label: 'Submitted', orderable: true },
          mainCategory: { label: 'Main category', orderable: true },
          countryName: { label: 'Location', orderable: true },
          engagingOrganisations: { label: 'Engaging organisations', align: 'right', orderable: false }
        }).setOrderBy('submittedAt', 'descending');
        break;

      case 'ENGAGING':
        this.innovationsList.setVisibleColumns({
          name: { label: 'Innovation', orderable: true },
          updatedAt: { label: 'Updated', orderable: true },
          mainCategory: { label: 'Main category', orderable: true },
          accessors: { label: 'Accessor', orderable: false },
          engagingOrganisations: { label: 'Engaging organisations', align: 'right', orderable: false }
        }).setOrderBy('updatedAt', 'descending');
        break;

      case 'FURTHER_INFO_REQUIRED':
      case 'WAITING':
      case 'NOT_YET':
      case 'UNSUITABLE':
      case 'COMPLETE':
        this.innovationsList.setVisibleColumns({
          name: { label: 'Innovation', orderable: true },
          updatedAt: { label: 'Updated', orderable: true },
          mainCategory: { label: 'Main category', orderable: true },
          countryName: { label: 'Location', orderable: true },
          engagingOrganisations: { label: 'Engaging organisations', align: 'right', orderable: false }
        }).setOrderBy('updatedAt', 'descending');
        break;

    }

    this.getInnovationsList();
    this.getNotificationsGroupedByStatus();

  }

  onFormChange(): void {

    this.innovationsList.setFilters({ status: this.currentTab.key, ...this.form.value });
    this.getInnovationsList();

  }

  onTableOrder(column: string): void {

    this.innovationsList.setOrderBy(column);
    this.getInnovationsList();
  }

  onPageChange(event: { pageNumber: number }): void {
    this.innovationsList.page = event.pageNumber;
    this.getInnovationsList();
  }

}
