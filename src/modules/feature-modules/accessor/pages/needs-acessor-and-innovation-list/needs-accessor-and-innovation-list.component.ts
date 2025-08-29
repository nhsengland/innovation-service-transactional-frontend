import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { AccessorService, GetUnitNeedsAccessorList } from '../../services/accessor.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { INPUT_LENGTH_LIMIT } from '@modules/shared/forms/engine/config/form-engine.config';

type NeedsAccessorAndInnovationsInfo = GetUnitNeedsAccessorList['data'][0];

@Component({
  selector: 'app-accessor-pages-needs-accessor-list',
  templateUrl: './needs-accessor-and-innovation-list.component.html'
})
export class NeedsAccessorAndInnovationListComponent extends CoreComponent implements OnInit {
  rawList: NeedsAccessorAndInnovationsInfo[] = [];
  needsAssessorList = new TableModel<NeedsAccessorAndInnovationsInfo, { search: string }>({
    visibleColumns: {
      innovation: { label: 'Assigned Innovation' },
      needsAssesmentVersion: { label: 'Needs Assessment Version' },
      needsAssesmentUser: { label: 'Needs Assessor' },
    },
    pageSize: 10
  });

  form = new FormGroup({
    search: new FormControl('', { validators: [Validators.maxLength(INPUT_LENGTH_LIMIT.xs)], updateOn: 'blur' })
  });

  constructor(private readonly accessorService: AccessorService) {
    super();
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');

    const ctx = this.ctx.user.getUserContext();
    const unit = ctx?.organisationUnit;
    const org = ctx?.organisation;
    if (!unit || !org) {
      this.redirectTo(this.ctx.user.userUrlBasePath());
      return;
    }

    const needsAccessorListSubscription = this.accessorService
      .getUnitNeedsAccessorAndInnovationsList(org.id, unit.id)
      .subscribe(response => {
        this.rawList = response.data;
        this.onPageChange({ pageNumber: 1 });

        this.setPageTitle('List of Needs Assessors and Assigned Innovations', {
          hint: this.ctx.user.getAccessorUnitName()
        });

        this.setBackLink();
        this.setPageStatus('READY');
      });

    this.subscriptions.push(
      needsAccessorListSubscription,
      this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange())
    );
  }

  onPageChange(event: { pageNumber: number }): void {
    this.needsAssessorList.setPage(event.pageNumber);

    const qp = this.needsAssessorList.getAPIQueryParams();

    const search = qp.filters.search;
    const filtered = search
      ? this.rawList.filter(c => c.needsAssessorUserName.toLowerCase().includes(search.toLowerCase()))
      : this.rawList;

    this.needsAssessorList.setData(filtered.slice(qp.skip, qp.skip + qp.take), filtered.length);
  }

  onFormChange() {
    this.needsAssessorList.setFilters({ search: this.form.get('search')?.value ?? '' });
    this.onPageChange({ pageNumber: 1 });
  }

  onSearchClick() {
    this.form.updateValueAndValidity({ onlySelf: true });
  }
}
