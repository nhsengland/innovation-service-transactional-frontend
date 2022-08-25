import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { ENV } from '@tests/app.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore, EnvironmentStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation';
import { NotificationsService } from '@modules/shared/services/notifications.service';

import { AssessmentModule } from '../assessment.module';

import { AssessmentLayoutComponent } from './assessment-layout.component';

import { CONTEXT_INNOVATION_INFO } from '@tests/data.mocks';


describe('FeatureModules/Assessment/AssessmentLayoutComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;

  let authenticationStore: AuthenticationStore;
  let environmentStore: EnvironmentStore;
  let notificationsService: NotificationsService;

  let component: AssessmentLayoutComponent;
  let fixture: ComponentFixture<AssessmentLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AssessmentModule
      ],
      providers: [
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);

    authenticationStore = TestBed.inject(AuthenticationStore);
    environmentStore = TestBed.inject(EnvironmentStore);
    notificationsService = TestBed.inject(NotificationsService);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;
    router.navigateByUrl('/'); // Simulate router navigation.
    expect(component).toBeTruthy();
  });


  it('should have navigationMenuBar default values', () => {

    const expected = {
      leftItems: [
        { key: 'home', label: 'Home', link: '/assessment/dashboard' }
      ],
      rightItems: [
        { key: 'innovations', label: 'Innovations', link: '/assessment/innovations' },
        { key: 'notifications', label: 'Notifications', link: '/assessment/notifications' },
        { key: 'account', label: 'Account', link: '/assessment/account' },
        { key: 'signOut', label: 'Sign out', link: `http://demo.com/signout`, fullReload: true }
      ],
      notifications: { notifications: 0 }
    };

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;

    expect(component.navigationMenuBar).toEqual(expected);

  });

  it('should have leftSideBar with no values', () => {

    activatedRoute.snapshot.data = { layoutOptions: { backLink: { url: '/', label: 'Go back' } } };
    authenticationStore.isValidUser = () => true;

    const expected = [] as any;

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.leftSideBar).toEqual(expected);

  });

  it('should have leftSideBar with "userAccountMenu" menu values', () => {

    activatedRoute.snapshot.data = { layoutOptions: { type: 'userAccountMenu' } };

    const expected = [
      { title: 'Your details', link: `/assessment/account/manage-details` },
      { title: 'Manage account', link: `/assessment/account/manage-account` }
    ];

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.leftSideBar).toEqual(expected);

  });

  it('should have leftSideBar with "innovationLeftAsideMenu" menu values WITH innovation status IN_PROGRESS', () => {

    activatedRoute.snapshot.params = { innovationId: 'innovation01', status: '' };
    activatedRoute.snapshot.data = { layoutOptions: { type: 'innovationLeftAsideMenu' } };

    environmentStore.getInnovation = () => ({ ...CONTEXT_INNOVATION_INFO, status: InnovationStatusEnum.IN_PROGRESS });

    const expected = [
      { title: 'Overview', link: `/assessment/innovations/innovation01/overview` },
      { title: 'Innovation record', link: `/assessment/innovations/innovation01/record` },
      // { title: 'Comments', link: `/assessment/innovations/innovation01/comments` },
      { title: 'Messages', link: `/assessment/innovations/innovation01/threads` },
      { title: 'Support status', link: `/assessment/innovations/innovation01/support` },
      // { title: 'Action tracker', link: `/assessment/innovations/innovation01/action-tracker` },
      { title: 'Activity log', link: `/assessment/innovations/innovation01/activity-log` }
    ];

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.leftSideBar).toEqual(expected);
  });

  it('should have leftSideBar with "innovationLeftAsideMenu" menu values WITH innovation status != IN_PROGRESS', () => {

    activatedRoute.snapshot.params = { innovationId: 'innovation01', status: '' };
    activatedRoute.snapshot.data = { layoutOptions: { type: 'innovationLeftAsideMenu' }, innovationData: { status: '' } };

    environmentStore.getInnovation = () => ({ ...CONTEXT_INNOVATION_INFO, status: InnovationStatusEnum.CREATED });

    const expected = [
      { title: 'Overview', link: `/assessment/innovations/innovation01/overview` },
      { title: 'Innovation record', link: `/assessment/innovations/innovation01/record` },
      // { title: 'Support status', link: `/assessment/innovations/innovation01/support` },
      // { title: 'Action tracker', link: `/assessment/innovations/innovation01/action-tracker` },
      // { title: 'Comments', link: `/assessment/innovations/innovation01/comments` },
      { title: 'Messages', link: `/assessment/innovations/innovation01/threads` },
      { title: 'Activity log', link: `/assessment/innovations/innovation01/activity-log` }
    ];

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.leftSideBar).toEqual(expected);
  });

  it('should have leftSideBar with "emptyLeftAside" menu values', () => {

    activatedRoute.snapshot.data = { layoutOptions: { type: 'emptyLeftAside' } };
    authenticationStore.isValidUser = () => true;

    const expected = [] as any;

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.leftSideBar).toEqual(expected);

  });

});
