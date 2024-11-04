import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { DatesHelper } from '@app/base/helpers';
import { TableModel } from '@app/base/models';

import { InnovationGroupedStatusEnum } from '@modules/stores';

import { DateISOType, NotificationValueType } from '@app/base/types';
import { InnovationsListFiltersType } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { ASSESSMENT_COMPLETED_STATUSES } from '@modules/stores/ctx/innovation/innovation.models';

export enum InnovationAssessmentStatusEnum {
  WAITING_NEEDS_ASSESSMENT = 'WAITING_NEEDS_ASSESSMENT',
  NEEDS_ASSESSMENT = 'NEEDS_ASSESSMENT',
  COMPLETED = 'COMPLETED',
  ALL = 'ALL'
}

type TabType = {
  key: InnovationAssessmentStatusEnum;
  title: string;
  mainDescription: string;
  secondaryDescription?: string;
  showAssignedToMeFilter: boolean;
  link: string;
  queryParams: {
    status: InnovationAssessmentStatusEnum;
    assignedToMe?: boolean;
  };
  queryFields: Parameters<InnovationsService['getInnovationsList']>[0];
  notifications: NotificationValueType;
};

@Component({
  selector: 'app-assessment-pages-innovations-list',
  templateUrl: './innovations-list.component.html'
})
export class InnovationsListComponent extends CoreComponent implements OnInit {
  defaultStatus: 'ALL' = 'ALL';
  tabs: TabType[] = [];
  currentTab: TabType;

  form = new FormGroup({
    search: new FormControl('', { validators: [Validators.maxLength(200)], updateOn: 'blur' }),
    assignedToMe: new FormControl(false, { updateOn: 'change' })
  });

  innovationsList = new TableModel<
    {
      id: string;
      name: string;
      groupedStatus: InnovationGroupedStatusEnum;
      lastAssessmentRequestAt: DateISOType | null;
      statusUpdatedAt: DateISOType;
      assessment: {
        id: string;
        assignedTo: string | null;
        updatedAt: DateISOType;
        daysFromSubmittedAtToToday?: number | null;
        overdueStatus?: 'EXEMPT' | 'OVERDUE' | 'ALMOST_DUE' | null;
      } | null;
    },
    InnovationsListFiltersType
  >({ pageSize: 20 });

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.setPageTitle('Innovations');

    this.tabs = [
      {
        key: InnovationAssessmentStatusEnum.ALL,
        title: 'All',
        mainDescription: 'All innovations shared with you.',
        showAssignedToMeFilter: true,
        link: '/assessment/innovations',
        queryParams: { status: InnovationAssessmentStatusEnum.ALL },
        queryFields: [
          'id',
          'name',
          'groupedStatus',
          'lastAssessmentRequestAt',
          'statusUpdatedAt',
          'assessment.id',
          'assessment.majorVersion',
          'assessment.minorVersion',
          'assessment.assignedTo',
          'assessment.isExempt',
          'assessment.updatedAt',
          'statistics.notifications'
        ],
        notifications: null
      },
      {
        key: InnovationAssessmentStatusEnum.WAITING_NEEDS_ASSESSMENT,
        title: 'Awaiting assessment',
        mainDescription: 'Innovations awaiting a needs assessment or reassessment.',
        showAssignedToMeFilter: false,
        link: '/assessment/innovations',
        queryParams: { status: InnovationAssessmentStatusEnum.WAITING_NEEDS_ASSESSMENT },
        queryFields: [
          'id',
          'name',
          'groupedStatus',
          'lastAssessmentRequestAt',
          'statusUpdatedAt',
          'assessment.id',
          'assessment.majorVersion',
          'assessment.minorVersion',
          'assessment.assignedTo',
          'assessment.isExempt',
          'assessment.updatedAt',
          'statistics.notifications'
        ],
        notifications: null
      },
      {
        key: InnovationAssessmentStatusEnum.NEEDS_ASSESSMENT,
        title: 'Assessment in progress',
        mainDescription: 'Innovations with a needs assessment in progress.',
        showAssignedToMeFilter: true,
        link: '/assessment/innovations',
        queryParams: { status: InnovationAssessmentStatusEnum.NEEDS_ASSESSMENT },
        queryFields: [
          'id',
          'name',
          'groupedStatus',
          'lastAssessmentRequestAt',
          'statusUpdatedAt',
          'assessment.id',
          'assessment.majorVersion',
          'assessment.minorVersion',
          'assessment.assignedTo',
          'assessment.isExempt',
          'assessment.updatedAt',
          'statistics.notifications'
        ],
        notifications: null
      },
      {
        key: InnovationAssessmentStatusEnum.COMPLETED,
        title: 'Assessment completed',
        mainDescription: 'Innovations with completed needs assessments.',
        showAssignedToMeFilter: true,
        link: '/assessment/innovations',
        queryParams: { status: InnovationAssessmentStatusEnum.COMPLETED },
        queryFields: [
          'id',
          'name',
          'groupedStatus',
          'lastAssessmentRequestAt',
          'statusUpdatedAt',
          'assessment.id',
          'assessment.assignedTo',
          'assessment.isExempt',
          'assessment.updatedAt',
          'statistics.notifications'
        ],
        notifications: null
      }
    ];

    this.currentTab = {
      key: InnovationAssessmentStatusEnum.ALL,
      title: '',
      mainDescription: '',
      showAssignedToMeFilter: false,
      link: '',
      queryParams: { status: InnovationAssessmentStatusEnum.ALL },
      queryFields: [],
      notifications: null
    };

    this.innovationsList = new TableModel({});
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(queryParams => this.onRouteChange(queryParams)),
      this.form.controls.assignedToMe.valueChanges.subscribe(() => this.onAssignedToMeChange()),
      this.form.controls.search.valueChanges.subscribe(() => this.onSearchChange())
    );
  }

  getInnovationsList(column?: string): void {
    this.setPageStatus('LOADING');

    const { take, skip, filters, order } = this.innovationsList.getAPIQueryParams();

    this.innovationsService
      .getInnovationsList(this.currentTab.queryFields, filters, { take, skip, order })
      .pipe(
        map(response => ({
          data: response.data.map(innovation => {
            const needsKPIVerification =
              innovation.assessment?.minorVersion === 0 &&
              !ASSESSMENT_COMPLETED_STATUSES.includes(innovation.groupedStatus);
            return {
              ...innovation,
              assessment: innovation.assessment
                ? {
                    id: innovation.assessment.id,
                    assignedTo: innovation.assessment.assignedTo,
                    updatedAt: innovation.assessment.updatedAt,
                    daysFromSubmittedAtToToday: this.getOverdueDays(
                      innovation.assessment.isExempt,
                      innovation.lastAssessmentRequestAt,
                      needsKPIVerification
                    ),
                    overdueStatus: this.getOverdueStatus(
                      innovation.assessment.isExempt,
                      needsKPIVerification,
                      innovation.lastAssessmentRequestAt
                    )
                  }
                : null
            };
          }),
          count: response.count
        }))
      )
      .subscribe(response => {
        this.innovationsList.setData(response.data, response.count);

        if (this.isRunningOnBrowser() && column) {
          this.innovationsList.setFocusOnSortedColumnHeader(column);
        }

        this.setPageStatus('READY');
      });
  }

  prepareInnovationsList(status: InnovationAssessmentStatusEnum): void {
    this.innovationsList
      .clearData()
      .setVisibleColumns({
        name: { label: 'Innovation', orderable: true },
        lastAssessmentRequestAt: { label: 'Submitted', orderable: true },
        assessedBy: { label: 'Assessed by', orderable: false },
        groupedStatus: { label: 'Status', orderable: false, align: 'right' }
      })
      .setOrderBy('lastAssessmentRequestAt', 'descending');

    switch (status) {
      case InnovationAssessmentStatusEnum.ALL:
        this.innovationsList.setFilters({
          groupedStatuses: undefined,
          assignedToMe: this.form.get('assignedToMe')?.value ?? false
        });
        break;
      case InnovationAssessmentStatusEnum.WAITING_NEEDS_ASSESSMENT:
        this.innovationsList.setFilters({
          groupedStatuses: [
            InnovationGroupedStatusEnum.AWAITING_NEEDS_ASSESSMENT,
            InnovationGroupedStatusEnum.AWAITING_NEEDS_REASSESSMENT
          ],
          assignedToMe: false
        });
        break;

      case InnovationAssessmentStatusEnum.NEEDS_ASSESSMENT:
        this.innovationsList.setFilters({
          groupedStatuses: [InnovationGroupedStatusEnum.NEEDS_ASSESSMENT],
          assignedToMe: this.form.get('assignedToMe')?.value ?? false
        });
        break;

      case InnovationAssessmentStatusEnum.COMPLETED:
        this.innovationsList.setFilters({
          groupedStatuses: ASSESSMENT_COMPLETED_STATUSES,
          assignedToMe: this.form.get('assignedToMe')?.value ?? false
        });
        break;
    }
  }

  onRouteChange(queryParams: Params): void {
    this.setPageTitle('Innovations');

    const currentStatus = queryParams.status;
    const currentTabIndex = this.tabs.findIndex(tab => tab.key === currentStatus);

    if (!currentStatus || currentTabIndex === -1) {
      this.router.navigate(['/assessment/innovations'], { queryParams: { status: this.defaultStatus } });
      return;
    }

    this.currentTab = this.tabs[currentTabIndex];

    if (
      this.currentTab.key === InnovationAssessmentStatusEnum.ALL ||
      this.currentTab.key === InnovationAssessmentStatusEnum.COMPLETED
    ) {
      this.form.get('assignedToMe')?.setValue(false);
    } else if (this.currentTab.key === InnovationAssessmentStatusEnum.NEEDS_ASSESSMENT) {
      this.form.get('assignedToMe')?.setValue(true);
    }

    this.prepareInnovationsList(this.currentTab.key);
    this.getInnovationsList();
  }

  onAssignedToMeChange(): void {
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

  getOverdueStatus(isExempted: boolean, needsKPIVerification: boolean, submittedAt: string | null) {
    // Just to make sure, this shouldn't happen since to reach the reassessment phase you need to submit the Innovation.
    if (!submittedAt) return null;

    // Exempt tag always needs to appear doesn't matter the state of the assessment.
    if (isExempted) {
      return 'EXEMPT' as const;
    }

    // Only the reassessments requests from the innovator counts for KPIs.
    if (needsKPIVerification) {
      const daysFromSubmittedAtToToday = this.getOverdueDays(isExempted, submittedAt, needsKPIVerification) ?? 0;
      return daysFromSubmittedAtToToday >= 15
        ? ('OVERDUE' as const)
        : daysFromSubmittedAtToToday >= 10
          ? ('ALMOST_DUE' as const)
          : null;
    }

    return null;
  }

  getOverdueDays(isExempted: boolean, submittedAt: string | null, needsKPIVerification: boolean) {
    return submittedAt && needsKPIVerification && !isExempted
      ? DatesHelper.dateDiff(submittedAt, new Date().toISOString())
      : null;
  }
}
