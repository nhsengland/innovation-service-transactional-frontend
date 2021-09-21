import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy, OnChanges } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() currentPage = 1;
  @Input() pageSize = 20;
  @Input() totalRows?: number;
  @Output() updatePageEvent = new EventEmitter<{ pageNumber: number }>();

  totalRecords = 0;

  constructor(private readonly cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    this.cdr.detectChanges();

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.totalRows.currentValue !== changes.totalRows.previousValue) {
      this.totalRecords = this.totalRows || 0;
    }

    this.cdr.detectChanges();

  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(i + 1);
    }
    return pages;
  }

  onNextPage(): void {
    this.updatePageEvent.emit({ pageNumber: this.currentPage += 1 });
  }

  onPreviousPage(): void {
    this.updatePageEvent.emit({ pageNumber: this.currentPage -= 1 });
  }

  onPageChange(page: number): void {
    this.updatePageEvent.emit({ pageNumber: page });
  }

}
