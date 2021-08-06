import { Injectable } from '@angular/core';
import { forkJoin, Observable, Observer, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { MappedObject } from '@modules/core/interfaces/base.interfaces';
import { LoggerService, Severity } from '@modules/core/services/logger.service';

import { Store } from '../store.class';
import { AuthenticationService, saveUserInfoDTO } from './authentication.service';

import { AuthenticationModel } from './authentication.models';


@Injectable()
export class AuthenticationStore extends Store<AuthenticationModel> {

  constructor(
    private authenticationService: AuthenticationService,
    private loggerService: LoggerService,
  ) {
    super('store::authentication', new AuthenticationModel());
  }


  initializeAuthentication$(): Observable<boolean> {

    return new Observable((observer: Observer<boolean>) => {

      // this.loggerService.trackTrace('[Auth Store] initializeAuthentication called', Severity.INFORMATION);

      this.authenticationService.verifyUserSession().pipe(
        concatMap(() => this.authenticationService.getUserInfo()),
        concatMap(user => {

          // this.loggerService.trackTrace('[Auth Store] initializeAuthentication mapped User', Severity.INFORMATION, { user });

          this.state.user = { ...user, ...{ innovations: [] } };
          this.state.isSignIn = true;

          return forkJoin([
            this.authenticationService.verifyInnovator(user.id),
            this.authenticationService.getInnovations(user.id)
          ]).pipe(
            map(([hasInnovator, innovations]) => {

              // this.loggerService.trackTrace('[Auth Store] initializeAuthentication first time sign in assessment', Severity.INFORMATION, { hasInnovator, innovations });

              this.state.didFirstTimeSignIn = hasInnovator;
              if (this.state.user) { this.state.user.innovations = innovations; }

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
        (e) => {
          this.setState(this.state);
          observer.error(e);
          observer.complete();
        }
      );

    });

  }


  isInnovatorType(): boolean { return this.state.user?.type === 'INNOVATOR'; }
  isAccessorType(): boolean { return this.state.user?.type === 'ACCESSOR'; }
  isAssessmentType(): boolean { return this.state.user?.type === 'ASSESSMENT'; }

  isAccessorRole(): boolean { return this.state.user?.organisations[0].role === 'ACCESSOR'; }
  isQualifyingAccessorRole(): boolean { return this.state.user?.organisations[0].role === 'QUALIFYING_ACCESSOR'; }

  didFirstTimeSignIn(): boolean { return this.state.didFirstTimeSignIn || false; }

  getUserId(): string { return this.state.user?.id || ''; }
  getUserType(): Required<AuthenticationModel>['user']['type'] {
    return this.state.user?.type || '';
  }

  getAccessorOrganisationUnitName(): string {
    return (this.state.user?.organisations[0]?.organisationUnits || [])[0]?.name || '';
  }

  getUserInfo(): Required<AuthenticationModel>['user'] {
    return this.state.user || { id: '', email: '', displayName: '', type: '', organisations: [], innovations: [] };
  }

  saveUserInfo$(body: MappedObject): Observable<{ id: string }> {
    return this.authenticationService.saveUserInfo(body as saveUserInfoDTO);
  }

  getRoleDescription(role: 'OWNER' | 'ASSESSMENT' | 'INNOVATOR' | 'ACCESSOR' | 'QUALIFYING_ACCESSOR'): string {
    switch (role) {
      case 'OWNER': return 'Owner';
      case 'ASSESSMENT': return 'Assessment';
      case 'INNOVATOR': return 'Innovator';
      case 'ACCESSOR': return 'Accessor';
      case 'QUALIFYING_ACCESSOR': return 'Qualifying accessor';
      default: return '';
    }
  }

}
