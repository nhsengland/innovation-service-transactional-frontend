import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CtxStore, InnovationStatusEnum } from '@modules/stores';

@Component({
  selector: 'app-base-context-innovation-outlet',
  templateUrl: './context-innovation-outlet.component.html'
})
export class ContextInnovationOutletComponent implements OnDestroy {
  private subscriptions = new Subscription();

  data: {
    innovation: null | { id: string; name: string; status: InnovationStatusEnum; assessmentId?: string };
    link: null | { label: string; url: string };
  } = { innovation: null, link: null };

  constructor(
    private router: Router,
    private ctx: CtxStore
  ) {
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => this.onRouteChange())
    );

    this.onRouteChange();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private onRouteChange(): void {
    const innovation = this.ctx.innovation.info();
    this.data.innovation = {
      id: innovation.id,
      name: innovation.name,
      status: innovation.status,
      assessmentId: innovation.assessment?.id
    };
  }
}
