import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ContextInnovationType, ContextStore } from '@modules/stores';
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

  innovation: ContextInnovationType;

  constructor(
    private router: Router,
    private contextStore: ContextStore
  ) {
    this.innovation = this.contextStore.getInnovation();

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

  private onRouteChange(event?: NavigationEnd): void {
    this.data.innovation = {
      id: this.innovation.id,
      name: this.innovation.name,
      status: this.innovation.status,
      assessmentId: this.innovation.assessment?.id
    };

    // Do not show link, if ON any assessments/* route.
    if (
      event &&
      (event.url.endsWith(`/assessments/new`) ||
        event.url.endsWith(`/assessments/${this.innovation.assessment?.id}`) ||
        event.url.includes(`/assessments/${this.innovation.assessment?.id}/edit`))
    ) {
      this.data.link = null;
    } else {
      switch (this.innovation.status) {
        case InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT:
          if (!this.innovation.assessment?.id) {
            this.data.link = {
              label: 'Start needs assessment',
              url: `/assessment/innovations/${this.innovation.id}/assessments/new`
            };
          } else {
            this.data.link = {
              label: 'Continue needs assessment',
              url: `/assessment/innovations/${this.innovation.id}/assessments/${this.innovation.assessment.id}/edit`
            };
          }
          break;
        case InnovationStatusEnum.NEEDS_ASSESSMENT:
          this.data.link = {
            label: 'Continue needs assessment',
            url: `/assessment/innovations/${this.innovation.id}/assessments/${this.innovation.assessment?.id}/edit`
          };
          break;

        case InnovationStatusEnum.IN_PROGRESS:
          this.data.link = {
            label: 'View needs assessment',
            url: `/assessment/innovations/${this.innovation.id}/assessments/${this.innovation.assessment?.id}`
          };
          break;

        default:
          this.data.link = null;
          break;
      }
    }
  }
}
