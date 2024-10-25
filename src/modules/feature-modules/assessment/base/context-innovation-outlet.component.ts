import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { ContextStore, CtxStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { UtilsHelper } from '@app/base/helpers';

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
    private contextStore: ContextStore,
    private ctx: CtxStore
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
    const innovation = this.ctx.innovation.innovation();

    this.data.innovation = {
      id: innovation.id,
      name: innovation.name,
      status: innovation.status,
      assessmentId: innovation.assessment?.id
    };

    if (url.includes(`/assessments/`)) {
      if (url.includes(`/${innovation.assessment?.id}`)) {
        const assessmentEditUrl = `/assessments/${innovation.assessment?.id}/edit`;

        const isAssessmentEditPage =
          url.endsWith(assessmentEditUrl) ||
          url.endsWith(`${assessmentEditUrl}/1`) ||
          url.endsWith(`${assessmentEditUrl}/2`);
        const isAssessmentEditReasonPage = url.endsWith(`${assessmentEditUrl}/reason`);

        let assessmentQueryParam = undefined;
        let editPageQueryParam = undefined;
        if (isAssessmentEditPage) {
          assessmentQueryParam = 'edit';
          editPageQueryParam = url.endsWith('edit/2') ? '2' : '1';
        } else if (isAssessmentEditReasonPage) {
          assessmentQueryParam = 'editReason';
        } else {
          assessmentQueryParam = 'overview';
        }

        this.data.links = [
          {
            label: 'View innovation record',
            url: `/assessment/innovations/${innovation.id}/record/sections/all`,
            queryParams: { assessment: assessmentQueryParam, editPage: editPageQueryParam }
          }
        ];

        const assessment = this.contextStore.getAssessment();
        if (isAssessmentEditPage && assessment.minorVersion === 0) {
          if (assessment.previousAssessment && (assessment.majorVersion > 1 || assessment.minorVersion)) {
            const previousAssessmentType =
              assessment.previousAssessment.majorVersion > 1 ? 'reassessment' : 'assessment';
            this.data.links.push({
              label: `View needs ${previousAssessmentType} ${UtilsHelper.getAssessmentVersion(assessment.previousAssessment.majorVersion, assessment.previousAssessment.minorVersion)} `,
              url: `/assessment/innovations/${innovation.id}/assessments/${assessment.previousAssessment.id}`,
              queryParams: { assessment: assessmentQueryParam, editPage: editPageQueryParam }
            });
          }
        }
      } else {
        this.data.links = [];
      }
    } else {
      const assessmentType =
        innovation.assessment && innovation.assessment.majorVersion > 1 ? 'reassessment' : 'assessment';
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
                label: `Continue needs ${assessmentType} ${UtilsHelper.getAssessmentVersion(innovation.assessment.majorVersion, innovation.assessment.minorVersion)}`,
                url: `/assessment/innovations/${innovation.id}/assessments/${innovation.assessment.id}/edit`
              }
            ];
          }
          break;
        case InnovationStatusEnum.NEEDS_ASSESSMENT:
          this.data.links = [
            {
              label: `Continue needs ${assessmentType} ${UtilsHelper.getAssessmentVersion(innovation.assessment?.majorVersion, innovation.assessment?.minorVersion)}`,
              url: `/assessment/innovations/${innovation.id}/assessments/${innovation.assessment?.id}/edit`
            }
          ];
          break;

        case InnovationStatusEnum.IN_PROGRESS:
        case InnovationStatusEnum.ARCHIVED:
          this.data.links = [
            {
              label: `View needs ${assessmentType} ${UtilsHelper.getAssessmentVersion(innovation.assessment?.majorVersion, innovation.assessment?.minorVersion)}`,
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
