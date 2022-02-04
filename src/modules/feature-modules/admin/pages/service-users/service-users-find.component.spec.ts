import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageServiceUsersFindComponent } from './service-users-find.component';
import { searchUserEndpointDTO, ServiceUsersService } from '../../services/service-users.service';
import { of } from 'rxjs';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageServiceUsersFindComponent', () => {

  let component: PageServiceUsersFindComponent;
  let fixture: ComponentFixture<PageServiceUsersFindComponent>;

  let serviceUsersService: ServiceUsersService;

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

    serviceUsersService = TestBed.inject(ServiceUsersService);

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageServiceUsersFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call the backend when clicking the search button and return 1 record', () => {
    const mock: searchUserEndpointDTO[] = [{
      id: ':id',
      displayName: ':displayName',
      email: 'test@example.com',
      type: 'ACCESSOR',
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

    serviceUsersService.searchUser = () => of(mock);

    fixture = TestBed.createComponent(PageServiceUsersFindComponent);
    component = fixture.componentInstance;

    component.form.setValue({search: 'test@example.com' });
    component.onSubmit();

    fixture.detectChanges();

    expect(component.serviceUsers?.length).toEqual(1);
  });

  it('should call the backend when clicking the search button and return 0 records', () => {
    const mock: searchUserEndpointDTO[] = [];

    serviceUsersService.searchUser = () => of(mock);

    fixture = TestBed.createComponent(PageServiceUsersFindComponent);
    component = fixture.componentInstance;

    component.form.setValue({search: 'test@example.com' });
    component.onSubmit();

    fixture.detectChanges();

    expect(component.serviceUsers?.length).toEqual(0);
  });
});
