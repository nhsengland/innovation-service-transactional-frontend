import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageServiceUsersInfoComponent } from './service-users-info.component';

import { getUserFullInfoDTO, ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageServiceUsersInfoComponent', () => {

  let activatedRoute: ActivatedRoute;

  let serviceUsersService: ServiceUsersService;

  let component: PageServiceUsersInfoComponent;
  let fixture: ComponentFixture<PageServiceUsersInfoComponent>;

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
    fixture = TestBed.createComponent(PageServiceUsersInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show "lockSuccess" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'lockSuccess' };

    const expected = { type: 'SUCCESS', title: 'User locked successfully' };

    fixture = TestBed.createComponent(PageServiceUsersInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });


  it('should show "unlockSuccess" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'unlockSuccess' };

    const expected = { type: 'SUCCESS', title: 'User unlocked successfully' };

    fixture = TestBed.createComponent(PageServiceUsersInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });

  it('should show "userCreationSuccess" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'userCreationSuccess' };

    const expected = { type: 'SUCCESS', title: 'User created successfully' };

    fixture = TestBed.createComponent(PageServiceUsersInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });

  it('should have initial information loaded with payload 01', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', actionId: 'Action01' };

    const responseMock: getUserFullInfoDTO = {
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      phone: '12345',
      type: 'INNOVATOR',
      lockedAt: '2020-01-01T00:00:00.000Z',
      innovations: [{id:'inn1',name: 'innovation'}],
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', role: 'INNOVATOR_OWNER', units: [] }
      ]
    };
    serviceUsersService.getUserFullInfo = () => of(responseMock);
    const expected = 'User name';

    fixture = TestBed.createComponent(PageServiceUsersInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.sections.userInfo[0].value).toBe(expected);

  });

  it('should have initial information loaded with payload 02', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', actionId: 'Action01' };

    const responseMock: getUserFullInfoDTO = {
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      phone: '12345',
      type: 'ACCESSOR',
      lockedAt: null,
      innovations: [{id:'inn1',name: 'innovation'}],
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', role: 'INNOVATOR_OWNER', units: [] }
      ]
    };
    serviceUsersService.getUserFullInfo = () => of(responseMock);
    const expected = 'User name';

    fixture = TestBed.createComponent(PageServiceUsersInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.sections.userInfo[0].value).toBe(expected);

  });

  it('should NOT have initial information loaded', () => {

    serviceUsersService.getUserFullInfo = () => throwError('error');

    fixture = TestBed.createComponent(PageServiceUsersInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.alert.type).toBe('ERROR');

  });

});
