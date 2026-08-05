import { Component, Input, OnDestroy, OnInit, computed } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CookiesService } from '@modules/core/services/cookies.service';

import { URLS } from '@app/base/constants';
import { CtxStore } from '@modules/stores';
import { HeaderMenuBarItemType } from './header.component';

export type HeaderNotificationsType = Record<string, number>;

@Component({
  selector: 'theme-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss']
})
export class HeaderAdminComponent implements OnInit, OnDestroy {
  @Input() showUserInformation = false;
  @Input() showSignOut = false;
  @Input() leftMenuBarItems: HeaderMenuBarItemType[] = [];
  @Input() rightMenuBarItems: HeaderMenuBarItemType[] = [];
  @Input() notifications: HeaderNotificationsType = {};

  private subscriptions = new Subscription();

  showCookiesBanner = false;
  showCookiesSaveSuccess = false;
  navigationOpen = false;

  get hasNavigation(): boolean {
    return this.leftMenuBarItems.length > 0 || this.rightMenuBarItems.length > 0 || this.showSignOut;
  }

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

  private onRouteChange(event: NavigationEnd): void {
    // Only show cookies banner if NOT on policies pages.
    this.showCookiesBanner = this.coockiesService.shouldAskForCookies() && !event.url.startsWith('/policies');
    this.closeNavigation();
  }

  onSaveCookies(useCookies: boolean): void {
    this.coockiesService.setConsentCookie(useCookies);
    this.showCookiesBanner = false;
    this.showCookiesSaveSuccess = true;
  }

  toggleNavigation(): void {
    this.navigationOpen = !this.navigationOpen;
  }

  closeNavigation(): void {
    this.navigationOpen = false;
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
      i => (i.isOpen = menuItem.id !== i.id && i.isOpen ? false : i.isOpen)
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
