import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, computed } from '@angular/core';
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

  private subscriptions = new Subscription();

  showCookiesBanner = false;
  showCookiesSaveSuccess = false;

  userDescription = computed(() =>
    this.ctx.user.isAccessorType()
      ? `Logged in as ${this.ctx.user.getUserRoleTranslation()}, ${this.ctx.user.getAccessorUnitName()}`
      : `Logged in as ${this.ctx.user.getUserRoleTranslation()}`
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
    protected ctx: CtxStore
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
    if (isPlatformBrowser(this.platformId)) {
      const t = document.querySelector('#toggle-menu');
      const m = document.querySelector('#close-menu');
      const n = document.querySelector('#header-navigation');

      if (t && m && n) {
        [t, m].forEach(e => {
          e.addEventListener('click', r => {
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
  }
}
