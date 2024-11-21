import { Injectable, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  debounceTime,
  filter,
  of,
  switchMap,
  take,
  tap,
  throwError
} from 'rxjs';
import { AssessmentContextService } from './assessment-context.service';
import { ContextAssessmentType } from './assessment-context.types';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AssessmentContextStore {
  // State
  private state = signal<{
    assessment: ContextAssessmentType | null;
    isStateLoaded: boolean;
    error?: HttpErrorResponse;
  }>({ assessment: null, isStateLoaded: false });

  // Selectors
  info = computed(() => this.state().assessment);
  isStateLoaded = computed(() => this.state().isStateLoaded);
  isStateLoaded$ = toObservable(this.isStateLoaded);
  hasError = computed(() => this.state().error);
  hasError$ = toObservable(this.hasError);

  // Actions
  fetch$ = new Subject<{ innovationId: string; assessmentId: string }>();

  constructor(private assessmentService: AssessmentContextService) {
    // Reducers
    this.fetch$
      .pipe(
        debounceTime(50),
        tap(() => {
          this.state.update(state => ({ ...state, isStateLoaded: false, error: undefined }));
        }),
        switchMap(ctx =>
          this.assessmentService.getContextInfo(ctx.innovationId, ctx.assessmentId).pipe(
            catchError(error => {
              this.state.update(state => ({ ...state, error }));
              return of(null);
            })
          )
        )
      )
      .subscribe(assessment => {
        this.state.update(state => ({ ...state, assessment, isStateLoaded: true }));
      });
  }

  clear(): void {
    this.state.update(() => ({ assessment: null, isStateLoaded: false, error: undefined }));
  }

  getOrLoad(innovationId: string, assessmentId: string): Observable<ContextAssessmentType> {
    const assessment = this.info();
    if (assessment && assessment.id === assessmentId && Date.now() < assessment.expiryAt) {
      return of(assessment);
    }
    if (assessment?.id !== assessmentId || this.hasError()) {
      this.clear();
    }

    this.fetch$.next({ innovationId, assessmentId });
    return combineLatest([this.isStateLoaded$, this.hasError$]).pipe(
      filter(() => (this.isStateLoaded() && this.info() !== null) || this.hasError() !== undefined),
      switchMap(() => {
        if (this.hasError()) {
          return throwError(() => this.hasError());
        }
        return of(this.info()!);
      }),
      take(1)
    );
  }
}
