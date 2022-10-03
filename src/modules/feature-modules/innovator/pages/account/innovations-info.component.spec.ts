import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

import { PageAccountInnovationsInfoComponent } from './innovations-info.component';


describe('FeatureModules/Innovator/Pages/Account/PageAccountInnovationsInfoComponent', () => {

  let activatedRoute: ActivatedRoute;

  let authenticationStore: AuthenticationStore;
  let innovationsService: InnovationsService;
  let innovatorService: InnovatorService;

  let component: PageAccountInnovationsInfoComponent;
  let fixture: ComponentFixture<PageAccountInnovationsInfoComponent>;

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

    activatedRoute = TestBed.inject(ActivatedRoute);

    authenticationStore = TestBed.inject(AuthenticationStore);
    innovationsService = TestBed.inject(InnovationsService);
    innovatorService = TestBed.inject(InnovatorService);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountInnovationsInfoComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });


  // it('should show "archivalSuccess" success', () => {

  //   activatedRoute.snapshot.queryParams = { alert: 'archivalSuccess', innovation: 'test' };

  //   const expected = { type: 'SUCCESS', title: `You have archived the innovation 'test'` };

  //   fixture = TestBed.createComponent(PageAccountInnovationsInfoComponent);
  //   component = fixture.componentInstance;

  //   expect(component.alert).toEqual(expected);

  // });

  // it('should have initial information loaded', () => {

  //   innovationsService.getInnovationsList = () => of([
  //     { id: 'innovationId01', name: 'Innovation Name 01' }
  //   ]);

  //   const responseMock = [
  //     { id: 'TransferId01', email: 'some@email.com', innovation: { id: 'Inno01', name: 'Innovation name 01' } },
  //     { id: 'TransferId02', email: 'some@email.com', innovation: { id: 'Inno02', name: 'Innovation name 02' } }
  //   ];
  //   innovatorService.getInnovationTransfers = () => of(responseMock);

  //   const expected = responseMock;

  //   fixture = TestBed.createComponent(PageAccountInnovationsInfoComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationTransfers).toEqual(expected);

  // });


  // it('should NOT have initial information loaded', () => {

  //   innovatorService.getInnovationTransfers = () => throwError('error');

  //   const expected = {
  //     type: 'ERROR',
  //     title: 'Unable to fetch innovations transfers',
  //     message: 'Please try again or contact us for further help'
  //   };

  //   fixture = TestBed.createComponent(PageAccountInnovationsInfoComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });

  // it('should run cancelInnovationTransfer and call API with success', () => {

  //   innovatorService.updateTransferInnovation = () => of({ id: 'TransferId01' });

  //   const expected = {
  //     type: 'ACTION',
  //     title: `You have cancelled the request to transfer the ownership of 'Innovation name 01'`,
  //     setFocus: true
  //   };

  //   fixture = TestBed.createComponent(PageAccountInnovationsInfoComponent);
  //   component = fixture.componentInstance;

  //   component.cancelInnovationTransfer('TransferId01', { id: 'Inno01', name: 'Innovation name 01' });
  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);


  // });

  // it('should run onSubmit and call API with error', () => {

  //   innovatorService.updateTransferInnovation = () => throwError('error');

  //   const expected = {
  //     type: 'ERROR',
  //     title: 'An error occurred when cancelling the transfer',
  //     message: 'Please try again or contact us for further help',
  //     setFocus: true
  //   };

  //   fixture = TestBed.createComponent(PageAccountInnovationsInfoComponent);
  //   component = fixture.componentInstance;

  //   component.cancelInnovationTransfer('TransferId01', { id: 'Inno01', name: 'Innovation name 01' });
  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });

});
