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
    const expected = { organisationUnit: '', accessors: '', status: '' };

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationSupport).toEqual(expected);

  });

  it('should have support information loaded with payload 01', () => {

    authenticationStore.getAccessorOrganisationUnitName = () => 'Organisation Name';

    const dataMock = {
      status: 'ENGAGING',
      accessors: [{ id: '06E12E5C-3BA8-EB11-B566-0003FFD6549F', name: 'qaccesor_1' }],
    };
    const dataMockInnovation = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: null, categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' },
      support: { id: '01', status: 'WAITING', accessors: [{ id: 'IdOne', name: 'Brigid Kosgei' }, { id: 'IdTwo', name: 'Brigid Kosgei the second' }] }
    };
    accessorService.getInnovationInfo = () => of (dataMockInnovation as any);

    accessorService.getInnovationSupportInfo = () => of(dataMock as any);
    const expected = {
      organisationUnit: 'Organisation Name',
      accessors: 'qaccesor_1',
      status: 'ENGAGING'
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
      accessors: '',
      status: 'ENGAGING',
    };
    const dataMockInnovation = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: null, categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' },
      support: { id: '01', status: 'WAITING', accessors: [{ id: 'IdOne', name: 'Brigid Kosgei' }, { id: 'IdTwo', name: 'Brigid Kosgei the second' }] }
    };
    accessorService.getInnovationInfo = () => of (dataMockInnovation as any);

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationSupport).toEqual(expected);


  });

  it('should NOT have support information loadedd due to API error', () => {

    accessorService.getInnovationSupportInfo = () => throwError('error');
    const expected = { organisationUnit: '', accessors: '', status: '' };

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationSupport).toEqual(expected);

  });

});
