import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CookiesService } from '@modules/core';

import { EnvironmentStore } from '@modules/core/stores/environment.store';

@Component({
  selector: 'theme-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() showMenuBar = true;

  private subscriptions: Subscription[] = [];

  showCookiesBanner = false;
  showCookiesSaveSuccess = false;

  currentUrl = '';
  aacImage: string;
  authenticationButton: { title: string, url: string };

  constructor(
    private router: Router,
    private coockiesService: CookiesService,
    private environmentStore: EnvironmentStore
  ) {

    this.aacImage = `${this.environmentStore.APP_ASSETS_URL}/images/nhs-aac-logo.png`;
    this.authenticationButton = { title: 'My dashboard', url: `${this.environmentStore.APP_URL}/dashboard` };

    this.subscriptions.push(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e))
    );

  }

  ngOnInit(): void { }


  private onRouteChange(event: NavigationEnd): void {

    const hashLastIndex = event.url.lastIndexOf('#');
    this.currentUrl = `${this.environmentStore.APP_URL}${hashLastIndex > 0 ? event.url.substring(0, hashLastIndex) : event.url}#maincontent`;

    // Only show cookies banner if NOT on policies pages.
    this.showCookiesBanner = (this.coockiesService.shouldAskForCookies() && !event.url.startsWith('/policies'));

  }


  onSaveCookies(useCookies: boolean): void {

    this.coockiesService.setConsentCookie(useCookies);
    this.showCookiesBanner = false;
    this.showCookiesSaveSuccess = true;

  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
