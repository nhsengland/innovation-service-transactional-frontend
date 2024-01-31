import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ContextStore } from '@modules/stores';
import { DateISOType } from '@app/base/types';
import { InnovationStatusEnum } from '@modules/stores/innovation';

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
    statusUpdatedAt: null | DateISOType;
  } = { id: '', name: '', userIsOwner: false, statusUpdatedAt: null };

  innovationStatusUpdatedAt: null | DateISOType = null;

  showArchivedBanner: boolean = false;

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
      userIsOwner: innovation.loggedUser.isOwner,
      statusUpdatedAt: innovation.statusUpdatedAt
    };

    this.showArchivedBanner =
      this.contextStore.getInnovation().status === 'ARCHIVED' && !this.router.url.includes('record/sections')
        ? true
        : false;
    console.log(this.showArchivedBanner);
  }
}
