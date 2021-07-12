import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { AssessmentService, getInnovationsListEndpointOutDTO } from '../../services/assessment.service';

@Component({
  selector: 'app-assessment-pages-review-innovations',
  templateUrl: './review-innovations.component.html'
})
export class ReviewInnovationsComponent extends CoreComponent implements OnInit {

  tabs: { title: string, description: string, link: string, queryParams: { status: 'WAITING_NEEDS_ASSESSMENT' | 'NEEDS_ASSESSMENT' | 'IN_PROGRESS' } }[] = [];
  currentTab: { status: string, description: string, innovationsOverdue: number };

  innovationsList: TableModel<(getInnovationsListEndpointOutDTO['data'][0])>;

  innovationStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  notifications?: {[key: string]: number};

  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService
  ) {

    super();

    this.tabs = [
      {
        title: 'Awaiting assessment',
        description: 'These innovations have been submitted by their owners for needs assessment. The needs assessment team must start the assessment process within 7 days.',
        link: '/assessment/innovations',
        queryParams: { status: 'WAITING_NEEDS_ASSESSMENT' }
      },
      {
        title: 'In progress',
        description: 'A team member has started the needs assessment process for each of these innovations. Please aim to complete the needs assessment with 14 days of starting.',
        link: '/assessment/innovations',
        queryParams: { status: 'NEEDS_ASSESSMENT' }
      },
      {
        title: 'Assessment complete',
        description: 'Needs assessment has been completed for these innovations. They are visible to all organisations that the innovator choose to share their data with.',
        link: '/assessment/innovations',
        queryParams: { status: 'IN_PROGRESS' }
      }
    ];

    this.currentTab = { status: '', description: '', innovationsOverdue: 0 };

    this.innovationsList = new TableModel({
      pageSize: 10000
    });

    this.notifications = { };

  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(queryParams => {

        if (!queryParams.status) {
          this.router.navigate(['/assessment/innovations'], { queryParams: { status: 'WAITING_NEEDS_ASSESSMENT' } });
          return;
        }

        this.currentTab = {
          status: queryParams.status,
          description: this.tabs.find(tab => tab.queryParams.status === queryParams.status)?.description || this.tabs[0].description,
          innovationsOverdue: 0
        };

        this.innovationsList.setData([]).setFilters({ status: [this.currentTab.status] });

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

      })
    );

  }


  getInnovationsList(): void {

    this.assessmentService.getInnovationsList(this.innovationsList.getAPIQueryParams()).subscribe(
      response => {
        this.notifications = response.tabInfo;

        this.innovationsList.setData(response.data, response.count);
        this.currentTab.innovationsOverdue = response.data.filter(item => item.isOverdue).length;
      },
      error => this.logger.error(error)
    );

  }


  onTableOrder(column: string): void {

    this.innovationsList.setOrderBy(column);
    this.getInnovationsList();

  }

}
