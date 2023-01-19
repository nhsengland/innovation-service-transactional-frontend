import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { Store } from '../store.class';
import { AuthenticationService, UpdateUserInfoDTO } from './authentication.service';

import { UserRoleEnum, UserTypeEnum } from './authentication.enums';
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

          if (user.type === UserTypeEnum.ACCESSOR) {
            if (user.organisations.length === 1 && user.organisations[0].organisationUnits.length === 1) {              
              this.state.userContext = {
                type: user.type,
                organisation: {
                  id: user.organisations[0].id,
                  name: user.organisations[0].name,
                  role: user.organisations[0].role,
                  organisationUnit: user.organisations[0].organisationUnits[0],
                }
              }
            } else {
              const currentOrgUnitId = LocalStorageHelper.getObjectItem("orgUnitId");
              
              if(!!currentOrgUnitId) {
                this.findAndPopulateUserContextFromLocalstorage(currentOrgUnitId.id);
              }
            }
          } else {
            this.state.userContext = {
              type: user.type
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

  isInnovatorType(): boolean { return this.state.user?.type === 'INNOVATOR'; }
  isAccessorType(): boolean { return this.state.user?.type === 'ACCESSOR'; }
  isAssessmentType(): boolean { return this.state.user?.type === 'ASSESSMENT'; }

  isAccessorRole(): boolean { return this.state.user?.organisations[0].role === 'ACCESSOR'; }
  isQualifyingAccessorRole(): boolean { return this.state.user?.organisations[0].role === 'QUALIFYING_ACCESSOR'; }

  isAdminRole(): boolean { return this.state.user?.roles.includes(UserRoleEnum.ADMIN) || false; }
  isServiceTeamRole(): boolean { return this.state.user?.roles.includes(UserRoleEnum.SERVICE_TEAM) || false; }

  getUserId(): string { return this.state.user?.id || ''; }
  getUserType(): Required<AuthenticationModel>['user']['type'] {
    return this.state.user?.type || '';
  }
  getUserRole() {
    switch (this.state.user?.type) {
      case UserTypeEnum.ADMIN: return 'Administrator';
      case UserTypeEnum.ASSESSMENT: return 'Needs assessment';
      case UserTypeEnum.INNOVATOR: return 'Innovator';
      case UserTypeEnum.ACCESSOR: return this.getRoleDescription(this.state.user.organisations.map(org => org.role)[0]);
      default: return '';
    }
  }

  getAccessorOrganisationUnitName(): string {
    return this.state.userContext.organisation?.organisationUnit.name || '';
  }

  getUserInfo(): Required<AuthenticationModel>['user'] {
    return this.state.user || { id: '', email: '', displayName: '', type: '', roles: [], phone: null, termsOfUseAccepted: false, hasInnovationTransfers: false, passwordResetAt: null, firstTimeSignInAt: null, organisations: [] };
  }

  updateUserInfo$(body: UpdateUserInfoDTO): Observable<{ id: string }> {
    return this.authenticationService.updateUserInfo(body);
  }

  getUserContextInfo(): Required<AuthenticationModel>['userContext'] {
    return this.state.userContext;
  }

  findAndPopulateUserContextFromLocalstorage(currentOrgUnitId: string): void {
    const user = this.getUserInfo();

    user.organisations.every((org) => {
      const unit = org.organisationUnits.find((unit) => unit.id === currentOrgUnitId);

      if(!!unit) {
        this.updateSelectedUserContext({
          type: user.type,
          organisation: {
            id: org.id,
            name: org.name,
            role: org.role,
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

  getUserTypeDescription(userType: UserTypeEnum): string {
    switch (userType) {
      case UserTypeEnum.ADMIN: return 'Administrator';
      case UserTypeEnum.ASSESSMENT: return 'Needs assessment';
      case UserTypeEnum.ACCESSOR: return 'Support assessment';
      case UserTypeEnum.INNOVATOR: return 'Innovator';
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
      case UserTypeEnum.ADMIN: return 'admin';
      case UserTypeEnum.ASSESSMENT: return 'assessment';
      case UserTypeEnum.ACCESSOR: return 'accessor';
      case UserTypeEnum.INNOVATOR: return 'innovator';
      default: return '';
    }
  }

}
