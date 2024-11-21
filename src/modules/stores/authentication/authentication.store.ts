import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { LocalStorageHelper } from '@modules/core/helpers/local-storage.helper';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';

import { Store } from '../store.class';

import { UserRoleEnum } from './authentication.enums';
import { AuthenticationModel } from './authentication.models';
import { AuthenticationService, MFAInfoDTO, UpdateUserInfoDTO } from './authentication.service';

@Injectable()
export class AuthenticationStore extends Store<AuthenticationModel> {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private envVariablesStore: EnvironmentVariablesStore,
    private authenticationService: AuthenticationService
  ) {
    super('store::authentication', new AuthenticationModel());
  }

  initializeAuthentication$(): Observable<boolean> {
    return this.authenticationService.getUserInfo().pipe(
      tap(user => {
        this.state.user = user;
        this.state.isSignIn = true;

        if (user.roles.length === 1) {
          this.setUserContext({
            id: user.id,
            roleId: user.roles[0].id,
            type: user.roles[0].role,
            ...(user.roles[0].organisation && { organisation: user.roles[0].organisation }),
            ...(user.roles[0].organisationUnit && { organisationUnit: user.roles[0].organisationUnit })
          });
        } else {
          this.setUserContextFromStorage();
        }
      }),
      tap(() => this.setState(this.state)),
      map(() => true),
      catchError(error => {
        this.setState(this.state);
        return throwError(() => error);
      })
    );
  }

  signOut() {
    LocalStorageHelper.removeItem('userContext');
    sessionStorage.clear();
    window.location.replace(`${this.envVariablesStore.APP_URL}/signout`); // Full reload to hit SSR.
  }

  isSignIn(): boolean {
    return this.state.isSignIn;
  }
  isTermsOfUseAccepted(): boolean {
    return this.state.user?.termsOfUseAccepted ?? false;
  }
  isFirstTimeSignInDone(): boolean {
    return !!this.state.user?.firstTimeSignInAt;
  }
  hasInnovationTransfers(): boolean {
    return this.state.user?.hasInnovationTransfers ?? false;
  }
  hasInnovationCollaborations(): boolean {
    return this.state.user?.hasInnovationCollaborations ?? false;
  }
  hasAnnouncements(): boolean {
    const role = this.state.userContext?.type;
    const hasLoginAnnouncements = this.state.user?.hasLoginAnnouncements;
    if (role && hasLoginAnnouncements) {
      return hasLoginAnnouncements[role] ?? false;
    }
    return false;
  }

  isAccessorType(): boolean {
    return [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR].includes(
      this.state.userContext?.type as UserRoleEnum
    );
  }

  isInnovatorType(): boolean {
    return this.state.userContext?.type === UserRoleEnum.INNOVATOR;
  }
  isAssessmentType(): boolean {
    return this.state.userContext?.type === UserRoleEnum.ASSESSMENT;
  }
  isAccessorRole(): boolean {
    return this.state.userContext?.type === UserRoleEnum.ACCESSOR;
  }
  isQualifyingAccessorRole(): boolean {
    return this.state.userContext?.type === UserRoleEnum.QUALIFYING_ACCESSOR;
  }
  isAdminRole(): boolean {
    return this.state.userContext?.type === UserRoleEnum.ADMIN;
  }
  // remove and or change logic to use the other roles
  // isServiceTeamRole(): boolean { return this.state.userContext?.type.includes(UserRoleEnum.SERVICE_TEAM) || false; }

  isFromOrganisationUnit(orgUnitId?: string): boolean {
    return orgUnitId !== undefined && this.state.userContext?.organisationUnit?.id === orgUnitId;
  }

  hasMultipleRoles(): boolean {
    return (this.state.user && this.state.user?.roles.length > 1) ?? false;
  }

  getUserId(): string {
    return this.state.user?.id || '';
  }
  getUserType(): UserRoleEnum | undefined {
    return this.state.userContext?.type;
  }

  getUserRole() {
    switch (this.state.userContext?.type) {
      case UserRoleEnum.ADMIN:
        return 'Administrator';
      case UserRoleEnum.ASSESSMENT:
        return 'Needs Assessor';
      case UserRoleEnum.INNOVATOR:
        return 'Innovator';
      case UserRoleEnum.ACCESSOR:
      case UserRoleEnum.QUALIFYING_ACCESSOR:
        return this.getRoleDescription(this.state.userContext?.type);
      default:
        return '';
    }
  }

  getAccessorOrganisationUnitName(): string {
    return this.state.userContext?.organisationUnit?.name || '';
  }

  getUserInfo(): Required<AuthenticationModel>['user'] {
    return (
      this.state.user || {
        id: '',
        email: '',
        displayName: '',
        roles: [],
        contactByEmail: false,
        contactByPhone: false,
        contactByPhoneTimeframe: null,
        phone: null,
        contactDetails: null,
        termsOfUseAccepted: false,
        hasInnovationTransfers: false,
        hasInnovationCollaborations: false,
        hasLoginAnnouncements: {},
        passwordResetAt: null,
        firstTimeSignInAt: null,
        organisations: []
      }
    );
  }

  userPasswordSuccessfullyUpdated() {
    if (this.state.user) {
      this.state.user.passwordChangeSinceLastSignIn = true;
    }
  }

  updateUserInfo$(body: UpdateUserInfoDTO): Observable<{ id: string }> {
    return this.authenticationService.updateUserInfo(body);
  }

  updateMfaInfo$(body: MFAInfoDTO): Observable<void> {
    return this.authenticationService.updateUserMFAInfo(body);
  }

  getUserContextInfo(): AuthenticationModel['userContext'] {
    return this.state.userContext;
  }

  setUserContextFromStorage(): void {
    const currentRole = LocalStorageHelper.getObjectItem<AuthenticationModel['userContext']>('userContext');

    if (currentRole && this.state.user?.roles.find(i => i.id === currentRole.roleId)) {
      this.setUserContext(currentRole);
    } else {
      this.state.userContext = undefined;
    }
  }

  setUserContext(userContext: Required<AuthenticationModel>['userContext']): void {
    if (isPlatformBrowser(this.platformId)) {
      LocalStorageHelper.setObjectItem('userContext', userContext);
    }

    this.state.userContext = userContext;
  }

  getRoleDescription(role: string, plural = false): string {
    switch (role) {
      case 'ADMIN':
        return !plural ? 'Administrator' : 'Administrators';
      // Think this one is not used
      case 'INNOVATOR_OWNER':
        return !plural ? 'Owner' : 'Owners';
      case 'ASSESSMENT':
        return !plural ? 'Needs assessor' : 'Needs assessors';
      case 'INNOVATOR':
        return !plural ? 'Innovator' : 'Innovators';
      case 'ACCESSOR':
        return !plural ? 'Accessor' : 'Accessors';
      case 'QUALIFYING_ACCESSOR':
        return !plural ? 'Qualifying accessor' : 'Qualifying accessors';
      default:
        return '';
    }
  }

  userUrlBasePath(): string {
    switch (this.getUserType()) {
      case UserRoleEnum.ADMIN:
        return 'admin';
      case UserRoleEnum.ASSESSMENT:
        return 'assessment';
      case UserRoleEnum.QUALIFYING_ACCESSOR:
      case UserRoleEnum.ACCESSOR:
        return 'accessor';
      case UserRoleEnum.INNOVATOR:
        return 'innovator';
      default:
        return '';
    }
  }
}
