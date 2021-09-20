import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() currentPage?: number;
  @Input() pages?: number[];
  @Output() updatePageEvent = new EventEmitter<{ pageNumber: number }>();

  constructor() {
    this.currentPage = this.currentPage || 0;
    this.pages = this.pages || [];
  }

  ngOnInit(): void {
  }


  onNextPage(): void {
    if (this.currentPage) {
      this.updatePageEvent.emit({ pageNumber: this.currentPage += 1 });
    }
  }

  onPreviousPage(): void {
    if (this.currentPage) {
      this.updatePageEvent.emit({ pageNumber: this.currentPage -= 1 });
    }
  }

  onPageChange(page: number): void {
    this.updatePageEvent.emit({ pageNumber: page });
  }

}
