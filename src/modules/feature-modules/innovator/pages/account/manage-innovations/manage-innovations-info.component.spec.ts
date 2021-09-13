import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { PageAccountManageInnovationsInfoComponent } from './manage-innovations-info.component';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


describe('FeatureModules/Innovator/Pages/Account/ManageInnovations/PageAccountManageInnovationsInfoComponent', () => {

  let authenticationStore: AuthenticationStore;
  let innovatorService: InnovatorService;

  let component: PageAccountManageInnovationsInfoComponent;
  let fixture: ComponentFixture<PageAccountManageInnovationsInfoComponent>;

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

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountManageInnovationsInfoComponent);
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

    fixture = TestBed.createComponent(PageAccountManageInnovationsInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.innovationTransfers).toEqual(expected);

  });


  it('should NOT have initial information loaded', () => {

    innovatorService.getInnovationTransfers = () => throwError('error');

    const expected = {
      type: 'ERROR',
      title: 'Unable to fetch innovations transfers',
      message: 'Please try again or contact us for further help'
    };

    fixture = TestBed.createComponent(PageAccountManageInnovationsInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should run cancelInnovationTransfer and call API with success', () => {

    innovatorService.updateTransferInnovation = () => of({ id: 'TransferId01' });

    const expected = {
      type: 'ACTION',
      title: `You have cancelled the request to transfer the ownership of 'Innovation name 01'`,
      setFocus: true
    };

    fixture = TestBed.createComponent(PageAccountManageInnovationsInfoComponent);
    component = fixture.componentInstance;

    component.cancelInnovationTransfer('TransferId01', { id: 'Inno01', name: 'Innovation name 01' });
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);


  });

  it('should run onSubmit and call API with error', () => {

    innovatorService.updateTransferInnovation = () => throwError('error');

    const expected = {
      type: 'ERROR',
      title: 'An error occurred when cancelling the transfer',
      message: 'Please try again or contact us for further help',
      setFocus: true
    };

    fixture = TestBed.createComponent(PageAccountManageInnovationsInfoComponent);
    component = fixture.componentInstance;

    component.cancelInnovationTransfer('TransferId01', { id: 'Inno01', name: 'Innovation name 01' });
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

});
