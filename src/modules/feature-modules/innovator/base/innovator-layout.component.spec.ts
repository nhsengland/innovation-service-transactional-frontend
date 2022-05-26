import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';

import { ENV } from '@tests/app.mocks';
import { CONTEXT_INNOVATION_INFO, USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore, ContextStore } from '@modules/stores';
import { InnovatorModule } from '../innovator.module';

import { InnovatorLayoutComponent } from './innovator-layout.component';

import { NotificationsService } from '@modules/shared/services/notifications.service';


describe('FeatureModules/Innovator/InnovatorLayoutComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;

  let authenticationStore: AuthenticationStore;
  let contextStore: ContextStore;

  let notificationsService: NotificationsService;

  let component: InnovatorLayoutComponent;
  let fixture: ComponentFixture<InnovatorLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule
      ],
      providers: [
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);

    authenticationStore = TestBed.inject(AuthenticationStore);
    contextStore = TestBed.inject(ContextStore);
    notificationsService = TestBed.inject(NotificationsService);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;
    authenticationStore.isValidUser = () => true; // Needed so it passes the firstTimeSigninGuard.
    router.navigateByUrl('/'); // Simulate router navigation.
    expect(component).toBeTruthy();
  });

  it('should have notifications', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };

    authenticationStore.isValidUser = () => true;
    notificationsService.getAllUnreadNotificationsGroupedByContext = () => of({ INNOVATION: 1 });

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.mainMenuNotifications).toEqual({ INNOVATION: 1 });
    expect(component.notifications).toEqual({ INNOVATION: 1 });

  });

  it('should have navigationMenuBar values when route is NOT first-time-signin', () => {

    const expected = {
      leftItems: [
        { title: 'Home', link: '/innovator/dashboard' }
      ],
      rightItems: [
        { title: 'Your innovations', link: '/innovator/innovations' },
        { title: 'Your account', link: '/innovator/account' },
        { title: 'Sign out', link: `http://demo.com/signout`, fullReload: true }
      ]
    };

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.navigationMenuBar).toEqual(expected);

  });

  it('should have navigationMenuBar values when route is first-time-signin', () => {

    const expected = {
      leftItems: [],
      rightItems: [{ title: 'Sign out', link: `http://demo.com/signout`, fullReload: true }]
    };

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component as any).onRouteChange(new NavigationEnd(0, '/innovator/first-time-signin', '/'));
    expect(component.navigationMenuBar).toEqual(expected);

  });


  it('should have leftSideBar with no values', () => {

    activatedRoute.snapshot.data = { layoutOptions: { backLink: { url: '/', label: 'Go back' } } };
    authenticationStore.isValidUser = () => true;

    const expected = [] as any;

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.leftSideBar).toEqual(expected);

  });

  it('should have leftSideBar with "userAccountMenu" menu values', () => {

    activatedRoute.snapshot.data = { layoutOptions: { type: 'userAccountMenu' } };

    const expected = [
      { title: 'Your details', link: `/innovator/account/manage-details` },
      { title: 'Email notifications', link: `/innovator/account/email-notifications` },
      { title: 'Manage innovations', link: `/innovator/account/manage-innovations` },
      { title: 'Manage account', link: `/innovator/account/manage-account` }
    ];

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.leftSideBar).toEqual(expected);

  });

  it('should have leftSideBar with "innovationLeftAsideMenu" menu values', () => {

    activatedRoute.snapshot.params = { innovationId: 'innovation01' };
    activatedRoute.snapshot.data = { layoutOptions: { type: 'innovationLeftAsideMenu' } };

    const expected = [
      { title: 'Overview', link: `/innovator/innovations/innovation01/overview` },
      { title: 'Innovation record', link: `/innovator/innovations/innovation01/record` },
      { title: 'Action tracker', link: `/innovator/innovations/innovation01/action-tracker`, key: 'ACTION' },
      { title: 'Comments', link: `/innovator/innovations/innovation01/comments`, key: 'COMMENT' },
      { title: 'Data sharing and support', link: `/innovator/innovations/innovation01/support`, key: 'DATA_SHARING' },
      { title: 'Activity log', link: `/innovator/innovations/innovation01/activity-log` }
    ];

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.leftSideBar).toEqual(expected);

  });

  it('should have leftSideBar with "emptyLeftAside" menu values', () => {

    activatedRoute.snapshot.data = { layoutOptions: { type: 'emptyLeftAside' } };
    authenticationStore.isValidUser = () => true;

    const expected = [] as any;

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.leftSideBar).toEqual(expected);

  });

  // it('should show innovationHeaderBar with EMPTY innovation name', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.snapshot.data = { layoutOptions: { showInnovationHeader: true } };

  //   contextStore.getInnovation = () => ({ ...CONTEXT_INNOVATION_INFO, name: '' });

  //   const expected = { id: 'Inno01', name: null };

  //   fixture = TestBed.createComponent(InnovatorLayoutComponent);
  //   component = fixture.componentInstance;

  //   (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
  //   expect(component.innovationHeaderBar).toEqual(expected);

  // });

  it('should show innovationHeaderBar with ALL information', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    activatedRoute.snapshot.data = { layoutOptions: { showInnovationHeader: true } };

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;
    contextStore.getInnovation = () => CONTEXT_INNOVATION_INFO;

    const expected = { id: 'Inno01', name: 'Test innovation' };

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    fixture.detectChanges();
    expect(component.innovationHeaderBar).toEqual(expected);

  });

  it('should have innovationHeaderBar with no values, hence NOT showing', () => {

    activatedRoute.snapshot.data = { layoutOptions: {} };

    const expected = { id: null, name: null };

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.innovationHeaderBar).toEqual(expected);

  });

});
