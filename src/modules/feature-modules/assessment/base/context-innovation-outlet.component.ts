import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

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
    links: { label: string; url: string; queryParams?: { [key: string]: undefined | string } }[];
  } = { innovation: null, links: [] };

  constructor(
    private router: Router,
    private contextStore: ContextStore
  ) {
    this.subscriptions.add(
      this.router.events
        .pipe(
          filter((e): e is NavigationEnd => e instanceof NavigationEnd),
          map((e: NavigationEnd) => e.url),
          startWith(this.router.url)
        )
        .subscribe((url: string) => this.onRouteChange(url))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private onRouteChange(url: string): void {
    const innovation = this.contextStore.getInnovation();

    this.data.innovation = {
      id: innovation.id,
      name: innovation.name,
      status: innovation.status,
      assessmentId: innovation.assessment?.id
    };

    // Do not show link, if ON any assessments/* route.
    if (url.endsWith(`/assessments/new`)) {
      this.data.links = [];
    } else if (url.includes(`/assessments/${innovation.assessment?.id}`)) {
      const urlIncludesReassessmentsNew = url.includes(`/assessments/${innovation.assessment?.id}/reassessments/new`);
      const urlIncludesEdit = url.includes(`/assessments/${innovation.assessment?.id}/edit`);
      const editPageQueryParam = urlIncludesEdit ? (url.endsWith('edit/2') ? '2' : '1') : undefined;
      const assessmentQueryParam = urlIncludesReassessmentsNew
        ? 'newReassessment'
        : urlIncludesEdit
          ? 'edit'
          : 'overview';

      this.data.links = [
        {
          label: 'View innovation record',
          url: `/assessment/innovations/${innovation.id}/record/sections/all`,
          queryParams: { assessment: assessmentQueryParam, editPage: editPageQueryParam }
        }
      ];

      if (urlIncludesReassessmentsNew || urlIncludesEdit) {
        const previousAssessmentId = this.contextStore.getAssessment().reassessment?.previousAssessmentId;
        const assessmentId = innovation.reassessmentCount ? previousAssessmentId : innovation.assessment?.id;

        this.data.links.push({
          label: 'View previous needs (re)assessment',
          url: `/assessment/innovations/${innovation.id}/assessments/${assessmentId}`,
          queryParams: { assessment: assessmentQueryParam, editPage: editPageQueryParam }
        });
      }
    } else {
      switch (innovation.status) {
        case InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT:
          if (!innovation.assessment?.id) {
            this.data.links = [
              {
                label: 'Start needs assessment',
                url: `/assessment/innovations/${innovation.id}/assessments/new`
              }
            ];
          } else {
            this.data.links = [
              {
                label: 'Continue needs assessment',
                url: `/assessment/innovations/${innovation.id}/assessments/${innovation.assessment.id}/edit`
              }
            ];
          }
          break;
        case InnovationStatusEnum.NEEDS_ASSESSMENT:
          this.data.links = [
            {
              label: 'Continue needs assessment',
              url: `/assessment/innovations/${innovation.id}/assessments/${innovation.assessment?.id}/edit`
            }
          ];
          break;

        case InnovationStatusEnum.IN_PROGRESS:
        case InnovationStatusEnum.ARCHIVED:
          this.data.links = [
            {
              label: 'View needs assessment',
              url: `/assessment/innovations/${innovation.id}/assessments/${innovation.assessment?.id}`
            }
          ];
          break;

        default:
          this.data.links = [];
          break;
      }
    }
  }
}
