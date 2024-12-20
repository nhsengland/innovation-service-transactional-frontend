import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { AccessorService, GetUnitAccessorList } from '../../services/accessor.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { INPUT_LENGTH_LIMIT } from '@modules/shared/forms/engine/config/form-engine.config';

type AccessorAndInnovationsInfo = GetUnitAccessorList['data'][0];

@Component({
  selector: 'app-accessor-pages-accessor-list',
  templateUrl: './accessor-and-innovation-list.component.html'
})
export class AccessorAndInnovationListComponent extends CoreComponent implements OnInit {
  rawList: AccessorAndInnovationsInfo[] = [];
  accessorList = new TableModel<AccessorAndInnovationsInfo, { search: string }>({
    visibleColumns: {
      accessor: { label: 'Accessor' },
      innovationsCount: { label: 'Number of innovations' },
      innovations: { label: 'Innovations' }
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

    const accessorListSubscription = this.accessorService
      .getUnitAccessorAndInnovationsList(org.id, unit.id)
      .subscribe(response => {
        this.rawList = response.data;
        this.onPageChange({ pageNumber: 1 });

        this.setPageTitle('List of accessors and supported innovations', {
          hint: this.ctx.user.getAccessorUnitName()
        });

        this.setBackLink();
        this.setPageStatus('READY');
      });

    this.subscriptions.push(
      accessorListSubscription,
      this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange())
    );
  }

  onPageChange(event: { pageNumber: number }): void {
    this.accessorList.setPage(event.pageNumber);

    const qp = this.accessorList.getAPIQueryParams();

    const search = qp.filters.search;
    const filtered = search
      ? this.rawList.filter(c => c.accessor.name.toLowerCase().includes(search.toLowerCase()))
      : this.rawList;

    this.accessorList.setData(filtered.slice(qp.skip, qp.skip + qp.take), filtered.length);
  }

  onFormChange() {
    this.accessorList.setFilters({ search: this.form.get('search')?.value ?? '' });
    this.onPageChange({ pageNumber: 1 });
  }

  onSearchClick() {
    this.form.updateValueAndValidity({ onlySelf: true });
  }
}
