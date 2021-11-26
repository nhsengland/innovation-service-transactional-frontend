import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';

import { ENV } from '@tests/app.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { AssessmentModule } from '../assessment.module';

import { AssessmentLayoutComponent } from './assessment-layout.component';

import { NotificationsService } from '@modules/shared/services/notifications.service';


describe('FeatureModules/Assessment/AssessmentLayoutComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;

  let authenticationStore: AuthenticationStore;
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
        { title: 'Home', link: '/assessment/dashboard' }
      ],
      rightItems: [
        { title: 'Innovations', link: '/assessment/innovations', key: 'INNOVATION' },
        { title: 'Account', link: '/assessment/account' },
        { title: 'Sign out', link: `http://demo.com/signout`, fullReload: true }
      ]
    };

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;

    expect(component.navigationMenuBar).toEqual(expected);

  });

  it('should have notifications', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };

    authenticationStore.isValidUser = () => true;
    notificationsService.getAllUnreadNotificationsGroupedByContext = () => of({ INNOVATION: 1 });

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.mainMenuNotifications).toEqual({ INNOVATION: 1 });

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
      { title: 'Your details', link: `/assessment/account/manage-details` }
    ];

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
    expect(component.leftSideBar).toEqual(expected);

  });

  it('should have leftSideBar with "innovationLeftAsideMenu" menu values WITH innovation status IN_PROGRESS', () => {

    activatedRoute.snapshot.params = { innovationId: 'innovation01', status: '' };
    activatedRoute.snapshot.data = { layoutOptions: { type: 'innovationLeftAsideMenu' }, innovationData: { status: 'IN_PROGRESS' } };

    const expected = [
      { title: 'Overview', link: `/assessment/innovations/innovation01/overview` },
      { title: 'Innovation record', link: `/assessment/innovations/innovation01/record` },
      { title: 'Comments', link: `/assessment/innovations/innovation01/comments` },
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

    const expected = [
      { title: 'Overview', link: `/assessment/innovations/innovation01/overview` },
      { title: 'Innovation record', link: `/assessment/innovations/innovation01/record` },
      // { title: 'Support status', link: `/assessment/innovations/innovation01/support` },
      // { title: 'Action tracker', link: `/assessment/innovations/innovation01/action-tracker` },
      // { title: 'Comments', link: `/assessment/innovations/innovation01/comments` }
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
