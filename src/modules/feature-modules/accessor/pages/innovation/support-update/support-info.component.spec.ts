import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationSupportInfoComponent } from './support-info.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';


describe('FeatureModules/Accessor/Innovation/InnovationSupportInfoComponent', () => {

  let activatedRoute: ActivatedRoute;
  let authenticationStore: AuthenticationStore;

  let accessorService: AccessorService;

  let component: InnovationSupportInfoComponent;
  let fixture: ComponentFixture<InnovationSupportInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AccessorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    authenticationStore = TestBed.inject(AuthenticationStore);

    accessorService = TestBed.inject(AccessorService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', support: { id: 'Inno01Support01', status: 'ENGAGING' }, assessment: {} } };

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should NOT make an API call', () => {

    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', support: { status: 'ENGAGING' }, assessment: {} } };

    accessorService.getInnovationSupportInfo = () => throwError('error');
    const expected = { organisationUnit: '', accessors: '' };

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationSupport).toEqual(expected);

  });

  it('should have support information loaded with payload 01', () => {

    authenticationStore.getAccessorOrganisationUnitName = () => 'Organisation Name';

    const dataMock = {
      status: 'ENGAGING',
      accessors: [{ id: '06E12E5C-3BA8-EB11-B566-0003FFD6549F', name: 'qaccesor_1' }]
    };
    accessorService.getInnovationSupportInfo = () => of(dataMock as any);
    const expected = {
      organisationUnit: 'Organisation Name',
      accessors: 'qaccesor_1'
    };

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationSupport).toEqual(expected);

  });

  it('should have innovation information loaded with payload 02', () => {

    authenticationStore.getAccessorOrganisationUnitName = () => 'Organisation Name';

    const dataMock = {
      status: 'ENGAGING',
      accessors: undefined
    };
    accessorService.getInnovationSupportInfo = () => of(dataMock as any);
    const expected = {
      organisationUnit: 'Organisation Name',
      accessors: ''
    };

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationSupport).toEqual(expected);


  });

  it('should NOT have support information loadedd due to API error', () => {

    accessorService.getInnovationSupportInfo = () => throwError('error');
    const expected = { organisationUnit: '', accessors: '' };

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationSupport).toEqual(expected);

  });

});
