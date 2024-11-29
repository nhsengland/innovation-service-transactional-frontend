import { Inject, Injectable, PLATFORM_ID, computed, signal } from '@angular/core';
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
import { DomainUserContext, EMPTY_USER_INFO, UserContextType, UserInfo } from './user.types';
import { UpdateUserInfo, UserContextService } from './user.service';
import { LocalStorageHelper } from '@app/base/helpers';
import { UserRoleEnum } from '@app/base/enums';
import { isPlatformBrowser } from '@angular/common';
import { EnvironmentVariablesStore } from '@modules/core';
import { DeepPartial } from '@app/base/types';
import { isUndefined, omitBy } from 'lodash';

@Injectable()
export class UserContextStore {
  // State
  private state = signal<UserContextType>({
    user: EMPTY_USER_INFO,
    domainContext: null,
    isStateLoaded: false,
    expiresAt: 0
  });

  // Selectors
  getUserInfo = computed(() => this.state().user);
  getUserContext = computed(() => this.state().domainContext);

  isTermsOfUseAccepted = computed(() => this.getUserInfo().termsOfUseAccepted);
  isFirstTimeSignInDone = computed(() => !!this.getUserInfo().firstTimeSignInAt);
  hasInnovationTransfers = computed(() => this.getUserInfo().hasInnovationTransfers);
  hasInnovationCollaborations = computed(() => this.getUserInfo().hasInnovationCollaborations);
  hasAnnouncements = computed(() => this.mapHasAnnouncements(this.getUserInfo(), this.getUserType()));

  getUserId = computed(() => this.getUserInfo().id);
  getUserType = computed(() => this.getUserContext()?.type); // TODO: Change this to be role instead of type.
  getUserRoleTranslation = computed(() => this.getRoleDescription(this.getUserType() ?? ''));
  getDisplayName = computed(() => this.getUserInfo().displayName);
  hasMultipleRoles = computed(() => this.getUserInfo().roles.length > 1);
  getAccessorUnitName = computed(() => this.getUserContext()?.organisationUnit?.name);

  isAccessorType = computed(() =>
    [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR].includes(this.getUserType() as UserRoleEnum)
  );
  isInnovator = computed(() => this.getUserType() === UserRoleEnum.INNOVATOR);
  isAssessment = computed(() => this.getUserType() === UserRoleEnum.ASSESSMENT);
  isAccessor = computed(() => this.getUserType() === UserRoleEnum.ACCESSOR);
  isQualifyingAccessor = computed(() => this.getUserType() === UserRoleEnum.QUALIFYING_ACCESSOR);
  isAdmin = computed(() => this.getUserType() === UserRoleEnum.ADMIN);
  isAccessorOrAssessment = computed(() => this.isAccessorType() || this.isAssessment());

  userUrlBasePath = computed(() => this.mapUserUrlBasePath(this.getUserType()));

  // // State
  isStateLoaded = computed(() => this.state().isStateLoaded);
  isStateLoaded$ = toObservable(this.isStateLoaded);
  hasError = computed(() => this.state().error);
  hasError$ = toObservable(this.hasError);

  // Actions
  fetch$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private envVariablesStore: EnvironmentVariablesStore,
    private userCtxService: UserContextService
  ) {
    // Reducers
    this.fetch$
      .pipe(
        debounceTime(100),
        tap(() => {
          this.state.update(state => ({ ...state, isStateLoaded: false, error: undefined }));
        }),
        switchMap(() =>
          this.userCtxService.getUserInfo().pipe(
            catchError(error => {
              this.state.update(state => ({ ...state, error }));
              return of(null);
            })
          )
        )
      )
      .subscribe(user => {
        if (user) {
          this.state.update(state => ({
            ...state,
            user,
            isStateLoaded: true
          }));
          this.calculateUserContext(user);
        }
      });
  }

  initializeAuthentication$(): Observable<boolean> {
    this.fetch$.next();
    return combineLatest([this.isStateLoaded$, this.hasError$]).pipe(
      filter(() => this.isStateLoaded() || this.hasError() !== undefined),
      switchMap(() => {
        if (this.hasError()) {
          return throwError(() => this.hasError());
        }
        return of(true);
      }),
      take(1)
    );
  }

  // TODO: try to make this payload match the UserContextType so we don't need to make a new initializeAuth on call.
  updateUserInfo$(body: UpdateUserInfo): Observable<{ id: string }> {
    return this.userCtxService.updateUserInfo(body);
  }

  verifyUserSession$(): Observable<boolean> {
    return this.userCtxService.verifyUserSession();
  }

  updateInfo(info: DeepPartial<UserContextType['user']>): void {
    const dataToUpdate = omitBy<DeepPartial<UserContextType>>(info, isUndefined);
    this.state.update(state => ({ ...state, user: { ...state.user, ...dataToUpdate } }));
  }

  clear(): void {
    this.state.set({
      user: EMPTY_USER_INFO,
      domainContext: null,
      isStateLoaded: false,
      error: undefined,
      expiresAt: 0
    });
  }

  signOut(): void {
    LocalStorageHelper.removeItem('userContext');
    sessionStorage.clear();
    window.location.replace(`${this.envVariablesStore.APP_URL}/signout`); // Full reload to hit SSR.
  }

  setUserContext(domainContext: UserContextType['domainContext']): void {
    if (isPlatformBrowser(this.platformId)) {
      if (domainContext) {
        LocalStorageHelper.setObjectItem('userContext', domainContext);
      } else {
        LocalStorageHelper.removeItem('userContext');
      }
    }
    this.state.update(state => ({ ...state, domainContext }));
  }

  getRoleDescription(role: string, plural = false): string {
    switch (role) {
      case 'ADMIN':
        return !plural ? 'Administrator' : 'Administrators';
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

  private calculateUserContext(user: UserInfo): void {
    let context: null | DomainUserContext = null;
    if (user.roles.length === 1) {
      context = {
        id: user.id,
        roleId: user.roles[0].id,
        type: user.roles[0].role,
        ...(user.roles[0].organisation && { organisation: user.roles[0].organisation }),
        ...(user.roles[0].organisationUnit && { organisationUnit: user.roles[0].organisationUnit })
      };
    }

    // Check on local storage
    const currentRole = LocalStorageHelper.getObjectItem<DomainUserContext>('userContext');
    if (currentRole && user.roles.find(i => i.id === currentRole.roleId)) {
      context = currentRole;
    }

    this.setUserContext(context);
  }

  private mapUserUrlBasePath(userType?: UserRoleEnum): string {
    switch (userType) {
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

  private mapHasAnnouncements(userInfo: UserInfo, role?: UserRoleEnum) {
    const hasLoginAnnouncements = userInfo.hasLoginAnnouncements;
    if (role && hasLoginAnnouncements) {
      return hasLoginAnnouncements[role] ?? false;
    }
    return false;
  }
}
