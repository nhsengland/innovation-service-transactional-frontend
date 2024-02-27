import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ContextStore } from '@modules/stores';

@Component({
  selector: 'app-base-context-innovation-outlet',
  templateUrl: './context-innovation-outlet.component.html'
})
export class ContextInnovationOutletComponent implements OnDestroy {
  private subscriptions = new Subscription();

  innovation: {
    id: string;
    name: string;
    userIsOwner: boolean;
  } = { id: '', name: '', userIsOwner: false };

  constructor(
    private router: Router,
    private contextStore: ContextStore
  ) {
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(e => this.onRouteChange(e))
    );
    this.onRouteChange();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private onRouteChange(_event?: NavigationEnd): void {
    const innovation = this.contextStore.getInnovation();
    this.innovation = {
      id: innovation.id,
      name: innovation.name,
      userIsOwner: innovation.loggedUser.isOwner
    };
  }
}
