import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() currentPage = 1;
  @Input() pageSize = 20;
  @Input() totalRows?: number;
  @Output() updatePageEvent = new EventEmitter<{ pageNumber: number }>();

  constructor() {
    this.totalRows = this.totalRows || 0;
  }

  ngOnInit(): void {
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalRows! / this.pageSize);
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
