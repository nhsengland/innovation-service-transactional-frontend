import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { UtilsHelper } from '@app/base/helpers';
import { InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { CtxStore } from '@modules/stores';

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
        .subscribe(e => this.onRouteChange(e))
    );

    this.onRouteChange();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private onRouteChange(event?: NavigationEnd): void {
    const innovation = this.ctx.innovation.info();

    this.data.innovation = {
      id: innovation.id,
      name: innovation.name,
      status: innovation.status,
      assessmentId: innovation.assessment?.id
    };

    // Do not show link, ON assessments route.
    if ((event && event.url.includes(`/assessments/`)) || innovation.status === 'ARCHIVED') {
      this.data.link = null;
    } else {
      if (innovation.status === InnovationStatusEnum.IN_PROGRESS && innovation.assessment) {
        const assessmentType = innovation.assessment.majorVersion > 1 ? 'reassessment' : 'assessment';

        this.data.link = {
          label: `View needs ${assessmentType} ${UtilsHelper.getAssessmentVersion(innovation.assessment.majorVersion, innovation.assessment.minorVersion)}`,
          url: `/accessor/innovations/${innovation.id}/assessments/${innovation.assessment?.id}`
        };
      }
    }
  }
}
