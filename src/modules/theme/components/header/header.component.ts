import { Component, Input, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { CookiesService } from '@modules/core/services/cookies.service';

export type MenuBarItemType = {
  title: string;
  url?: string;
  description?: string;
  fullReload?: boolean;
  isOpen?: boolean;
  children?: { title: string; url: string; description?: string; fullReload?: boolean; }[];
};

@Component({
  selector: 'theme-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() showUserInformation = false;
  @Input() leftMenuBarItems: MenuBarItemType[] = [];
  @Input() rightMenuBarItems: MenuBarItemType[] = [];

  @ViewChild('headerNavigationElement', { read: ElementRef, static: false }) headerNavigationElement?: ElementRef;

  private subscriptions: Subscription[] = [];

  showCookiesBanner = false;
  showCookiesSaveSuccess = false;

  user: { displayName: string; description: string; };

  menuBarItems: {
    isChildrenOpened: boolean,
    left: MenuBarItemType[],
    right: MenuBarItemType[]
  } = { isChildrenOpened: false, left: [], right: [] };


  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private authenticationStore: AuthenticationStore,
    private coockiesService: CookiesService
  ) {

    const user = this.authenticationStore.getUserInfo();
    this.user = {
      displayName: user.displayName,
      description: `Logged as ${user.type}`
    };


    this.subscriptions.push(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e))
    );

  }

  ngOnInit(): void {

    this.menuBarItems = {
      left: this.leftMenuBarItems,
      right: this.rightMenuBarItems,
      isChildrenOpened: false
    };


    this.coockiesService.setAnalyticsScripts();

  }

  ngAfterViewInit(): void {

    // Behaviour for header menu on mobile.
    // Copied from NHS design system framework scripts.
    if (isPlatformBrowser(this.platformId)) {

      const t = document.querySelector('#toggle-menu');
      const m = document.querySelector('#close-menu');
      const n = document.querySelector('#header-navigation');

      if (t && m && n) {
        [t, m].forEach((e) => {
          e.addEventListener('click', (r) => {
            r.preventDefault();
            const nTemp = 'true' === t.getAttribute('aria-expanded') ? 'false' : 'true';
            t.setAttribute('aria-expanded', nTemp);
            t.classList.toggle('is-active');
            n.classList.toggle('js-show');
          });
        });
      }

    }

  }


  private onRouteChange(event: NavigationEnd): void {

    // Only show cookies banner if NOT on policies pages.
    this.showCookiesBanner = (this.coockiesService.shouldAskForCookies() && !event.url.startsWith('/policies'));

    // Always reset focus to body.
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.body.setAttribute('tabindex', '-1');
        document.body.focus();
        document.body.removeAttribute('tabindex');
      });
    }

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

      h.addEventListener('blur', (e) => {
        e.preventDefault();
        h.removeAttribute('tabIndex');
      });

    }

  }

  onHeaderMenuClick(menuItem: MenuBarItemType): void {

    [...this.menuBarItems.left, ...this.menuBarItems.right].forEach(i => i.isOpen = (menuItem.title !== i.title && i.isOpen) ? false : i.isOpen);

    this.menuBarItems.isChildrenOpened = menuItem.isOpen = !menuItem.isOpen;

  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
