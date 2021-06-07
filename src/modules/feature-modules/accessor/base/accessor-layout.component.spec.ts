import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

import { ENV } from '@tests/app.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';

import { AccessorModule } from '../accessor.module';

import { AccessorLayoutComponent } from './accessor-layout.component';


describe('FeatureModules/Accessor/AccessorLayoutComponent', () => {

  let activatedRoute: ActivatedRoute;

  let authenticationStore: AuthenticationStore;

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

    authenticationStore = TestBed.inject(AuthenticationStore);

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(AccessorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

  it('should have default values on navigationMenuBar', () => {

    const expected = {
      leftItems: [
        { title: 'Home', link: '/accessor/dashboard' }
      ],
      rightItems: [
        { title: 'Your engagements', link: '/accessor/engagements' },
        { title: 'Actions', link: '/accessor/actions' },
        { title: 'Activity', link: '/accessor/activity' },
        { title: 'Account', link: '/accessor/account' },
        { title: 'Sign out', link: `http://demo.com/signout`, fullReload: true }
      ]
    };

    fixture = TestBed.createComponent(AccessorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));

    expect(fixture.componentInstance.navigationMenuBar).toEqual(expected);

  });

  it('should have Qualifying Accessor Role values on navigationMenuBar', () => {

    spyOn(authenticationStore, 'isQualifyingAccessorRole').and.returnValue(true);

    const expected = {
      leftItems: [
        { title: 'Home', link: '/accessor/dashboard' }
      ],
      rightItems: [
        { title: 'Review innovations', link: '/accessor/innovations' },
        { title: 'Your engagements', link: '/accessor/engagements' },
        { title: 'Actions', link: '/accessor/actions' },
        { title: 'Activity', link: '/accessor/activity' },
        { title: 'Account', link: '/accessor/account' },
        { title: 'Sign out', link: `http://demo.com/signout`, fullReload: true }
      ]
    };

    fixture = TestBed.createComponent(AccessorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));

    expect(fixture.componentInstance.navigationMenuBar).toEqual(expected);

  });


  it('should have leftSideBar with no values', () => {

    activatedRoute.snapshot.data = { layoutOptions: {} };

    const expected = [] as any;

    fixture = TestBed.createComponent(AccessorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));

    expect(fixture.componentInstance.leftSideBar).toEqual(expected);

  });

  it('should have leftSideBar with innovation menu values', () => {

    activatedRoute.snapshot.params = { innovationId: 'innovation01' };
    activatedRoute.snapshot.data = { layoutOptions: { type: 'innovationLeftAsideMenu' } };

    const expected = [
      { title: 'Overview', link: `/assessment/innovations/innovation01/overview` },
      { title: 'Innovation record', link: `/assessment/innovations/innovation01/record` },
      { title: 'Action tracker', link: `/assessment/innovations/innovation01/action-tracker` },
      { title: 'Comments', link: `/assessment/innovations/innovation01/comments` }
    ];

    fixture = TestBed.createComponent(AccessorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));

    expect(fixture.componentInstance.leftSideBar).toEqual(expected);

  });

});
