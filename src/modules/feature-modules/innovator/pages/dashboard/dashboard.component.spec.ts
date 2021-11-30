import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { DashboardComponent } from './dashboard.component';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { NotificationsService } from '@modules/shared/services/notifications.service';


describe('FeatureModules/Innovator/Pages/Dashboard/DashboardComponent', () => {

  let authenticationStore: AuthenticationStore;
  let innovatorService: InnovatorService;
  let notificationsService: NotificationsService;

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);
    innovatorService = TestBed.inject(InnovatorService);
    notificationsService = TestBed.inject(NotificationsService);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have initial information loaded', () => {

    const responseMock = [
      { id: 'TransferId01', email: 'some@email.com', innovation: { id: 'Inno01', name: 'Innovation name 01' } },
      { id: 'TransferId02', email: 'some@email.com', innovation: { id: 'Inno02', name: 'Innovation name 02' } }
    ];
    innovatorService.getInnovationTransfers = () => of(responseMock);

    const expected = responseMock;

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.innovationTransfers).toEqual(expected);

  });


  it('should NOT have initial information loaded', () => {

    innovatorService.getInnovationTransfers = () => throwError('error');

    const expected = {
      type: null
    };

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should run notificationsCount()', () => {

    notificationsService.notifications = { DATA_SHARING: 1 };

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    expect(component.notificationsCount()).toBe(1);

  });

  it('should run onSubmitTransferResponse() ACCEPTING transfer and call API with success', () => {

    innovatorService.updateTransferInnovation = () => of({ id: 'TransferId01' });
    authenticationStore.initializeAuthentication$ = () => of(true);

    const expected = {
      type: 'SUCCESS',
      title: `You have successfully accepted ownership`,
      setFocus: true
    };

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    component.onSubmitTransferResponse('TransferId01', true);
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });


  it('should run onSubmitTransferResponse() REJECTING transfer and call API with success', () => {

    innovatorService.updateTransferInnovation = () => of({ id: 'TransferId01' });
    authenticationStore.initializeAuthentication$ = () => of(true);

    const expected = {
      type: 'SUCCESS',
      title: `You have successfully rejected ownership`,
      setFocus: true
    };

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    component.onSubmitTransferResponse('TransferId01', false);
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);


  });

  it('should run onSubmitTransferResponse() and call API with error', () => {

    innovatorService.updateTransferInnovation = () => throwError('error');
    authenticationStore.initializeAuthentication$ = () => of(true);

    const expected = {
      type: 'ERROR',
      title: 'An error occurred',
      message: 'Please try again or contact us for further help',
      setFocus: true
    };

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    component.onSubmitTransferResponse('TransferId01', true);
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

});
