import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { UserTypeEnum } from '@app/base/enums';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageAdminUsersFindComponent } from './admin-users-find.component';

import { searchUserEndpointOutDTO, ServiceUsersService } from '../../services/service-users.service';


describe('FeatureModules/Admin/Pages/AdminUsers/PageAdminUserFindComponent', () => {

  let activatedRoute: ActivatedRoute;

  let serviceUsersService: ServiceUsersService;

  let component: PageAdminUsersFindComponent;
  let fixture: ComponentFixture<PageAdminUsersFindComponent>;

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

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAdminUsersFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show "adminDeletedSuccess" alert', () => {

    activatedRoute.snapshot.queryParams = { alert: 'adminDeletedSuccess' };

    fixture = TestBed.createComponent(PageAdminUsersFindComponent);
    component = fixture.componentInstance;
    expect(component.alert.type).toBe('SUCCESS');

  });

  it('should call onSubmit() and return success', () => {

    const responseMock: searchUserEndpointOutDTO[] = [{
      id: ':id',
      displayName: ':displayName',
      email: 'test@example.com',
      type: UserTypeEnum.ACCESSOR,
      typeLabel: 'Accessor',
      userOrganisations: [
        {
          id: ':organisation_id',
          name: 'org name',
          acronym: 'acronym',
          role: 'ACCESSOR',
          units: [{
            id: ':unit',
            name: 'unit name',
            acronym: 'unit acronym',
          }]
        }
      ]
    }];

    serviceUsersService.searchUser = () => of(responseMock);

    fixture = TestBed.createComponent(PageAdminUsersFindComponent);
    component = fixture.componentInstance;

    component.form.setValue({ email: 'test@example.com' });
    component.onSubmit();
    fixture.detectChanges();

    expect(component.usersList.length).toEqual(1);

  });

  it('should call onSubmit() and return error', () => {

    serviceUsersService.searchUser = () => throwError('error');

    fixture = TestBed.createComponent(PageAdminUsersFindComponent);
    component = fixture.componentInstance;

    component.form.setValue({ email: 'test@example.com' });
    component.onSubmit();
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

  });

});
