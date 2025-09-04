import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { AssessmentService, NeedsAssessorList } from '../../services/assessment.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { INPUT_LENGTH_LIMIT } from '@modules/shared/forms/engine/config/form-engine.config';

type NeedsAssessorAndInnovationsInfo = NeedsAssessorList['data'][0];

@Component({
  selector: 'app-assessment-pages-needs-accessor-list',
  templateUrl: './needs-assessor-and-innovation-list.component.html'
})
export class NeedsAssessorAndInnovationListComponent extends CoreComponent implements OnInit {
  rawList: NeedsAssessorAndInnovationsInfo[] = [];
  needsAssessorList = new TableModel<NeedsAssessorAndInnovationsInfo, { search: string }>({
    visibleColumns: {
      innovation: { label: 'Assigned Innovation' },
      needsAssesmentVersion: { label: 'Needs Assessment Version' },
      needsAssesmentUser: { label: 'Needs Assessor' }
    },
    pageSize: 10
  });

  form = new FormGroup({
    search: new FormControl('', { validators: [Validators.maxLength(INPUT_LENGTH_LIMIT.xs)], updateOn: 'blur' })
  });

  constructor(private readonly assessmentService: AssessmentService) {
    super();
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');

    const needsAssessorListSubscription = this.assessmentService
      .getNeedsAssessorAndInnovationsList()
      .subscribe(response => {
        this.rawList = response.data;
        this.onPageChange({ pageNumber: 1 });
        this.setPageTitle('List of Needs Assessors and Assigned Innovations');
        this.setBackLink();
        this.setPageStatus('READY');
      });

    this.subscriptions.push(
      needsAssessorListSubscription,
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
