import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { NotificationService } from '@modules/shared/services/notification.service';

import { AssessmentService, getInnovationsListEndpointOutDTO } from '../../services/assessment.service';

@Component({
  selector: 'app-assessment-pages-review-innovations',
  templateUrl: './review-innovations.component.html'
})
export class ReviewInnovationsComponent extends CoreComponent implements OnInit {

  tabs: { key: string, title: string, description: string, link: string, notifications?: number, queryParams: { status: 'WAITING_NEEDS_ASSESSMENT' | 'NEEDS_ASSESSMENT' | 'IN_PROGRESS' } }[] = [];
  currentTab: { key: string, status: string, description: string, innovationsOverdue: number };

  innovationsList: TableModel<(getInnovationsListEndpointOutDTO['data'][0])>;

  innovationStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService,
    private notificationService: NotificationService,
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

    this.currentTab = { key: '', status: '', description: '', innovationsOverdue: 0 };

    this.innovationsList = new TableModel({ });

  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(queryParams => {

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
          innovationsOverdue: 0
        };

        this.innovationsList.setData([]).setFilters({ status: [this.currentTab.status] });
        this.innovationsList.page = 1;

        switch (this.currentTab.status) {
          case 'WAITING_NEEDS_ASSESSMENT':
            this.innovationsList.setVisibleColumns({
              name: { label: 'Innovation', orderable: true },
              submittedAt: { label: 'Submitted', orderable: true },
              location: { label: 'Location', orderable: true },
              mainCategory: { label: 'Primary category', align: 'right', orderable: true }
            }).setOrderBy('updatedAt');
            break;

          case 'NEEDS_ASSESSMENT':
            this.innovationsList.setVisibleColumns({
              name: { label: 'Innovation', orderable: true },
              assessmentStartDate: { label: 'Assessment start date', orderable: true },
              assessedBy: { label: 'Assessed by', orderable: true },
              mainCategory: { label: 'Primary category', align: 'right', orderable: true }
            }).setOrderBy('updatedAt');
            break;

          case 'IN_PROGRESS':
            this.innovationsList.setVisibleColumns({
              name: { label: 'Innovation', orderable: true },
              assessmentDate: { label: 'Assessment date', orderable: true },
              engagingEntities: { label: 'Engaging entities', orderable: true },
              mainCategory: { label: 'Primary category', align: 'right', orderable: true }
            }).setOrderBy('updatedAt');
            break;

        }

        this.getInnovationsList();
        this.getNotificationsGroupedByStatus();

      })
    );

  }


  getInnovationsList(): void {

    this.setPageStatus('LOADING');

    this.assessmentService.getInnovationsList(this.innovationsList.getAPIQueryParams()).subscribe(
      response => {
        this.innovationsList.setData(response.data, response.count);
        this.currentTab.innovationsOverdue = response.data.filter(item => item.isOverdue).length;
        this.setPageStatus('READY');
      },
      error => {
        this.setPageStatus('ERROR');
        this.logger.error(error);
      }
    );

  }

  getNotificationsGroupedByStatus(): void {
    this.notificationService.getAllUnreadNotificationsGroupedByStatus('INNOVATION_STATUS').subscribe(
      response => {
        for (const t of this.tabs) {
          t.notifications = response[t.key] || 0;
        }
      }
    );
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
