import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import {
  GetThreadsListDTO,
  InnovationsService,
  InnovationThreadListFiltersType
} from '@modules/shared/services/innovations.service';
import { ContextInnovationType, InnovationStatusEnum } from '@modules/stores';

@Component({
  selector: 'shared-pages-innovation-messages-threads-list',
  templateUrl: './threads-list.component.html'
})
export class PageInnovationThreadsListComponent extends CoreComponent implements OnInit {
  selfUser: { id: string; organisationUnitId?: string };
  innovation: ContextInnovationType;
  tableList = new TableModel<GetThreadsListDTO['data'][0], InnovationThreadListFiltersType>({ pageSize: 10 });

  // Filter
  form = new FormGroup({
    subject: new FormControl('', { validators: [Validators.maxLength(100)], updateOn: 'blur' }),
    following: new FormControl(false, { updateOn: 'change' })
  });

  // Flags
  isInnovationSubmitted: boolean;
  canCreateThread = false;
  isInAssessment: boolean;

  constructor(private innovationsService: InnovationsService) {
    super();
    this.setPageTitle('Messages');

    this.selfUser = {
      id: this.ctx.user.getUserId(),
      organisationUnitId: this.ctx.user.getUserContext()?.organisationUnit?.id
    };

    this.innovation = this.ctx.innovation.info();

    // Flags
    this.isInnovationSubmitted = this.innovation.status !== InnovationStatusEnum.CREATED;
    this.isInAssessment = this.innovation.status.includes('ASSESSMENT');

    if (this.ctx.user.isAssessment()) {
      this.canCreateThread = this.innovation.owner != null;
    } else if (this.ctx.user.isAccessorType()) {
      this.canCreateThread =
        this.innovation.owner != null && this.innovation.status === InnovationStatusEnum.IN_PROGRESS;
    } else if (this.ctx.user.isInnovator()) {
      if (
        this.innovation.status === InnovationStatusEnum.IN_PROGRESS ||
        ([InnovationStatusEnum.NEEDS_ASSESSMENT, InnovationStatusEnum.AWAITING_NEEDS_REASSESSMENT].includes(
          this.innovation.status
        ) &&
          this.innovation.assignedTo)
      ) {
        this.canCreateThread = this.innovation.owner != null;
      } else {
        this.canCreateThread = false;
      }
    }

    if (this.ctx.user.isAdmin()) {
      this.setPageTitle('Messages', { hint: `Innovation ${this.innovation.name}` });
    }

    this.subscriptions.push(this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange()));
  }

  ngOnInit(): void {
    this.tableList
      .setVisibleColumns({
        subject: { label: 'Message threads', orderable: false },
        messageCount: { label: 'Total messages', orderable: false },
        latestMessageCreatedAt: { label: 'Latest received', align: 'right', orderable: true }
      })
      .setOrderBy('latestMessageCreatedAt', 'descending');

    this.getThreadsList();
  }

  getThreadsList(column?: string): void {
    this.setPageStatus('LOADING');

    this.innovationsService
      .getThreadsList(this.innovation.id, this.tableList.getAPIQueryParams())
      .subscribe(response => {
        this.tableList.setData(response.data, response.count);
        if (this.isRunningOnBrowser() && column) {
          this.tableList.setFocusOnSortedColumnHeader(column);
        }
        this.setPageStatus('READY');
      });
  }

  onTableOrder(column: string): void {
    this.tableList.setOrderBy(column);
    this.getThreadsList(column);
  }

  onPageChange(event: { pageNumber: number }): void {
    this.tableList.setPage(event.pageNumber);
    this.getThreadsList();
  }

  onFormChange(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.tableList.setFilters({
      subject: this.form.get('subject')?.value ?? undefined,
      following: this.form.get('following')?.value ?? false
    });

    this.tableList.setPage(1);
    this.getThreadsList();
  }

  onSearchClick() {
    this.form.updateValueAndValidity({ onlySelf: true });
  }
}
