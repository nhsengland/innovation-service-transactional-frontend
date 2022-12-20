import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'theme-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {

  @Input() currentPage = 1;
  @Input() pageSize = 20;
  @Input() totalRows = 0;
  @Output() updatePageEvent = new EventEmitter<{ pageNumber: number }>();

  totalPages = 0;
  private nTabs = 5;

  constructor() { }

  getPages(): number[] {

    this.totalPages = Math.ceil(this.totalRows / this.pageSize)

    // Default shows current with the two numbers before and after
    let start = this.currentPage - 2;
    let end = this.currentPage + 2;

    // In this case show the first nTabs
    if (this.currentPage < this.nTabs + 1) {
      start = 1;
      end = start + this.nTabs;
    }

    // In this case show the last nTabs elements
    if (this.totalPages - this.nTabs < this.currentPage) {
      start = this.totalPages - this.nTabs;
      end = this.totalPages;
    }

    // When totalPages are less than 10 shows everything
    if (this.totalPages <= 10) {
      start = 1;
      end = this.totalPages;
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  onNextPage(): void {
    this.currentPage += 1;
    this.updatePageEvent.emit({ pageNumber: this.currentPage });
  }

  onPreviousPage(): void {
    this.currentPage -= 1;
    this.updatePageEvent.emit({ pageNumber: this.currentPage });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePageEvent.emit({ pageNumber: page });
  }

}
