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
  } = { id: '', name: '', userIsOwner: false };

  innovationStatusUpdatedAt: null | DateISOType = null;
  innovationStatus: InnovationStatusEnum;

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

    this.innovationStatus = this.contextStore.getInnovation().status;

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
    this.innovationStatus = this.contextStore.getInnovation().status;
    this.innovationStatusUpdatedAt = this.contextStore.getInnovation().statusUpdatedAt;

    this.showArchivedBanner =
      this.innovationStatus === 'ARCHIVED' && !this.router.url.includes('record/sections') ? true : false;
    console.log(this.showArchivedBanner);
  }
}
