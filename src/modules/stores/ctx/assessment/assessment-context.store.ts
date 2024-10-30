import { Injectable, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { Observable, Subject, debounceTime, filter, of, switchMap, take, tap } from 'rxjs';
import { AssessmentContextService } from './assessment-context.service';
import { ContextAssessmentType } from './assessment-context.types';

@Injectable()
export class AssessmentContextStore {
  // State
  private state = signal<{
    assessment: ContextAssessmentType | null;
    isStateLoaded: boolean;
  }>({ assessment: null, isStateLoaded: false });

  // Selectors
  info = computed(() => this.state().assessment);
  isStateLoaded = computed(() => this.state().isStateLoaded);
  isStateLoaded$ = toObservable(this.isStateLoaded);

  // Actions
  fetch$ = new Subject<{ innovationId: string; assessmentId: string }>();

  constructor(private assessmentService: AssessmentContextService) {
    // Reducers
    this.fetch$
      .pipe(
        debounceTime(50),
        tap(() => {
          this.state.update(state => ({ ...state, isStateLoaded: false }));
        }),
        switchMap(ctx => this.assessmentService.getContextInfo(ctx.innovationId, ctx.assessmentId))
      )
      .subscribe(assessment => {
        this.state.update(state => ({ ...state, assessment, isStateLoaded: true }));
      });
  }

  clear(): void {
    this.state.update(() => ({ assessment: null, isStateLoaded: false }));
  }

  getOrLoad(innovationId: string, assessmentId: string): Observable<ContextAssessmentType> {
    const assessment = this.info();
    if (assessment && assessment.id === assessmentId && Date.now() < assessment.expiryAt) {
      return of(assessment);
    }
    if (assessment?.id !== assessmentId) {
      this.clear();
    }

    this.fetch$.next({ innovationId, assessmentId });
    return this.isStateLoaded$.pipe(
      filter(() => this.state().isStateLoaded && this.info() !== null),
      switchMap(() => of(this.info()!)),
      take(1)
    );
  }
}
