import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ContextStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';

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
    private contextStore: ContextStore
  ) {
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(e => this.onRouteChange(e))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private onRouteChange(event: NavigationEnd): void {
    const innovation = this.contextStore.getInnovation();
    this.data.innovation = {
      id: innovation.id,
      name: innovation.name,
      status: innovation.status,
      assessmentId: innovation.assessment?.id
    };

    // Do not show link, if ON any assessments/* route.
    if (
      event.url.endsWith(`/assessments/new`) ||
      event.url.endsWith(`/assessments/${innovation.assessment?.id}`) ||
      event.url.includes(`/assessments/${innovation.assessment?.id}/edit`)
    ) {
      this.data.link = null;
    } else {
      switch (innovation.status) {
        case InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT:
          if (!innovation.assessment?.id) {
            this.data.link = {
              label: 'Start needs assessment',
              url: `/assessment/innovations/${innovation.id}/assessments/new`
            };
          } else {
            this.data.link = {
              label: 'Continue needs assessment',
              url: `/assessment/innovations/${innovation.id}/assessments/${innovation.assessment.id}/edit`
            };
          }
          break;
        case InnovationStatusEnum.NEEDS_ASSESSMENT:
          this.data.link = {
            label: 'Continue needs assessment',
            url: `/assessment/innovations/${innovation.id}/assessments/${innovation.assessment?.id}/edit`
          };
          break;

        case InnovationStatusEnum.IN_PROGRESS:
          this.data.link = {
            label: 'View needs assessment',
            url: `/assessment/innovations/${innovation.id}/assessments/${innovation.assessment?.id}`
          };
          break;

        default:
          this.data.link = null;
          break;
      }
    }
  }
}
