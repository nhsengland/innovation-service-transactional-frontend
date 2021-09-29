import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';

import { DashboardComponent } from './dashboard.component';

import { NotificationService } from '@modules/shared/services/notification.service';

describe('FeatureModules/Innovator/DashboardComponent', () => {

  let notificationService: NotificationService;

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AssessmentModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    notificationService = TestBed.inject(NotificationService);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have notifications with API success', () => {

    notificationService.getAllUnreadNotificationsGroupedByContext = () => of({ INNOVATION: 1 });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.notifications).toEqual({ INNOVATION: 1 });

  });

  it('should NOT have notifications with API error', () => {

    notificationService.getAllUnreadNotificationsGroupedByContext = () => throwError('error');

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.notifications).toEqual({ ACTION: 0, COMMENT: 0, INNOVATION: 0, SUPPORT: 0, DATA_SHARING: 0 });

  });

});
