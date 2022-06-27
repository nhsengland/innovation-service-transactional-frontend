import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { FormEngineParameterModel } from '@app/base/forms';
import { TableModel } from '@app/base/models';
import { INNOVATION_STATUS } from '@modules/stores/innovation/innovation.models';

import { AssessmentService, getInnovationsListEndpointOutDTO } from '../../services/assessment.service';


@Component({
  selector: 'app-assessment-pages-review-innovations',
  templateUrl: './review-innovations.component.html'
})
export class ReviewInnovationsComponent extends CoreComponent implements OnInit {

  tabs: { key: keyof typeof INNOVATION_STATUS, title: string, description: string, link: string, queryParams: { status: 'WAITING_NEEDS_ASSESSMENT' | 'NEEDS_ASSESSMENT' | 'IN_PROGRESS' } }[] = [];
  currentTab: { key: string, status: string, description: string, overdueInnovations: number };

  form = new FormGroup({
    supportFilter: new FormControl('UNASSIGNED')
  }, { updateOn: 'change' });
  formFilterItems: FormEngineParameterModel['items'] = [];

  innovationsList: TableModel<(getInnovationsListEndpointOutDTO['data'][0])>;

  innovationStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;


  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService
  ) {

    super();
    this.setPageTitle('Innovations');

    this.tabs = [
      {
        key: 'WAITING_NEEDS_ASSESSMENT',
        title: 'Awaiting assessment',
        description: 'These innovations have been submitted by their owners for needs assessment. The needs assessment team must start the assessment process within 7 days.',
        link: '/assessment/innovations',
        queryParams: { status: 'WAITING_NEEDS_ASSESSMENT' }
      },
      {
        key: 'NEEDS_ASSESSMENT',
        title: 'In progress',
        description: 'A team member has started the needs assessment process for each of these innovations. Please aim to complete the needs assessment with 14 days of starting.',
        link: '/assessment/innovations',
        queryParams: { status: 'NEEDS_ASSESSMENT' }
      },
      {
        key: 'IN_PROGRESS',
        title: 'Assessment complete',
        description: 'Needs assessment has been completed for these innovations. They are visible to all organisations that the innovator choose to share their data with.',
        link: '/assessment/innovations',
        queryParams: { status: 'IN_PROGRESS' }
      }
    ];

    this.currentTab = { key: '', status: '', description: '', overdueInnovations: 0 };

    this.formFilterItems = [
      { value: 'UNASSIGNED', label: 'Support status update overdue', description: `Qualifying accessor(s) at the recommended support organisation(s) have not updated the support status. All organisations are 'unassigned'` },
      { value: 'ENGAGING', label: 'Supported innovations', description: `Support status 'Engaging' (at least one organisation is supporting)` },
      { value: 'NOT_ENGAGING', label: 'Unsupported innovations', description: `Support status 'unassigned', 'completed', 'unsuitable', 'not yet', 'waiting' or 'further info'  (no organisation is 'engaging')` }
    ];

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

    this.assessmentService.getInnovationsList(this.innovationsList.getAPIQueryParams()).subscribe(
      response => {
        this.innovationsList.setData(response.data, response.count);
        this.currentTab.overdueInnovations = response.overdue;
        this.setPageStatus('READY');
      },
      error => {
        this.setPageStatus('ERROR');
        this.logger.error(error);
      }
    );

  }


  onRouteChange(queryParams: Params): void {

    const currentStatus = queryParams.status;
    const currentTabIndex = this.tabs.findIndex(tab => tab.queryParams.status === currentStatus) || 0;

    if (!currentStatus || currentTabIndex === -1) {
      this.router.navigate(['/assessment/innovations'], { queryParams: { status: 'WAITING_NEEDS_ASSESSMENT' } });
      return;
    }

    this.currentTab = {
      key: this.tabs[currentTabIndex].key,
      status: currentStatus,
      description: this.tabs[currentTabIndex].description,
      overdueInnovations: 0
    };

    switch (this.currentTab.status) {
      case 'WAITING_NEEDS_ASSESSMENT':
        this.innovationsList
          .clearData()
          .setFilters({ status: [this.currentTab.status] })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            submittedAt: { label: 'Submitted', orderable: true },
            location: { label: 'Location', orderable: true },
            mainCategory: { label: 'Primary category', align: 'right', orderable: true }
          })
          .setOrderBy('updatedAt');
        break;

      case 'NEEDS_ASSESSMENT':
        this.innovationsList
          .clearData()
          .setFilters({ status: [this.currentTab.status] })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            assessmentStartDate: { label: 'Assessment start date', orderable: true },
            assessedBy: { label: 'Assessed by', orderable: false },
            mainCategory: { label: 'Primary category', align: 'right', orderable: true }
          })
          .setOrderBy('assessmentStartDate');
        break;

      case 'IN_PROGRESS':
        this.innovationsList
          .clearData()
          .setFilters({ status: [this.currentTab.status], ...this.form.value })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            assessmentDate: { label: 'Assessment date', orderable: true },
            engagingEntities: { label: 'Engaging entities', orderable: true },
            mainCategory: { label: 'Primary category', align: 'right', orderable: true }
          })
          .setOrderBy('assessmentDate');
        break;

    }

    this.getInnovationsList();

  }

  onFormChange(): void {

    this.innovationsList.clearData().setFilters({ status: [this.currentTab.key], ...this.form.value });
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
