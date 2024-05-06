import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { PageDashboardComponent } from './dashboard.component';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

describe('FeatureModules/Innovator/Pages/Dashboard/DashboardComponent', () => {
  let authenticationStore: AuthenticationStore;
  let innovationsService: InnovationsService;
  let innovatorService: InnovatorService;

  let component: PageDashboardComponent;
  let fixture: ComponentFixture<PageDashboardComponent>;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, InnovatorModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);
    innovationsService = TestBed.inject(InnovationsService);
    innovatorService = TestBed.inject(InnovatorService);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageDashboardComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should have initial information loaded', () => {

  //   innovationsService.getInnovationsList = () => of([
  //     { id: 'innovationId01', name: 'Innovation Name 01', description: '' }
  //   ]);

  //   const responseMock = [
  //     { id: 'TransferId01', email: 'some@email.com', innovation: { id: 'Inno01', name: 'Innovation name 01' } },
  //     { id: 'TransferId02', email: 'some@email.com', innovation: { id: 'Inno02', name: 'Innovation name 02' } }
  //   ];
  //   innovatorService.getInnovationTransfers = () => of(responseMock);

  //   const expected = responseMock;

  //   fixture = TestBed.createComponent(PageDashboardComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationTransfers).toEqual(expected);

  // });

  // it('should NOT have initial information loaded', () => {

  //   innovationsService.getInnovationsList = () => throwError('error');
  //   innovatorService.getInnovationTransfers = () => throwError('error');

  //   const expected = {
  //     type: null
  //   };

  //   fixture = TestBed.createComponent(PageDashboardComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });

  // it('should have alert when password changed', () => {
  //   activatedRoute.snapshot.queryParams = { alert: 'xxxx' };

  //   fixture = TestBed.createComponent(PageDashboardComponent);
  //   component = fixture.componentInstance;
  //   component.user.passwordResetOn = new Date(new Date().getTime() - 2 * 60000).toString();

  //   const mockAlert = { type: 'SUCCESS', title: 'You have successfully changed your password.', setFocus: true };

  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(mockAlert);
  // });

  // // it('should run onSubmitTransferResponse() ACCEPTING transfer and call API with success', () => {

  // //   innovatorService.updateTransferInnovation = () => of({ id: 'TransferId01' });
  // //   authenticationStore.initializeAuthentication$ = () => of(true);
  // //   innovationsService.getInnovationsList = () => of([{ id: 'innovationId01', name: 'Innovation Name 01' }]);
  // //   const responseMock = [
  // //     { id: 'TransferId01', email: 'some@email.com', innovation: { id: 'Inno01', name: 'Innovation name 01' } },
  // //     { id: 'TransferId02', email: 'some@email.com', innovation: { id: 'Inno02', name: 'Innovation name 02' } }
  // //   ];
  // //   innovatorService.getInnovationTransfers = () => of(responseMock);
  // //   notificationsService.getAllUnreadNotificationsGroupedByContext = () => of({ INNOVATION: 1 });

  // //   const expected = {
  // //     type: 'SUCCESS',
  // //     title: `You have successfully accepted ownership`,
  // //     setFocus: true
  // //   };

  // //   fixture = TestBed.createComponent(DashboardComponent);
  // //   component = fixture.componentInstance;

  // //   component.onSubmitTransferResponse('TransferId01', true);

  // //   fixture.detectChanges();

  // //   expect(component.alert).toEqual(expected);

  // // });

  // // it('should run onSubmitTransferResponse() REJECTING transfer and call API with success', () => {

  // //   innovatorService.updateTransferInnovation = () => of({ id: 'TransferId01' });
  // //   authenticationStore.initializeAuthentication$ = () => of(true);
  // //   innovationsService.getInnovationsList = () => of([{ id: 'innovationId01', name: 'Innovation Name 01' }]);
  // //   const responseMock = [
  // //     { id: 'TransferId01', email: 'some@email.com', innovation: { id: 'Inno01', name: 'Innovation name 01' } },
  // //     { id: 'TransferId02', email: 'some@email.com', innovation: { id: 'Inno02', name: 'Innovation name 02' } }
  // //   ];
  // //   innovatorService.getInnovationTransfers = () => of(responseMock);
  // //   notificationsService.getAllUnreadNotificationsGroupedByContext = () => of({ INNOVATION: 1 });

  // //   const expected = {
  // //     type: 'SUCCESS',
  // //     title: `You have successfully rejected ownership`,
  // //     setFocus: true
  // //   };

  // //   fixture = TestBed.createComponent(DashboardComponent);
  // //   component = fixture.componentInstance;

  // //   component.onSubmitTransferResponse('TransferId01', false);

  // //   fixture.detectChanges();
  // //   expect(component.alert).toEqual(expected);

  // // });

  // it('should run onSubmitTransferResponse() and call API with error', () => {

  //   innovatorService.updateTransferInnovation = () => throwError('error');
  //   authenticationStore.initializeAuthentication$ = () => of(true);

  //   const expected = {
  //     type: 'ERROR',
  //     title: 'An error occurred',
  //     message: 'Please try again or contact us for further help',
  //     setFocus: true
  //   };

  //   fixture = TestBed.createComponent(PageDashboardComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmitTransferResponse('TransferId01', true);
  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });
});
