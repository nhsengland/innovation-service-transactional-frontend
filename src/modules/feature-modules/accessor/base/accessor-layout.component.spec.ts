import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { ENV } from '@tests/app.mocks';

import { CoreModule, AppInjector } from '@modules/core';

import { NotificationContextTypeEnum } from '@app/base/enums';
import { StoresModule, AuthenticationStore, ContextStore } from '@modules/stores';
import { AccessorModule } from '../accessor.module';

import { AccessorLayoutComponent } from './accessor-layout.component';


describe('FeatureModules/Accessor/AccessorLayoutComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;

  let authenticationStore: AuthenticationStore;
  let contextStore: ContextStore;

  let component: AccessorLayoutComponent;
  let fixture: ComponentFixture<AccessorLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AccessorModule
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

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(AccessorLayoutComponent);
    component = fixture.componentInstance;
    router.navigateByUrl('/'); // Simulate router navigation.
    expect(component).toBeTruthy();
  });

  // it('should have navigationMenuBar default values', () => {

  //   const expected = {
  //     leftItems: [
  //       { key: 'home', label: 'Home', link: '/accessor/dashboard' }
  //     ],
  //     rightItems: [
  //       { key: 'innovations', label: 'Innovations', link: '/accessor/innovations' },
  //       { key: 'notifications', label: 'Notifications', link: '/accessor/notifications' },
  //       { key: 'actions', label: 'Actions', link: '/accessor/actions', },
  //       { key: 'account', label: 'Account', link: '/accessor/account' },
  //       { key: 'signOut', label: 'Sign out', link: `http://demo.com/signout`, fullReload: true }
  //     ],
  //     notifications: { notifications: 0 }
  //   };

  //   fixture = TestBed.createComponent(AccessorLayoutComponent);
  //   component = fixture.componentInstance;

  //   expect(component.navigationMenuBar).toEqual(expected);

  // });

  // it('should have leftSideBar with no values', () => {

  //   activatedRoute.snapshot.data = { layoutOptions: { backLink: { url: '/', label: 'Go back' } } };
  //   authenticationStore.isValidUser = () => true;

  //   const expected = [] as any;

  //   fixture = TestBed.createComponent(AccessorLayoutComponent);
  //   component = fixture.componentInstance;

  //   (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
  //   expect(component.leftSideBar).toEqual(expected);

  // });

  // it('should have leftSideBar with "userAccountMenu" menu values', () => {

  //   activatedRoute.snapshot.data = { layoutOptions: { type: 'userAccountMenu' } };

  //   const expected = [
  //     { title: 'Your details', link: `/accessor/account/manage-details` },
  //     { title: 'Email notifications', link: `/accessor/account/email-notifications` },
  //     { title: 'Manage account', link: `/accessor/account/manage-account` }
  //   ];

  //   fixture = TestBed.createComponent(AccessorLayoutComponent);
  //   component = fixture.componentInstance;

  //   (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
  //   expect(component.leftSideBar).toEqual(expected);

  // });

  // it('should have leftSideBar with "innovationLeftAsideMenu" menu values', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'innovation01' };
  //   activatedRoute.snapshot.data = { layoutOptions: { type: 'innovationLeftAsideMenu' } };

  //   const expected = [
  //     { title: 'Overview', link: `/accessor/innovations/innovation01/overview` },
  //     { title: 'Innovation record', link: `/accessor/innovations/innovation01/record` },
  //     { title: 'Action tracker', link: `/accessor/innovations/innovation01/action-tracker`, notificationKey: NotificationContextTypeEnum.ACTION },
  //     // { title: 'Comments', link: `/accessor/innovations/innovation01/comments` },
  //     { title: 'Messages', link: `/accessor/innovations/innovation01/threads` },
  //     { title: 'Support status', link: `/accessor/innovations/innovation01/support` },
  //     { title: 'Activity log', link: `/accessor/innovations/innovation01/activity-log` }
  //   ];

  //   fixture = TestBed.createComponent(AccessorLayoutComponent);
  //   component = fixture.componentInstance;

  //   (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
  //   expect(component.leftSideBar).toEqual(expected);

  // });

  // it('should have leftSideBar with "emptyLeftAside" menu values', () => {

  //   activatedRoute.snapshot.data = { layoutOptions: { type: 'emptyLeftAside' } };
  //   authenticationStore.isValidUser = () => true;

  //   const expected = [] as any;

  //   fixture = TestBed.createComponent(AccessorLayoutComponent);
  //   component = fixture.componentInstance;

  //   (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
  //   expect(component.leftSideBar).toEqual(expected);

  // });

});
