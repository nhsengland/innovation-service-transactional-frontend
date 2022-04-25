import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { MappedObject } from '@modules/core/interfaces/base.interfaces';

import { Store } from '../store.class';
import { AuthenticationService, saveUserInfoDTO } from './authentication.service';

import { AuthenticationModel } from './authentication.models';


@Injectable()
export class AuthenticationStore extends Store<AuthenticationModel> {

  constructor(
    private authenticationService: AuthenticationService
  ) {
    super('store::authentication', new AuthenticationModel());
  }


  initializeAuthentication$(): Observable<boolean> {

    return new Observable((observer: Observer<boolean>) => {

      this.authenticationService.verifyUserSession().pipe(
        concatMap(() => this.authenticationService.getUserInfo()),
        concatMap(user => {
          this.state.user = { ...user, ...{ innovations: [] } };
          this.state.isSignIn = true;
          return of(true);
        }),
        concatMap(() => this.authenticationService.verifyInnovator()),
        concatMap(innovatorInfo => {
          this.state.isValidUser = innovatorInfo.userExists;
          this.state.hasInnovationTransfers = innovatorInfo.hasInvites;
          return of(true);
        }),
        concatMap(() => {

          if (this.state.user!.type !== 'INNOVATOR') {
            return of(true); // Suppress error as this is only additional information.
          }

          return this.authenticationService.getInnovations(this.state.user!.id).pipe(
            map(innovations => {
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

  isSignIn(): boolean { return this.state.isSignIn; }
  isValidUser(): boolean { return this.state.isValidUser || false; }
  hasInnovationTransfers(): boolean { return this.state.hasInnovationTransfers || false; }

  isInnovatorType(): boolean { return this.state.user?.type === 'INNOVATOR'; }
  isAccessorType(): boolean { return this.state.user?.type === 'ACCESSOR'; }
  isAssessmentType(): boolean { return this.state.user?.type === 'ASSESSMENT'; }

  isAccessorRole(): boolean { return this.state.user?.organisations[0].role === 'ACCESSOR'; }
  isQualifyingAccessorRole(): boolean { return this.state.user?.organisations[0].role === 'QUALIFYING_ACCESSOR'; }

  isAdminRole(): boolean { return this.state.user?.roles.includes('ADMIN') || false; }
  isServiceTeamRole(): boolean { return this.state.user?.roles.includes('SERVICE_TEAM') || false; }

  getUserId(): string { return this.state.user?.id || ''; }
  getUserType(): Required<AuthenticationModel>['user']['type'] {
    return this.state.user?.type || '';
  }

  getAccessorOrganisationUnitName(): string {
    return (this.state.user?.organisations[0]?.organisationUnits || [])[0]?.name || '';
  }

  getUserInfo(): Required<AuthenticationModel>['user'] {
    return this.state.user || { id: '', email: '', displayName: '', type: '', roles: [], organisations: [], innovations: [], passwordResetOn: '', phone: '' };
  }

  saveUserInfo$(body: MappedObject): Observable<{ id: string }> {
    return this.authenticationService.saveUserInfo(body as saveUserInfoDTO);
  }

  getRoleDescription(role: 'ADMIN' | 'INNOVATOR_OWNER' | 'ASSESSMENT' | 'INNOVATOR' | 'ACCESSOR' | 'QUALIFYING_ACCESSOR'): string {
    switch (role) {
      case 'ADMIN': return 'Administrator';
      case 'INNOVATOR_OWNER': return 'Owner';
      case 'ASSESSMENT': return 'Needs Assessor';
      case 'INNOVATOR': return 'Innovator';
      case 'ACCESSOR': return 'Accessor';
      case 'QUALIFYING_ACCESSOR': return 'Qualifying Accessor';
      default: return '';
    }
  }

}
