import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { TableModel } from '@app/base/models';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';

import { AccessorService, getInnovationsListEndpointOutDTO } from '../../services/accessor.service';


type TabType = {
  key: keyof typeof INNOVATION_SUPPORT_STATUS;
  title: string;
  mainDescription: string;
  secondaryDescription?: string;
  numberDescription?: string;
  showAssignedToMe: boolean;
  link: string;
  queryParams: { status: keyof typeof INNOVATION_SUPPORT_STATUS; };
};


@Component({
  selector: 'app-accessor-pages-review-innovations',
  templateUrl: './review-innovations.component.html'
})
export class ReviewInnovationsComponent extends CoreComponent implements OnInit {

  defaultStatus: '' | 'UNASSIGNED' | 'ENGAGING' = '';

  tabs: TabType[] = [];
  currentTab: TabType;

  form = new FormGroup({
    assignedToMe: new FormControl(false)
  });

  innovationsList: TableModel<(getInnovationsListEndpointOutDTO['data'][0])>;

  innovationStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();

    if (this.stores.authentication.isAccessorRole()) {

      this.defaultStatus = 'ENGAGING';
      this.tabs = [
        {
          key: 'ENGAGING',
          title: 'Engaging',
          mainDescription: 'Innovations being supported, assessed or guided by your organisation.',
          numberDescription: 'innovations in active engagement',
          showAssignedToMe: false,
          link: '/accessor/innovations', queryParams: { status: 'ENGAGING' }
        },
        {
          key: 'COMPLETE',
          title: 'Completed',
          mainDescription: 'Your organisation has completed an engagement with these innovations.',
          numberDescription: 'innovations with completed engagements',
          showAssignedToMe: false,
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
          secondaryDescription: 'You must assign a status within 30 days of submission',
          numberDescription: 'unassigned innovations',
          showAssignedToMe: false,
          link: '/accessor/innovations', queryParams: { status: 'UNASSIGNED' }
        },
        {
          key: 'ENGAGING',
          title: 'Engaging',
          mainDescription: 'Innovations being supported, assessed or guided by your organisation.',
          showAssignedToMe: true,
          link: '/accessor/innovations', queryParams: { status: 'ENGAGING' }
        },
        {
          key: 'FURTHER_INFO_REQUIRED',
          title: 'Further info',
          mainDescription: 'Further information is needed from the innovator to make a decision.',
          showAssignedToMe: false,
          link: '/accessor/innovations', queryParams: { status: 'FURTHER_INFO_REQUIRED' }
        },
        {
          key: 'WAITING',
          title: 'Waiting',
          mainDescription: 'Waiting for an internal decision to progress.',
          showAssignedToMe: false,
          link: '/accessor/innovations', queryParams: { status: 'WAITING' }
        },
        {
          key: 'NOT_YET',
          title: 'Not yet',
          mainDescription: 'Innovations not yet ready for your support offer.',
          showAssignedToMe: false,
          link: '/accessor/innovations', queryParams: { status: 'NOT_YET' }
        },
        {
          key: 'UNSUITABLE',
          title: 'Unsuitable',
          mainDescription: 'Your organisation has no suitable offer for these innovations.',
          showAssignedToMe: false,
          link: '/accessor/innovations', queryParams: { status: 'UNSUITABLE' }
        },
        {
          key: 'COMPLETE',
          title: 'Completed',
          mainDescription: 'Your organisation has completed an engagement with these innovations.',
          showAssignedToMe: false,
          link: '/accessor/innovations', queryParams: { status: 'COMPLETE' }
        }
      ];
    }

    this.currentTab = {
      key: 'UNASSIGNED',
      title: '',
      mainDescription: '',
      showAssignedToMe: false,
      link: '',
      queryParams: { status: 'UNASSIGNED' }
    };

    this.innovationsList = new TableModel({
      pageSize: 10000
    });

  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(queryParams => this.onRouteChange(queryParams)),
      this.form.valueChanges.subscribe(() => this.onFormChange())
    );

  }


  getInnovationsList(): void {

    this.accessorService.getInnovationsList(this.innovationsList.getAPIQueryParams()).subscribe(
      response => {
        this.innovationsList.setData(response.data, response.count);
        this.currentTab.numberDescription = `${response.count} ${this.currentTab.numberDescription}`;
      },
      error => this.logger.error(error)
    );

  }

  onRouteChange(queryParams: Params): void {

    const currentStatus = queryParams.status;
    const currentTabIndex = this.tabs.findIndex(tab => tab.queryParams.status === queryParams.status) || 0;

    if (!currentStatus) {
      this.router.navigate(['/accessor/innovations'], { queryParams: { status: this.defaultStatus } });
      return;
    }

    this.currentTab = this.tabs[currentTabIndex];

    this.form.get('assignedToMe')?.setValue(false, { emitEvent: false });

    this.innovationsList.setData([]).setFilters({ status: currentStatus, assignedToMe: false });

    switch (currentStatus) {

      case 'UNASSIGNED':
        this.innovationsList.setVisibleColumns({
          name: { label: 'Innovation', orderable: true },
          submittedAt: { label: 'Submitted', orderable: true },
          mainCategory: { label: 'Main category', orderable: true },
          countryName: { label: 'Location', orderable: true },
          engagingOrganisations: { label: 'Engaging organisations', align: 'right', orderable: false }
        }).setOrderBy('submittedAt', 'desc');
        break;

      case 'ENGAGING':
        this.innovationsList.setVisibleColumns({
          name: { label: 'Innovation', orderable: true },
          updatedAt: { label: 'Updated', orderable: true },
          mainCategory: { label: 'Main category', orderable: true },
          accessors: { label: 'Accessor', orderable: false },
          engagingOrganisations: { label: 'Engaging organisations', align: 'right', orderable: false }
        }).setOrderBy('updatedAt', 'desc');
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
        }).setOrderBy('updatedAt', 'desc');
        break;

    }

    this.getInnovationsList();

  }

  onFormChange(): void {

    this.innovationsList.setFilters({ assignedToMe: this.form.get('assignedToMe')?.value });
    this.getInnovationsList();

  }


  onTableOrder(column: string): void {

    this.innovationsList.setOrderBy(column);
    this.getInnovationsList();

  }

}
