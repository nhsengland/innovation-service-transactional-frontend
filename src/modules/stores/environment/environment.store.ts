import { Injectable, OnDestroy } from '@angular/core';
import { forkJoin, Observable, Observer, of, Subscription } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { Store } from '../store.class';

import { EnvironmentService } from './environment.service';

import { EnvironmentModel } from './environment.models';

@Injectable()
export class EnvironmentStore extends Store<EnvironmentModel> implements OnDestroy {

  private subscriptions: Subscription[] = [];

  get ENV(): EnvironmentModel['ENV'] { return this.state.ENV; }

  constructor(
    private environmentService: EnvironmentService
  ) {
    super('store::environment', new EnvironmentModel());
  }


  initializeAuthentication$(): Observable<boolean> {

    return new Observable((observer: Observer<boolean>) => {

      this.environmentService.verifyUserSession().pipe(
        concatMap(() => this.environmentService.getUserInfo()),
        concatMap(response => {

          this.state.authentication.user = { ...response.user, ...{ innovations: [] } };
          this.state.authentication.isSignIn = true;

          return forkJoin([
            this.environmentService.verifyInnovator(response.user.id),
            this.environmentService.getInnovations(response.user.id)
          ]).pipe(
            map(([hasInnovator, innovations]) => {
              this.state.authentication.didFirstTimeSignIn = true;
              if (this.state.authentication.user) { this.state.authentication.user.innovations = innovations; }
              return true;
            }),
            catchError(() => of(true)) // Suppress error as this is only additional information.
          );

        })
      ).subscribe(
        () => {
          this.setState(this.state);
          observer.next(true);
          observer.complete();
        },
        () => {
          this.setState(this.state);
          observer.error(false);
          observer.complete();
        }
      );

    });

  }

  isUserAuthenticated$(): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      this.subscriptions.push(
        this.state$.subscribe(
          state => { observer.next(!!state.authentication.isSignIn); },
          error => { observer.error(error.error); }
        )
      );
    });
  }

  userDidFirstTimeSignIn(): boolean { return this.state.authentication.didFirstTimeSignIn || false; }

  getUserId(): string { return this.state.authentication.user?.id || ''; }

  getUserInfo(): Required<EnvironmentModel['authentication']>['user'] {
    return this.state.authentication.user || { id: '', displayName: '', innovations: [] };
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
