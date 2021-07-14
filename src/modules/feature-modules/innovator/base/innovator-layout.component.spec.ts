import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

import { ENV } from '@tests/app.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';

import { InnovatorModule } from '../innovator.module';

import { InnovatorLayoutComponent } from './innovator-layout.component';


describe('FeatureModules/Innovator/InnovatorLayoutComponent', () => {

  let activatedRoute: ActivatedRoute;

  let authenticationStore: AuthenticationStore;

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

    authenticationStore = TestBed.inject(AuthenticationStore);

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

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
    fixture.detectChanges();

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

    activatedRoute.snapshot.data = { layoutOptions: {} };

    const expected = [] as any;

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));

    expect(component.leftSideBar).toEqual(expected);

  });

  it('should have leftSideBar with innovation menu values', () => {

    activatedRoute.snapshot.params = { innovationId: 'innovation01' };
    activatedRoute.snapshot.data = { layoutOptions: { type: 'innovationLeftAsideMenu' } };

    const expected = [
      { title: 'Overview', link: `/innovator/innovations/innovation01/overview` },
      { title: 'Innovation record', link: `/innovator/innovations/innovation01/record` },
      { title: 'Action tracker', link: `/innovator/innovations/innovation01/action-tracker`, key: 'ACTION' },
      { title: 'Comments', link: `/innovator/innovations/innovation01/comments`, key: 'COMMENT' },
      { title: 'Data sharing and support', link: `/innovator/innovations/innovation01/data-sharing` }
    ];

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));

    expect(component.leftSideBar).toEqual(expected);

  });


  it('should have innovationHeaderBar with no values', () => {

    activatedRoute.snapshot.data = { layoutOptions: {} };

    const expected = { id: null, name: null };

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));

    expect(component.innovationHeaderBar).toEqual(expected);

  });

  it('should have leftSideBar with innovation menu values', () => {

    activatedRoute.snapshot.params = { innovationId: 'innovation01' };
    activatedRoute.snapshot.data = { layoutOptions: { showInnovationHeader: true } };

    spyOn(authenticationStore, 'getUserInfo').and.returnValue({ innovations: [{ id: 'innovation01', name: 'Innovation 01' }] });

    const expected = { id: 'innovation01', name: 'Innovation 01' };

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));

    expect(component.innovationHeaderBar).toEqual(expected);

  });

});
