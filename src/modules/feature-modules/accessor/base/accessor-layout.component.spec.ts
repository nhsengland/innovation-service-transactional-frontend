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
        { title: 'Innovations', link: '/accessor/innovations', key: 'INNOVATION' },
        { title: 'Actions', link: '/accessor/actions', key: 'ACTION' },
        { title: 'Account', link: '/accessor/account', key: '' },
        { title: 'Sign out', link: `http://demo.com/signout`, fullReload: true, key: '' }
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
      { title: 'Overview', link: `/accessor/innovations/innovation01/overview` },
      { title: 'Innovation record', link: `/accessor/innovations/innovation01/record` },
      { title: 'Action tracker', link: `/accessor/innovations/innovation01/action-tracker`, key: 'ACTION' },
      { title: 'Comments', link: `/accessor/innovations/innovation01/comments`, key: 'COMMENT' },
      { title: 'Support status', link: `/accessor/innovations/innovation01/support` }
    ];

    fixture = TestBed.createComponent(AccessorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));

    expect(fixture.componentInstance.leftSideBar).toEqual(expected);

  });

});
