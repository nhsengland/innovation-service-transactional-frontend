import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CookiesService } from '@modules/core/services/cookies.service';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { URLS } from '@app/base/constants';

export type HeaderMenuBarItemType = {
  id: string;
  label: string;
  url?: string;
  description?: string;
  fullReload?: boolean;
  isOpen?: boolean;
  children?: { label: string; url: string; description?: string; fullReload?: boolean }[];
};

export type HeaderNotificationsType = { [key: string]: number };

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

  user: { displayName: string; description: string; showSwitchProfile: boolean } = {
    displayName: '',
    description: '',
    showSwitchProfile: false
  };

  menuBarItems: {
    isChildrenOpened: boolean;
    left: HeaderMenuBarItemType[];
    right: HeaderMenuBarItemType[];
  } = { isChildrenOpened: false, left: [], right: [] };

  URLS: typeof URLS;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private authenticationStore: AuthenticationStore,
    private coockiesService: CookiesService
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

    this.authenticationStore.state$.subscribe(state => {
      const hasMultipleRoles = (state.user && state.user?.roles.length > 1) ?? false;
      const userRole = this.authenticationStore.getUserRole();
      const orgUnitName = state.userContext?.organisationUnit?.name;

      this.user = {
        displayName: state.user?.displayName ?? '',
        description: this.authenticationStore.isAccessorType()
          ? `Logged in as ${userRole}, ${orgUnitName}`
          : `Logged in as ${userRole}`,
        showSwitchProfile: hasMultipleRoles
      };
    });
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
    this.authenticationStore.signOut();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
