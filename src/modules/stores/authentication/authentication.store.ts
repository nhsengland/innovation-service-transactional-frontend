import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { Store } from '../store.class';
import { AuthenticationService, UpdateUserInfoDTO } from './authentication.service';

import { UserRoleEnum } from './authentication.enums';
import { AuthenticationModel } from './authentication.models';
import { LocalStorageHelper } from '@app/base/helpers';

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
          this.state.user = user;
          this.state.isSignIn = true;
          const roles = [...new Set(user.roles.map(({ role }) => role))];

          if (roles.length === 1) {
            if (roles[0] === UserRoleEnum.ACCESSOR || roles[0] === UserRoleEnum.QUALIFYING_ACCESSOR) {
              if (user.organisations.length === 1 && user.organisations[0].organisationUnits.length === 1) {              
                this.state.userContext = {
                  type: roles[0],
                  organisation: {
                    id: user.organisations[0].id,
                    name: user.organisations[0].name,
                    organisationUnit: user.organisations[0].organisationUnits[0],
                  }
                }
              } 
            } else {
              this.state.userContext = {
                type: roles[0]
              }
            }
          }
          
          return of(true);
        })
      ).subscribe({
        next: () => {
          this.setState(this.state);
          observer.next(true);
          observer.complete();
        },
        error: (e) => {
          this.setState(this.state);
          observer.error(e);
          observer.complete();
        }
      });

    });

  }

  isSignIn(): boolean { return this.state.isSignIn; }
  isTermsOfUseAccepted(): boolean { return this.state.user?.termsOfUseAccepted ?? false; }
  isFirstTimeSignInDone(): boolean { return !!this.state.user?.firstTimeSignInAt ?? false; }
  hasInnovationTransfers(): boolean { return this.state.user?.hasInnovationTransfers || false; }

  isAccessorType(): boolean { return [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR].includes(this.state.userContext?.type as UserRoleEnum); }

  isInnovatorType(): boolean { return this.state.userContext?.type === UserRoleEnum.INNOVATOR; }
  isAssessmentType(): boolean { return this.state.userContext?.type === UserRoleEnum.ASSESSMENT; }
  isAccessorRole(): boolean { return this.state.userContext.type === UserRoleEnum.ACCESSOR; }
  isQualifyingAccessorRole(): boolean { return this.state.userContext.type === UserRoleEnum.QUALIFYING_ACCESSOR; }
  isAdminRole(): boolean { return this.state.userContext?.type.includes(UserRoleEnum.ADMIN) || false; }
  isServiceTeamRole(): boolean { return this.state.userContext?.type.includes(UserRoleEnum.SERVICE_TEAM) || false; }

  hasMultipleRoles(): boolean { return  (this.state.user && this.state.user?.roles.length > 1) ?? false; }
  
  getUserId(): string { return this.state.user?.id || ''; }
  getUserType(): Required<AuthenticationModel>['userContext']['type'] {
    return this.state.userContext.type || '';
  }

  getUserRole() {
    switch (this.state.userContext?.type) {
      case UserRoleEnum.ADMIN: return 'Administrator';
      case UserRoleEnum.ASSESSMENT: return 'Needs Assessor';
      case UserRoleEnum.INNOVATOR: return 'Innovator';
      case UserRoleEnum.ACCESSOR: 
      case UserRoleEnum.QUALIFYING_ACCESSOR: 
        return this.getRoleDescription(this.state.userContext?.type);
      default: return '';
    }
  }

  getAccessorOrganisationUnitName(): string {
    return this.state.userContext.organisation?.organisationUnit.name || '';
  }

  getUserInfo(): Required<AuthenticationModel>['user'] {
    return this.state.user || { id: '', email: '', displayName: '', roles: [], contactByEmail: false, contactByPhone: false, contactByPhoneTimeframe: null, phone: null, contactDetails: null, termsOfUseAccepted: false, hasInnovationTransfers: false, passwordResetAt: null, firstTimeSignInAt: null, organisations: [] };
  }

  updateUserInfo$(body: UpdateUserInfoDTO): Observable<{ id: string }> {
    return this.authenticationService.updateUserInfo(body);
  }

  getUserContextInfo(): Required<AuthenticationModel>['userContext'] {
    return this.state.userContext;
  }

  findAndPopulateUserContextFromLocalstorage(currentOrgUnitId: string): void {
    const user = this.getUserInfo();
    const currentRole = LocalStorageHelper.getObjectItem("role");

    user.organisations.every((org) => {
      const unit = org.organisationUnits.find((unit) => unit.id === currentOrgUnitId);

      if(!!unit) {
        this.updateSelectedUserContext({
          type: currentRole?.id,
          organisation: {
            id: org.id,
            name: org.name,
            organisationUnit: { 
              id: unit.id,
              name: unit.name, 
              acronym: unit.acronym,
            }
          }
        });
        return false;
      }

      return true;
    });
  }

  updateSelectedUserContext(userContext: Required<AuthenticationModel>['userContext']): void {
    this.state.userContext = userContext;
  }

  getUserTypeDescription(userType: UserRoleEnum): string {
    switch (userType) {
      case UserRoleEnum.ADMIN: return 'Administrator';
      case UserRoleEnum.ASSESSMENT: return 'Needs assessment';
      case UserRoleEnum.ACCESSOR: 
      case UserRoleEnum.QUALIFYING_ACCESSOR: 
        return 'Support assessment';
      case UserRoleEnum.INNOVATOR: return 'Innovator';
      default: return '';
    }
  }

  getRoleDescription(role: string): string {
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

  userUrlBasePath(): string {
    switch (this.getUserType()) {
      case UserRoleEnum.ADMIN: return 'admin';
      case UserRoleEnum.ASSESSMENT: return 'assessment';
      case UserRoleEnum.QUALIFYING_ACCESSOR: 
      case UserRoleEnum.ACCESSOR: 
        return 'accessor';
      case UserRoleEnum.INNOVATOR: return 'innovator';
      default: return '';
    }
  }

}
