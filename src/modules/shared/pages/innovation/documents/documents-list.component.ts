import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { DatesHelper } from '@app/base/helpers';
import { TableModel } from '@app/base/models';
import { CustomValidators } from '@modules/shared/forms';

import { ContextTypeType, InnovationDocumentsListFiltersType, InnovationDocumentsListOutDTO, InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';
import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import { ChipFilterInputType, ChipsFilterComponent } from '@modules/theme/components/chips/chips-filter-component';

@Component({
  selector: 'shared-pages-innovation-documents-documents-list',
  templateUrl: './documents-list.component.html'
})
export class PageInnovationDocumentsListComponent extends CoreComponent implements OnInit {

  @ViewChild('locationTagsComponent') locationTagsComponent?: ChipsFilterComponent;

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

  filterCount: number = 0;

  locationChipsInput: ChipFilterInputType = [];
  selectedLocationFilters: string[] = [];
  uploadedByChips: ChipFilterInputType = [];
  selectedUploadedByChips: string[] = []

  constructor(
    private innovationDocumentsService: InnovationDocumentsService,
    private statisticsService: StatisticsService
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

    this.statisticsService.getInnovationStatisticsInfo(this.innovation.id, { statistics: [InnovationStatisticsEnum.DOCUMENTS_STATISTICS_COUNTER] })
      .subscribe(({ DOCUMENTS_STATISTICS_COUNTER }) => {

        this.locationChipsInput = DOCUMENTS_STATISTICS_COUNTER.locations
          .map(l => ({ id: l.location, value: this.translate(`shared.catalog.documents.contextType.${l.location}`), count: l.count }))
          .sort((a, b) => b.count - a.count);

        this.uploadedByChips = DOCUMENTS_STATISTICS_COUNTER.uploadedByRoles
          .map(r => ({ id: r.role, value: this.translate(`shared.catalog.documents.uploadedByRole.${r.role}`), count: r.count }))
          .sort((a, b) => b.count - a.count);

        this.tableList.setVisibleColumns({
          name: { label: 'Name', orderable: true },
          createdAt: { label: 'Uploaded', orderable: true },
          contextType: { label: 'Location', orderable: true },
          actions: { label: '', align: 'right' }
        }).setOrderBy('createdAt', 'descending');

        this.getDocumentsList();

      });

  }

  getDocumentsList(column?: string): void {

    this.setPageStatus('LOADING');

    this.innovationDocumentsService.getDocumentList(this.innovation.id, this.tableList.getAPIQueryParams()).subscribe(response => {
      this.tableList.setData(response.data, response.count);
      if (this.isRunningOnBrowser() && column) this.tableList.setFocusOnSortedColumnHeader(column);
      this.setPageStatus('READY');
    });

  }

  onClearFilters(): void {

    this.form.get('startDate')?.reset()
    this.form.get('endDate')?.reset()

    this.locationTagsComponent?.clearSelectedChips();

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

  private setFilters() {

    const startDate = this.getDateByControlName('startDate') ?? undefined;
    const endDate = this.getDateByControlName('endDate') ?? undefined;

    this.tableList.setFilters({
      name: this.form.get('name')?.value ?? undefined,
      ...(this.selectedLocationFilters.length > 0 ? { contextTypes: this.selectedLocationFilters as ContextTypeType[] } : {}),
      ...(this.selectedUploadedByChips.length > 0 ? { uploadedBy: this.selectedUploadedByChips as UserRoleEnum[] } : {}),
      ...(startDate || endDate ? { dateFilter: [{ field: 'createdAt', startDate, endDate }] } : {})
    });

    this.calculateFilterNum();

  }

  private getDateByControlName(formControlName: string) {
    const value = this.form.get(formControlName)!.value;
    return DatesHelper.parseIntoValidFormat(value);
  }

  setSelectedLocations(locations: string[]) {
    this.selectedLocationFilters = locations;
  }

  setSelectedUploadedBy(roles: string[]) {
    this.selectedUploadedByChips = roles.flatMap(
      role =>
        role === UserRoleEnum.ACCESSOR
          ? [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR]
          : role
    );

    this.onFormChange();
  }

  calculateFilterNum() {

    let counter = this.selectedLocationFilters.length;

    const startDate = this.getDateByControlName('startDate') ?? undefined;
    const endDate = this.getDateByControlName('endDate') ?? undefined;

    startDate && counter++;
    endDate && counter++;

    this.filterCount = counter;

  }

}
