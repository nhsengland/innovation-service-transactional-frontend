import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';

import { EnvironmentStore } from '@modules/stores/environment/environment.store';

@Component({
  selector: 'theme-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() showMenuBar = true;

  private subscriptions: Subscription[] = [];

  showHeroSection = false;
  authenticationButton: { title: string, url: string };

  constructor(
    private router: Router,
    private environmentStore: EnvironmentStore
  ) {

    this.authenticationButton = { title: '', url: '' };

    this.subscriptions.push(
      this.router.events.subscribe(event => this.subscribe(event)),

      this.environmentStore.isUserAuthenticated$().subscribe(state => {
        this.authenticationButton = !state ?
        { title: 'Sign in', url: '/transactional/signin' } :
        { title: 'Sign out', url: '/transactional/signout' };
      })

    );

  }

  private subscribe(event: Event): void {
    if (event instanceof NavigationEnd) {
      console.log(event.url);
      this.showHeroSection = event.url === '/';
    }
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
