import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'theme-go-to-top-link',
  templateUrl: './go-to-top-link.component.html',
  styleUrls: ['./go-to-top-link.component.scss']
})
export class GoToTopComponent implements OnInit {
  @HostListener('window:scroll', ['$event'])
  onScrollChange($event: Event) {
    this.documentTotalHeight = document.documentElement.getBoundingClientRect().height;
    this.viewportHeight = window.innerHeight;
    this.scrolledAmount = window.scrollY;

    this.checkVisibility();
    this.checkForFooter();
  }

  backToTopIsVisible = false;

  documentTotalHeight: number = document.documentElement.getBoundingClientRect().height;

  footerHeight = 0;
  scrolledAmount = 0;
  viewportHeight = 0;

  constructor(private scroller: ViewportScroller) {}

  isAllSectionsDetailsPage = false;

  ngOnInit(): void {
    this.scroller.setOffset([0, 20]);
    this.documentTotalHeight = document.documentElement.getBoundingClientRect().height;
    this.footerHeight = document.getElementById('nhsuk-footer')?.offsetHeight
      ? document.getElementById('nhsuk-footer')!.offsetHeight + 32
      : 132;
  }

  onScrollToTop(event: Event): void {
    this.scroller.scrollToPosition([0, 0]);
    (event.target as HTMLElement).blur();
  }

  checkVisibility(): void {
    this.backToTopIsVisible = window.scrollY > this.viewportHeight;
  }

  checkForFooter(): void {
    const backToTop = document.getElementById('backToTop');

    if (this.viewportHeight + this.scrolledAmount >= this.documentTotalHeight - this.footerHeight) {
      backToTop?.classList.add('go-to-top__absolute');
    } else {
      backToTop?.classList.remove('go-to-top__absolute');
    }
  }
}
