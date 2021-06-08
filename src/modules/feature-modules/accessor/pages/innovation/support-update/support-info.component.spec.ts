import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationSupportInfoComponent } from './support-info.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';


describe('FeatureModules/Accessor/Innovation/InnovationSupportInfoComponent', () => {

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

    accessorService = TestBed.inject(AccessorService);

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should have innovation information loaded with payload 01', () => {

    const dataMock = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: null, categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' },
      support: { id: '01', status: 'WAITING', accessors: [{ id: 'IdOne', name: 'Brigid Kosgei' }] }
    };
    accessorService.getInnovationInfo = () => of(dataMock as any);
    const expected = dataMock;

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovation).toEqual(expected);

  });

  it('should have innovation information loaded with payload 02', () => {

    const dataMock = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: 'SW01', categories: ['Medical', 'OTHER'], otherCategoryDescription: 'Other category' },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' }
    };
    accessorService.getInnovationInfo = () => of(dataMock as any);
    const expected = dataMock;

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovation).toEqual(expected);

  });

  it('should NOT have innovation information loaded', () => {

    accessorService.getInnovationInfo = () => throwError('error');
    const expected = [];

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovation).toEqual(undefined);

  });

});
