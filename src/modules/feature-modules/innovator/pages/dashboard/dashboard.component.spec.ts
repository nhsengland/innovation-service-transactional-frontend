import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerConfig, NGXLogger, NGXLoggerHttpService } from 'ngx-logger';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@modules/core/core.module';
import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AppInjector } from '@modules/core';

import { DashboardComponent } from './dashboard.component';

import { InjectorMock } from '@tests/mocks/injector.mock';

describe('DashboardComponent tests Suite', () => {

  let logger: NGXLogger;
  let router: Router;
  // let activatedRoute: ActivatedRoute;

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let injectorSpy: jasmine.Spy;
  // let routerSpy: jasmine.Spy;
  // let serverRedirectSpy: { status: jasmine.Spy, setHeader: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponent }
        ]),
        TranslateModule.forRoot(),
        CoreModule,
        ThemeModule,
        SharedModule
      ],
      declarations: [
        DashboardComponent,
      ],
      providers: [
        { provide: NGXLoggerHttpService, useClass: class { } },
        { provide: LoggerConfig, useClass: class { } },
        // { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {} } } },
        // { provide: SurveyService, useValue: { snapshot: { params: {}, queryParams: {} } } },
        InjectorMock
      ]
    }).compileComponents();

    logger = TestBed.inject(NGXLogger);
    router = TestBed.inject(Router);
    // activatedRoute = TestBed.inject(ActivatedRoute);
    // surveyService = TestBed.inject(SurveyService);

    spyOn(AppInjector, 'getInjector').and.returnValue(TestBed.inject(InjectorMock));
    injectorSpy = spyOn(TestBed.inject(InjectorMock), 'get');

    injectorSpy.and.returnValue(logger);
    injectorSpy.and.returnValue(router);

    // routerSpy = spyOn(router, 'navigate');
    // serverRedirectSpy = { status: jasmine.createSpy('status'), setHeader: jasmine.createSpy('setHeader') };


  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
