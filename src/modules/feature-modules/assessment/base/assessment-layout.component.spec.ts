import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

import { ENV } from '@tests/app.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { AssessmentModule } from '../assessment.module';

import { AssessmentLayoutComponent } from './assessment-layout.component';


describe('FeatureModules/Innovator/InnovatorLayoutComponent', () => {

  let activatedRoute: ActivatedRoute;

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

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should have navigationMenuBar default values', () => {

    const expected = {
      leftItems: [
        { title: 'Home', link: '/assessment/dashboard' }
      ],
      rightItems: [
        { title: 'Innovations', link: '/assessment/innovations' },
        { title: 'Account', link: '/assessment/account' },
        { title: 'Sign out', link: `http://demo.com/signout`, fullReload: true }
      ]
    };

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(fixture.componentInstance.navigationMenuBar).toEqual(expected);

  });


  it('should have leftSideBar with no values', () => {

    activatedRoute.snapshot.data = { layoutOptions: {} };

    const expected = [] as any;

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
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

    fixture = TestBed.createComponent(AssessmentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component as any).onRouteChange(new NavigationEnd(0, '/', '/'));

    expect(fixture.componentInstance.leftSideBar).toEqual(expected);

  });

});
