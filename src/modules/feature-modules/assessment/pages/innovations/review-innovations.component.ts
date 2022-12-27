import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { forkJoin, of } from 'rxjs';

import { CoreComponent } from '@app/base';
import { FormGroup, FormEngineParameterModel } from '@app/base/forms';
import { TableModel } from '@app/base/models';

import { AssessmentSupportFilterEnum, InnovationsListFiltersType, InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationsListDTO } from '@modules/shared/services/innovations.dtos';

import { InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { AssessmentService } from '../../services/assessment.service';


@Component({
  selector: 'app-assessment-pages-review-innovations',
  templateUrl: './review-innovations.component.html'
})
export class ReviewInnovationsComponent extends CoreComponent implements OnInit {

  tabs: { key: InnovationStatusEnum, title: string, description: string, link: string, queryParams: { status: 'WAITING_NEEDS_ASSESSMENT' | 'NEEDS_ASSESSMENT' | 'IN_PROGRESS' } }[] = [];
  currentTab: { key: InnovationStatusEnum, status: InnovationStatusEnum, description: string, overdueInnovations: number };

  form = new FormGroup({
    assessmentSupportStatus: new FormControl<AssessmentSupportFilterEnum>(AssessmentSupportFilterEnum.UNASSIGNED)
  }, { updateOn: 'change' });
  formFilterItems: FormEngineParameterModel['items'] = [];

  innovationsList: TableModel<
    InnovationsListDTO['data'][0] & { supportingOrganisations: string },
    InnovationsListFiltersType
  >;

  innovationStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private assessmentService: AssessmentService
  ) {

    super();

    this.tabs = [
      {
        key: InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT,
        title: 'Awaiting assessment',
        description: 'These innovations have been submitted by their owners for needs assessment. The needs assessment team must start the assessment process within 7 days.',
        link: '/assessment/innovations',
        queryParams: { status: 'WAITING_NEEDS_ASSESSMENT' }
      },
      {
        key: InnovationStatusEnum.NEEDS_ASSESSMENT,
        title: 'In progress',
        description: 'A team member has started the needs assessment process for each of these innovations. Please aim to complete the needs assessment with 14 days of starting.',
        link: '/assessment/innovations',
        queryParams: { status: 'NEEDS_ASSESSMENT' }
      },
      {
        key: InnovationStatusEnum.IN_PROGRESS,
        title: 'Assessment complete',
        description: 'Needs assessment has been completed for these innovations. They are visible to all organisations that the innovator choose to share their data with.',
        link: '/assessment/innovations',
        queryParams: { status: 'IN_PROGRESS' }
      }
    ];

    this.currentTab = { key: InnovationStatusEnum.CREATED, status: InnovationStatusEnum.CREATED, description: '', overdueInnovations: 0 };

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


    forkJoin([
      this.innovationsService.getInnovationsList(this.innovationsList.getAPIQueryParams()),

      ([InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT, InnovationStatusEnum.NEEDS_ASSESSMENT].includes(this.currentTab.status) ?
        this.assessmentService.getOverdueAssessments([this.currentTab.status])
        : of(null)

      )
    ]).subscribe(([innovationsList, overdueInnovations]) => {

      this.innovationsList.setData(
        innovationsList.data.map(item => {

          const supportingOrganisations = (item.supports ?? [])
            .filter(s => s.status === InnovationSupportStatusEnum.ENGAGING)
            .map(s => s.organisation.acronym);

          return {
            ...item,
            submittedAt: item.assessment?.createdAt ?? item.submittedAt,
            supportingOrganisations: [...new Set(supportingOrganisations)].join(', ') // Remove duplicates and creates a string.
          };

        }),
        innovationsList.count
      );
      this.currentTab.overdueInnovations = overdueInnovations?.overdue ?? 0;

      this.setPageTitle('Innovations');
      this.setPageStatus('READY');

    });

  }


  onRouteChange(queryParams: Params): void {

    const currentStatus = queryParams.status;
    const currentTabIndex = this.tabs.findIndex(tab => tab.queryParams.status === currentStatus) || 0;

    if (!currentStatus || currentTabIndex === -1) {
      this.router.navigate(['/assessment/innovations'], { queryParams: { status: 'WAITING_NEEDS_ASSESSMENT' } });
      return;
    }

    this.currentTab = {
      key: currentStatus,
      status: currentStatus,
      description: this.tabs[currentTabIndex].description,
      overdueInnovations: 0
    };

    switch (this.currentTab.status) {
      case InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT:
        this.innovationsList
          .clearData()
          .setFilters({ status: [this.currentTab.status] })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            reassessmentsCount: { label: 'Type', orderable: false },
            submittedAt: { label: 'Submitted', orderable: true },
            location: { label: 'Location', orderable: true },
            mainCategory: { label: 'Primary category', align: 'right', orderable: true }
          })
          .setOrderBy('updatedAt');
        break;

      case InnovationStatusEnum.NEEDS_ASSESSMENT:
        this.innovationsList
          .clearData()
          .setFilters({ status: [this.currentTab.status] })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            reassessmentsCount: { label: 'Type', orderable: false },
            assessmentStartedAt: { label: 'Assessment start date', orderable: true },
            assessedBy: { label: 'Assessed by', orderable: false },
            mainCategory: { label: 'Primary category', align: 'right', orderable: true }
          })
          .setOrderBy('assessmentStartedAt', 'descending');
        break;

      case InnovationStatusEnum.IN_PROGRESS:
        this.innovationsList
          .clearData()
          .setFilters({
            status: [this.currentTab.status],
            ...(this.currentTab.status !== InnovationStatusEnum.IN_PROGRESS ? {} : {
              assessmentSupportStatus: this.form.value.assessmentSupportStatus || AssessmentSupportFilterEnum.UNASSIGNED
            })
          })
          .setVisibleColumns({
            name: { label: 'Innovation', orderable: true },
            reassessmentsCount: { label: 'Type', orderable: false },
            assessmentFinishedAt: { label: 'Assessment date', orderable: true },
            engagingEntities: { label: 'Engaging entities', orderable: false },
            mainCategory: { label: 'Primary category', align: 'right', orderable: true }
          })
          .setOrderBy('assessmentFinishedAt', 'descending');
        break;

    }

    this.getInnovationsList();

  }

  onFormChange(): void {

    this.innovationsList.clearData().setFilters({
      status: [this.currentTab.key],
      ...(this.currentTab.status !== InnovationStatusEnum.IN_PROGRESS ? {} : {
        assessmentSupportStatus: this.form.value.assessmentSupportStatus || AssessmentSupportFilterEnum.UNASSIGNED
      })
    });
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
