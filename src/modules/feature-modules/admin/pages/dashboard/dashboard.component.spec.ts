import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { AuthenticationService, StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageDashboardComponent } from './dashboard.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';


describe('FeatureModules/Admin/Pages/Dashboard/PageDashboardComponent', () => {

  let component: PageDashboardComponent;
  let fixture: ComponentFixture<PageDashboardComponent>;
  let activatedRoute: ActivatedRoute;
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AdminModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
    activatedRoute = TestBed.inject(ActivatedRoute);
    service = TestBed.inject(AuthenticationService);
  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have alert when password changed', () => {
    activatedRoute.snapshot.queryParams = { alert: 'xxxx' };
    service.getUserInfo = () => of({ id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'INNOVATOR', roles: [], organisations: [], passwordResetOn: new Date(new Date().getTime() -  1 * 60000).toString(), phone: '' });

    fixture = TestBed.createComponent(PageDashboardComponent);
    component = fixture.componentInstance;

    const mockAlert = { type: 'SUCCESS', title: 'You have successfully changed your password.', setFocus: true };

    fixture.detectChanges();
    expect(component.alert).toEqual(mockAlert);
  });



});
