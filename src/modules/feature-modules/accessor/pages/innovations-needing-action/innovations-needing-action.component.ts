import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { InnovationSupportStatusEnum } from '@modules/stores';

import { DateISOType } from '@app/base/types';
import { InnovationsService } from '@modules/shared/services/innovations.service';

type TabType = {
  key: 'innovations-needing-action';
  title: string;
  mainDescription: string;
  secondaryDescription?: string;
  showAssignedToMeFilter: boolean;
  link: string;
};

@Component({
  selector: 'app-accessor-pages-innovations-needing-action',
  templateUrl: './innovations-needing-action.component.html'
})
export class InnovationsNeedingActionComponent extends CoreComponent implements OnInit {
  tabs: TabType[] = [];
  currentTab: TabType;

  form = new FormGroup({
    search: new FormControl('', { validators: [Validators.maxLength(200)], updateOn: 'blur' }),
    assignedToMe: new FormControl(false, { updateOn: 'change' })
  });

  innovationsNeedingActionList = new TableModel<{
    id: string;
    name: string;
    supportStatus: InnovationSupportStatusEnum;
    dueDate: DateISOType;
    dueDays: number;
  }>({ pageSize: 20 });

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.setPageTitle('Innovations Needing Action');

    this.tabs = [
      {
        key: 'innovations-needing-action',
        title: 'Innovations Needing Action',
        mainDescription: 'All innovations needing action.',
        showAssignedToMeFilter: true,
        link: '/accessor/needing-action'
      }
    ];

    this.currentTab = {
      key: 'innovations-needing-action',
      title: '',
      mainDescription: '',
      showAssignedToMeFilter: false,
      link: ''
    };
    this.innovationsNeedingActionList = new TableModel({
      visibleColumns: {
        name: { label: 'Innovation', orderable: true },
        dueDate: { label: 'Due date', orderable: true },
        dueDays: { label: 'Pending action', orderable: false },
        supportStatus: { label: 'Support status', align: 'right', orderable: false }
      },
      orderBy: 'name',
      orderDir: 'descending'
    });
  }

  ngOnInit(): void {
    this.setPageTitle('Innovations Needing Action');
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(queryParams => {
        this.router.navigate(['/accessor/needing-action']);
        console.log(queryParams);
        this.getInnovationsNeedingActionList();
      })
    );
    this.form.controls.search.valueChanges.subscribe(() => this.onSearchChange());
  }

  getInnovationsNeedingActionList(column?: string): void {
    this.setPageStatus('LOADING');

    const { take, skip, order } = this.innovationsNeedingActionList.getAPIQueryParams();

    this.innovationsService.getInnovationsNeedingActionsList({ take, skip, order }).subscribe(response => {
      this.innovationsNeedingActionList.setData(response.innovations, response.count);

      if (this.isRunningOnBrowser() && column) {
        this.innovationsNeedingActionList.setFocusOnSortedColumnHeader(column);
      }

      this.setPageStatus('READY');
    });
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
    this.innovationsNeedingActionList.setOrderBy(column);
    this.getInnovationsNeedingActionList(column);
  }

  onPageChange(event: { pageNumber: number }): void {
    this.innovationsNeedingActionList.setPage(event.pageNumber);
    this.getInnovationsNeedingActionList();
  }

  onSearchClick(): void {
    this.form.controls.search.updateValueAndValidity({ onlySelf: true });
  }

  getActionText(dueDays: number, supportStatus: InnovationSupportStatusEnum) {
    if (supportStatus === 'ENGAGING' || supportStatus === 'WAITING') {
      if (dueDays < 0) {
        return 'awaiting update';
      } else {
        return 'overdue update';
      }
    }
    if (supportStatus === 'SUGGESTED') {
      if (dueDays < 0) {
        return 'awaiting initial engagement';
      } else {
        return 'overdue initial engagement';
      }
    }
    throw new Error('Invalid support status');
  }

  getActionColor(dueDays: number) {
    if (dueDays < 0) {
      return 'WARNING';
    } else {
      return 'ERROR';
    }
  }
}
