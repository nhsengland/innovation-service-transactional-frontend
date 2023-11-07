import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { DatesHelper } from '@app/base/helpers';
import { TableModel } from '@app/base/models';
import { CustomValidators } from '@modules/shared/forms';

import { ContextTypeType, InnovationDocumentsListFiltersType, InnovationDocumentsListOutDTO, InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';
import { ContextInnovationType } from '@modules/stores/context/context.types';


@Component({
  selector: 'shared-pages-innovation-documents-documents-list',
  templateUrl: './documents-list.component.html'
})
export class PageInnovationDocumentsListComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType;
  tableList = new TableModel<InnovationDocumentsListOutDTO['data'][number], InnovationDocumentsListFiltersType>({ pageSize: 10 });

  // Flags
  isAdmin: boolean;
  isInnovatorType: boolean;

  // Filter
  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.maxLength(50)], updateOn: 'change' }),
    startDate: new FormControl(null, CustomValidators.parsedDateStringValidator()),
    endDate: new FormControl(null, CustomValidators.parsedDateStringValidator()),
  }, { updateOn: 'blur' });
  
  showFiltersHideStatus: 'opened' | 'closed' = 'closed';

  documentsLocations: ContextTypeType[] = [];

  constructor(
    private innovationDocumentsService: InnovationDocumentsService
  ) {

    super();
    this.setPageTitle('Documents');

    this.innovation = this.stores.context.getInnovation();

    this.isAdmin = this.stores.authentication.isAdminRole();
    this.isInnovatorType = this.stores.authentication.isInnovatorType();

    if (this.isAdmin) {
      this.setPageTitle('Documents', { hint: `Innovation ${this.innovation.name}` })
    }

  }


  ngOnInit(): void {

    this.tableList.setVisibleColumns({
      name: { label: 'Name', orderable: true },
      createdAt: { label: 'Uploaded', orderable: true },
      contextType: { label: 'Location', orderable: true },
      actions: { label: '', align: 'right'}
    }).setOrderBy('createdAt', 'descending');

    this.getDocumentsList();

  }

  getDocumentsList(column?: string): void {

    this.setPageStatus('LOADING');

    this.innovationDocumentsService.getDocumentList(this.innovation.id, this.tableList.getAPIQueryParams()).subscribe(response => {
      this.tableList.setData(response.data, response.count);
      if (this.isRunningOnBrowser() && column) this.tableList.setFocusOnSortedColumnHeader(column);
      this.documentsLocations.push('INNOVATION', 'INNOVATION_EVIDENCE');
      this.setPageStatus('READY');
    });

  }

  onClearFilters(): void{

    this.form.get('startDate')?.reset()
    this.form.get('endDate')?.reset()

    this.setFilters();

    this.tableList.setPage(1);
    this.getDocumentsList();

  }

  onTableOrder(column: string): void {
    this.tableList.setOrderBy(column);
    this.getDocumentsList(column);
  }

  onPageChange(event: { pageNumber: number }): void {
    this.tableList.setPage(event.pageNumber);
    this.getDocumentsList();
  }

  onFormChange(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.setFilters();

    this.tableList.setPage(1);
    this.getDocumentsList();

  }

  onShowFiltersClick(){

    this.showFiltersHideStatus === 'closed' ? 'open' : 'closed';

  }

  private setFilters() {

    const startDate = this.getDateByControlName('startDate') ?? undefined;
    const endDate = this.getDateByControlName('endDate') ?? undefined;

    this.tableList.setFilters({
      name: this.form.get('name')?.value ?? undefined,
      ...(startDate || endDate ? { dateFilter: [{ field: 'createdAt', startDate, endDate }] } : {})
    });

  }

  private getDateByControlName(formControlName: string) {
    const value = this.form.get(formControlName)!.value;
    return DatesHelper.parseIntoValidFormat(value);
  }




}
