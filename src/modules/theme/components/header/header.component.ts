import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  ChangeDetectorRef
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CookiesService } from '@modules/core/services/cookies.service';

import { URLS } from '@app/base/constants';
import { CtxStore } from '@modules/stores';

export type HeaderMenuBarItemType = {
  id: string;
  label: string;
  url?: string;
  description?: string;
  fullReload?: boolean;
  isOpen?: boolean;
  children?: { label: string; url: string; description?: string; fullReload?: boolean }[];
};

export type HeaderNotificationsType = Record<string, number>;

export interface NhsHeaderNavItem {
  label: string;
  href?: string;
  routerLink?: string | any[];
  current?: boolean;
}

@Component({
  selector: 'theme-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() showUserInformation = false;
  @Input() showSignOut = false;
  @Input() leftMenuBarItems: HeaderMenuBarItemType[] = [];
  @Input() rightMenuBarItems: HeaderMenuBarItemType[] = [];
  @Input() notifications: HeaderNotificationsType = {};

  @Input() items: NhsHeaderNavItem[] = [
    { label: 'NHS service standard', routerLink: '/service-standard' },
    { label: 'Design system', routerLink: '/design-system', current: true },
    { label: 'Content guide', routerLink: '/content-guide' },
    { label: 'Accessibility', routerLink: '/accessibility' },
    { label: 'Community and contribution', routerLink: '/community' }
  ];

  @ViewChild('navList') navListRef?: ElementRef<HTMLUListElement>;
  @ViewChild('navContainer') navContainerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('menuItem') menuItemRef?: ElementRef<HTMLLIElement>;
  @ViewChild('menuToggle') menuToggleRef?: ElementRef<HTMLButtonElement>;
  @ViewChild('menuList') menuListRef?: ElementRef<HTMLUListElement>;
  @ViewChild('navigation') navigationRef?: ElementRef<HTMLElement>;

  visibleItems: HeaderMenuBarItemType[] = [];
  overflowItems: HeaderMenuBarItemType[] = [];
  menuEnabled = false;
  menuOpen = false;

  private resizeTimer?: number;

  private subscriptions = new Subscription();

  showCookiesBanner = false;
  showCookiesSaveSuccess = false;

  userDescription = computed(() =>
    this.ctx.user.isAccessorType()
      ? `${this.ctx.user.getUserRoleTranslation()}, ${this.ctx.user.getAccessorUnitName()}`
      : `${this.ctx.user.getUserRoleTranslation()}`
  );

  menuBarItems: {
    isChildrenOpened: boolean;
    left: HeaderMenuBarItemType[];
    right: HeaderMenuBarItemType[];
  } = { isChildrenOpened: false, left: [], right: [] };

  URLS: typeof URLS;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private coockiesService: CookiesService,
    protected ctx: CtxStore,
    private cdr: ChangeDetectorRef
  ) {
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(e => this.onRouteChange(e))
    );

    this.URLS = URLS;
  }

  ngOnInit(): void {
    this.menuBarItems = {
      left: this.leftMenuBarItems,
      right: this.rightMenuBarItems,
      isChildrenOpened: false
    };
  }

  ngAfterViewInit(): void {
    // Behaviour for header menu on mobile.
    // Copied from NHS design system framework scripts.

    // Wait for initial render so widths are measurable
    this.visibleItems = [...this.leftMenuBarItems, ...this.rightMenuBarItems];
    this.cdr.detectChanges();

    setTimeout(() => this.updateNavigation());
  }

  private onRouteChange(event: NavigationEnd): void {
    // Only show cookies banner if NOT on policies pages.
    this.showCookiesBanner = this.coockiesService.shouldAskForCookies() && !event.url.startsWith('/policies');

    // // Always reset focus to body.
    // if (isPlatformBrowser(this.platformId)) {
    //   setTimeout(() => {
    //     document.body.setAttribute('tabindex', '-1');
    //     document.body.focus();
    //     document.body.removeAttribute('tabindex');
    //   });
    // }
  }

  onSaveCookies(useCookies: boolean): void {
    this.coockiesService.setConsentCookie(useCookies);
    this.showCookiesBanner = false;
    this.showCookiesSaveSuccess = true;
  }

  handleSkipLinkClick(event: Event): void {
    event.preventDefault();

    const h = document.querySelector('h1');
    if (h) {
      h.setAttribute('tabIndex', '-1');
      h.focus();

      h.addEventListener('blur', e => {
        e.preventDefault();
        h.removeAttribute('tabIndex');
      });
    }
  }

  onHeaderMenuClick(menuItem: HeaderMenuBarItemType): void {
    [...this.menuBarItems.left, ...this.menuBarItems.right].forEach(
      i => (i.isOpen = menuItem.label !== i.label && i.isOpen ? false : i.isOpen)
    );

    this.menuBarItems.isChildrenOpened = menuItem.isOpen = !menuItem.isOpen;
  }

  signOut(): void {
    this.ctx.user.signOut();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = window.setTimeout(() => {
      this.updateNavigation();
    }, 100);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.menuOpen) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.menuOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu(): void {
    if (!this.menuEnabled) return;
    this.menuOpen = true;
    this.menuToggleRef?.nativeElement.setAttribute('aria-expanded', 'true');
    setTimeout(() => this.updateMenuBorderHeight());
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.menuToggleRef?.nativeElement.setAttribute('aria-expanded', 'false');
    this.navigationRef?.nativeElement.style.removeProperty('border-bottom-width');
  }

  trackByLabel = (_: number, item: NhsHeaderNavItem) => item.label;

  private updateNavigation(): void {
    const navContainer = this.navContainerRef?.nativeElement;
    const menuItem = this.menuItemRef?.nativeElement;
    const navList = this.navListRef?.nativeElement;

    if (!navContainer || !menuItem || !navList) return;

    // Reset
    this.visibleItems = [...this.leftMenuBarItems, ...this.rightMenuBarItems];
    this.overflowItems = [];
    this.menuEnabled = false;
    this.menuOpen = false;
    this.navigationRef?.nativeElement.style.removeProperty('border-bottom-width');
    this.cdr.detectChanges();

    // Measure after reset has rendered
    const itemElements = Array.from(
      navList.querySelectorAll<HTMLElement>('.nhsuk-header__navigation-item[data-nav-item="true"]')
    );

    console.log('leftItems', this.leftMenuBarItems);
    console.log('rightItems', this.rightMenuBarItems);
    console.log('visibleItems', this.visibleItems);
    console.log('items', itemElements.length);
    console.log(
      itemElements.map(el => ({
        text: el.innerText.trim(),
        right: el.getBoundingClientRect().right,
        top: el.getBoundingClientRect().top
      }))
    );
    console.log('containerRight', navContainer.getBoundingClientRect().right);

    if (!itemElements.length) {
      return;
    }

    const containerRect = navContainer.getBoundingClientRect();
    const firstRowTop = Math.round(itemElements[0].getBoundingClientRect().top);

    const isOverflowing = (el: HTMLElement, rightBoundary: number): boolean => {
      const rect = el.getBoundingClientRect();
      const isPastRightEdge = Math.ceil(rect.right) > Math.floor(rightBoundary);
      const hasWrapped = Math.round(rect.top) > firstRowTop;
      return isPastRightEdge || hasWrapped;
    };

    // First pass: detect if anything overflows without the More button
    let overflowIndex = itemElements.findIndex(el => isOverflowing(el, containerRect.right));

    if (overflowIndex === -1) {
      return;
    }

    // Second pass: enable More button and reserve width for it
    this.menuEnabled = true;
    this.cdr.detectChanges();

    const refreshedMenuItem = this.menuItemRef?.nativeElement;
    const refreshedNavList = this.navListRef?.nativeElement;

    if (!refreshedMenuItem || !refreshedNavList) return;

    const refreshedItems = Array.from(
      refreshedNavList.querySelectorAll<HTMLElement>('.nhsuk-header__navigation-item[data-nav-item="true"]')
    );

    const menuWidth = refreshedMenuItem.getBoundingClientRect().width;
    const adjustedRightBoundary = containerRect.right - menuWidth;
    const refreshedFirstRowTop = refreshedItems.length ? Math.round(refreshedItems[0].getBoundingClientRect().top) : 0;

    const isOverflowingWithMenu = (el: HTMLElement): boolean => {
      const rect = el.getBoundingClientRect();
      const isPastRightEdge = Math.ceil(rect.right) > Math.floor(adjustedRightBoundary);
      const hasWrapped = Math.round(rect.top) > refreshedFirstRowTop;
      return isPastRightEdge || hasWrapped;
    };

    overflowIndex = refreshedItems.findIndex(el => isOverflowingWithMenu(el));

    if (overflowIndex === -1) {
      this.menuEnabled = false;
      this.cdr.detectChanges();
      return;
    }

    this.visibleItems = this.leftMenuBarItems.slice(0, overflowIndex);
    this.overflowItems = this.leftMenuBarItems.slice(overflowIndex);
    this.menuEnabled = this.overflowItems.length > 0;
    this.menuOpen = false;

    this.cdr.detectChanges();
  }

  private updateMenuBorderHeight(): void {
    const nav = this.navigationRef?.nativeElement;
    const menuList = this.menuListRef?.nativeElement;

    if (!nav || !menuList || !this.menuOpen) return;

    nav.style.setProperty('border-bottom-width', `${menuList.offsetHeight}px`);
  }
}
