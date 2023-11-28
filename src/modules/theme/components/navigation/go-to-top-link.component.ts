import { ViewportScroller } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'theme-go-to-top-link',
  templateUrl: './go-to-top-link.component.html'
})
export class GoToTopComponent implements OnInit {

  @HostListener('window:scroll', ['$event'])
  onScrollChange($event: Event){
    
    this.documentTotalHeight = document.documentElement.getBoundingClientRect().height;
    this.viewportHeight = window.innerHeight;
    this.scrolledAmount = window.scrollY;

    this.backToTopIsVisible = window.scrollY > 750 ? true : false;
    
    this.checkForFooter();

    console.log('-----------------')
    
    console.log('this.documentTotalHeight',this.documentTotalHeight);
    console.log('this.viewportHeight',this.viewportHeight);

    console.log('sum A:', ( this.viewportHeight + this.scrolledAmount ) )
    console.log('sum B:', ( this.documentTotalHeight - this.footerHeight ) )

    console.log('scroll amount', this.scrolledAmount)



  }

  backToTopIsVisible: boolean = false;
  hasReachedFooter: boolean = false;

  documentTotalHeight: number = document.documentElement.getBoundingClientRect().height;
  
  footerHeight: number = 0
  scrolledAmount: number = 0
  viewportHeight: number = 0
  headerHeight: number = 0
  navHeight: number = 0
  sideMenuHeight: number = 0

  constructor(
    private scroller: ViewportScroller
  ) { }

  isAllSectionsDetailsPage: boolean = false;

  ngOnInit(): void {

    this.scroller.setOffset([0,20]);

    this.backToTopIsVisible = window.scrollY > 750 ? true : false;

    this.documentTotalHeight = document.documentElement.getBoundingClientRect().height;
    this.footerHeight = document.getElementById('nhsuk-footer') ? document.getElementById('nhsuk-footer')!.offsetHeight + 32 : 132;

    
    this.headerHeight = document.getElementById('theme-header')!.offsetHeight;
    this.navHeight = document.getElementById('theme-breadcrumbs-bar')!.getBoundingClientRect().height;
    this.sideMenuHeight =  
      document.getElementById('header-container')?.offsetHeight! + 
      document.getElementById('header-navigation')?.offsetHeight! + 
      document.getElementById('header-context-innovation-outlet')?.offsetHeight! + 
      (document.getElementById('left-aside-menu')?.offsetHeight! + 32)
   
  }

  onScrollToTop(): void {
    this.scroller.scrollToPosition([0,0]);
  }

  checkVisibility(): boolean {
    // Math.max(this.sideMenuHeight, this.viewportHeight)
    // let sideMenuLimit = this.headerHeight + this.navHeight + this.
    return false
  }

  checkForFooter(): void {
    const backToTop = document.getElementById('backToTop')
    if ((this.viewportHeight + this.scrolledAmount ) >= ( this.documentTotalHeight - this.footerHeight )){
console.log('added')
      backToTop?.classList.add("absolute");

    } else {
      console.log('removed')
      backToTop?.classList.remove("absolute");

    }
  }
}
