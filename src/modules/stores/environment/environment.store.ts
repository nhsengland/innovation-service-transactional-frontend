import { Injectable, OnDestroy } from '@angular/core';
// import { Title } from '@angular/platform-browser';
// import { Router, NavigationEnd } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable, Observer, of, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Store } from '../store.class';

import { EnvironmentService } from './environment.service';

import { EnvironmentModel } from './environment.models';



@Injectable()
export class EnvironmentStore extends Store<EnvironmentModel> implements OnDestroy {

  private subscriptions: Subscription[] = [];

  get ENV(): any { return this.state.ENV; }
  // get CONSTANTS() { return this.state.CONSTANTS; }

  constructor(
    private environmentService: EnvironmentService
  ) {
    super('store::environment', new EnvironmentModel());
  }

  initializeStore$(): Observable<boolean> {

    this.ngOnDestroy(); // Cleanup all subscriptions from prior usages.

    const subscription$: Subject<boolean> = new Subject<boolean>();

    // this.titleService.setTitle(this.translateService.instant('app.title')); // Can only be setted after translations initialization.

    this.populateAuthenticationInfo();

    return new Observable((observer: Observer<boolean>) => {
      this.state$.pipe(takeUntil(subscription$)).subscribe(state => {

        if ( // To this store be proper initialized it has to:
          state.authentication // Has authentication info!
        ) {
          subscription$.next(true);
          subscription$.unsubscribe(); // Unsubscribe own subscription.
          observer.next(true);
          observer.complete(); // Complete observable.
        }
      });
    });

    // return of(true)

  }



  private populateAuthenticationInfo(): void {
    this.environmentService.getUserInfo().subscribe(
      result => {
        this.state.authentication = result;
        this.setState(this.state);
      },
      () => {
        this.state.authentication = null;
        this.setState(this.state);
      }
    );
  }


  // clearStore(): void {
  //   this.setState(new EnvironmentModel());
  // }

  isAuthenticated$(): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      this.subscriptions.push(
        this.state$.subscribe(state => {
            observer.next(!!state.authentication?.user.id);
            // observer.complete();
          },
          error => {
            observer.error(error.error);
            // observer.complete();
          }
        )
      );
    });
  }

  getAuthenticationInfo(): EnvironmentModel['authentication'] {
    return this.state.authentication;
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
