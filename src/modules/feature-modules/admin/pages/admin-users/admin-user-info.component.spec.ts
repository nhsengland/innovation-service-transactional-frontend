import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { UserTypeEnum } from '@app/base/enums';

import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';

import { PageAdminUserInfoComponent } from './admin-user-info.component';


describe('FeatureModules/Admin/Pages/AdminUsers/PageAdminUserInfoComponent', () => {

  let activatedRoute: ActivatedRoute;

  let serviceUsersService: ServiceUsersService;

  let component: PageAdminUserInfoComponent;
  let fixture: ComponentFixture<PageAdminUserInfoComponent>;

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

    serviceUsersService = TestBed.inject(ServiceUsersService);

    activatedRoute.snapshot.params = { userId: 'User01' };
    activatedRoute.snapshot.data = { user: { userId: 'User01', displayName: 'User Name' } };

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAdminUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show "adminCreationSuccess" alert', () => {

    activatedRoute.snapshot.queryParams = { alert: 'adminCreationSuccess' };

    fixture = TestBed.createComponent(PageAdminUserInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert.type).toBe('SUCCESS');

  });

  it('should have user information loaded', () => {

    serviceUsersService.getUserFullInfo = () => of({
      id: 'user01', email: 'some@email.com', phone: null,
      displayName: 'User name', type: UserTypeEnum.INNOVATOR,
      lockedAt: null,
      innovations: [],
      userOrganisations: []
    });

    fixture = TestBed.createComponent(PageAdminUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.sections.userInfo[0].value).toBe('User name');

  });

  it('should NOT have user information loaded', () => {

    serviceUsersService.getUserFullInfo = () => throwError('error');


    fixture = TestBed.createComponent(PageAdminUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('ERROR');

  });

});
