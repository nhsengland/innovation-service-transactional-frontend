import { Injectable, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthenticationModel } from '@modules/stores/authentication/authentication.models';

import { Observable, Subject, debounceTime, filter, of, switchMap, take, tap } from 'rxjs';
import { InnovationContextService } from './innovation-context.service';
import { InnovationStatusEnum } from '@modules/stores/innovation';
import { isNil, omitBy } from 'lodash';
import { ContextInnovationType, EMPTY_CONTEXT } from './innovation-context.types';
import { DeepPartial } from '@app/base/types';

@Injectable()
export class InnovationContextStore {
  // State
  private state = signal<{
    innovation: ContextInnovationType;
    isStateLoaded: boolean;
  }>({ innovation: EMPTY_CONTEXT, isStateLoaded: false });

  // Selectors
  info = computed(() => this.state().innovation);
  isArchived = computed(() => this.info().status === InnovationStatusEnum.ARCHIVED ?? false);
  isOwner = computed(() => this.info().loggedUser.isOwner);

  isStateLoaded = computed(() => this.state().isStateLoaded);
  isStateLoaded$ = toObservable(this.isStateLoaded);

  // Actions
  fetch$ = new Subject<{ innovationId: string; userContext: AuthenticationModel['userContext'] }>();

  constructor(private innovationService: InnovationContextService) {
    // Reducers
    this.fetch$
      .pipe(
        debounceTime(50),
        tap(() => {
          this.state.update(state => ({ ...state, isStateLoaded: false }));
        }),
        switchMap(ctx => this.innovationService.getContextInfo(ctx.innovationId, ctx.userContext))
      )
      .subscribe(innovation => {
        this.state.update(state => ({ ...state, innovation, isStateLoaded: true }));
      });

    // interval(60000).subscribe(() => this.logState('background refresh?'));
  }

  // Actions + Reducers
  update(info: DeepPartial<ContextInnovationType>): void {
    const dataToUpdate = omitBy<DeepPartial<ContextInnovationType>>(info, isNil);
    this.state.update(state => ({ ...state, innovation: { ...state.innovation, ...dataToUpdate } }));
  }

  clear(): void {
    this.state.update(() => ({ innovation: EMPTY_CONTEXT, isStateLoaded: false }));
  }
  // End Actions + Reducers

  getOrLoadInnovation(
    innovationId: string,
    context: AuthenticationModel['userContext']
  ): Observable<ContextInnovationType> {
    const innovation = this.state().innovation;
    if (innovation && innovation.id === innovationId && Date.now() < innovation.expiryAt) {
      return of(innovation);
    }
    if (innovation.id !== innovationId) {
      this.clear();
    }

    this.fetch$.next({ innovationId, userContext: context });
    return this.isStateLoaded$.pipe(
      filter(() => this.isStateLoaded()),
      switchMap(() => of(this.state().innovation)),
      take(1)
    );
  }
}
