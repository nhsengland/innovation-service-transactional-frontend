import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

import { ENV } from '@tests/app.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { AdminModule } from '../admin.module';

import { AdminLayoutComponent } from './admin-layout.component';


describe('FeatureModules/Admin/Base/AdminLayoutComponent', () => {

  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;
  let activatedRoute: ActivatedRoute;
  let authenticationStore: AuthenticationStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AdminModule
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
    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // it('should have leftSideBar with "emptyLeftAside" menu values', () => {

  //   activatedRoute.snapshot.data = { module: 'admin', layoutOptions: { type: 'emptyLeftAside' } };

  //   const expected = [] as any;

  //   fixture = TestBed.createComponent(AdminLayoutComponent);
  //   component = fixture.componentInstance;

  //   (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
  //   expect(component.leftSideBar).toEqual(expected);

  // });

  // it('should have leftSideBar with no values', () => {

  //   activatedRoute.snapshot.data = { layoutOptions: { backLink: { url: '/', label: 'Go back' } } };

  //   const expected = [] as any;

  //   fixture = TestBed.createComponent(AdminLayoutComponent);
  //   component = fixture.componentInstance;

  //   (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
  //   expect(component.leftSideBar).toEqual(expected);

  // });

  // it('should have leftSideBar with "userAccountMenu" menu values', () => {

  //   activatedRoute.snapshot.data = { module: 'admin', layoutOptions: { type: 'userAccountMenu' } };

  //   const expected = [
  //     { key: 'YourDetails', title: 'Your details', link: `/admin/account/manage-details` },
  //     { key: 'ManageAccount', title: 'Manage account', link: `/admin/account/manage-account` }
  //   ];

  //   fixture = TestBed.createComponent(AdminLayoutComponent);
  //   component = fixture.componentInstance;

  //   (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));
  //   expect(component.leftSideBar).toEqual(expected);

  // });


  // it('should have navigationMenuBar default values', () => {

  //   const expected = {
  //     leftItems: [
  //       { title: 'Service users', url: '/admin/service-users' },
  //       {
  //         title: 'Management',
  //         description: 'This is the menu description',
  //         children: [
  //           { title: 'Organisations', url: '/admin/organisations', description: 'Manage organisations and associated units' },
  //           { title: 'Terms of use', url: '/admin/terms-conditions', description: 'Create a new version and trigger acceptance by the users' }
  //         ]
  //       }
  //     ],
  //     rightItems: [
  //       { title: 'My account', url: '/admin/account' },
  //       { title: 'Sign out', url: `http://demo.com/signout`, fullReload: true }
  //     ]
  //   };

  //   fixture = TestBed.createComponent(AdminLayoutComponent);
  //   component = fixture.componentInstance;

  //   expect(component.headerMenuBar).toEqual(expected);

  // });

});
