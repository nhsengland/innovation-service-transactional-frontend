import { Injectable, computed, signal } from '@angular/core';
import { AuthenticationModel } from '@modules/stores/authentication/authentication.models';

import { BehaviorSubject, Observable, Subject, filter, of, switchMap, take, tap } from 'rxjs';
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
    isLoaded: boolean;
  }>({ innovation: EMPTY_CONTEXT, isLoaded: false });

  // Selectors
  innovation = computed(() => this.state().innovation);
  isLoaded = computed(() => this.state().isLoaded);
  isArchived = computed(() => this.state().innovation?.status === InnovationStatusEnum.ARCHIVED ?? false);
  isOwner = computed(() => this.innovation().loggedUser.isOwner);

  isStateLoaded$ = new BehaviorSubject<boolean>(false);

  // Actions
  fetch$ = new Subject<{ innovationId: string; userContext: AuthenticationModel['userContext'] }>();
  update$ = new Subject<DeepPartial<ContextInnovationType>>();
  clear$ = new Subject<void>();

  constructor(private innovationService: InnovationContextService) {
    // Reducers
    this.fetch$
      .pipe(
        tap(() => {
          this.state.update(state => ({ ...state, isLoaded: false }));
          this.logState('fetch começou');
        }),
        switchMap(ctx => this.innovationService.getContextInfo(ctx.innovationId, ctx.userContext))
      )
      .subscribe(innovation => {
        this.state.update(state => ({ ...state, innovation, isLoaded: true }));
        // In angular 18 we could use some rxjs interop functions to use the signal.
        this.isStateLoaded$.next(true);
        this.logState('fetch concluido');
      });

    this.clear$.pipe(tap(() => this.logState('clear começou'))).subscribe(() => {
      this.state.update(() => ({ innovation: EMPTY_CONTEXT, isLoaded: false }));
      this.logState('clear concluido');
    });

    this.update$.pipe(tap(info => console.log('This is an update for the info:', info))).subscribe(info => {
      const dataToUpdate = omitBy<DeepPartial<ContextInnovationType>>(info, isNil);
      this.state.update(state => ({ ...state, innovation: { ...state.innovation, ...dataToUpdate } }));
    });

    // interval(60000).subscribe(() => this.logState('background refresh?'));
  }

  getOrLoadInnovation(
    innovationId: string,
    context: AuthenticationModel['userContext']
  ): Observable<ContextInnovationType> {
    const innovation = this.state().innovation;
    if (innovation && innovation.id === innovationId && Date.now() < innovation.expiryAt) {
      this.logState('getOrLoadInnovation returned state');
      return of(innovation);
    }

    this.fetch$.next({ innovationId, userContext: context });
    return this.isStateLoaded$.pipe(
      tap(() => this.logState('getOrLoadInnovation fetched state')),
      filter(() => this.state().isLoaded),
      switchMap(() => of(this.state().innovation)),
      take(1)
    );
  }

  private logState(action: string): void {
    console.log(`[InnovationStore]: ${action}`, this.state());
  }
}
