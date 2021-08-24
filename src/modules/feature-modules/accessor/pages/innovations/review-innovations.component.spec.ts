import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { ReviewInnovationsComponent } from './review-innovations.component';

import { AccessorService } from '../../services/accessor.service';


describe('FeatureModules/Accessor/Innovations/ReviewInnovationsComponent', () => {

  let activatedRoute: ActivatedRoute;

  let authenticationStore: AuthenticationStore;

  let component: ReviewInnovationsComponent;
  let fixture: ComponentFixture<ReviewInnovationsComponent>;

  let accessorService: AccessorService;

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

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should have AccessorRole tabs', () => {

    activatedRoute.queryParams = of({ status: 'ENGAGING' });
    authenticationStore.isAccessorRole = () => true;

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.tabs.length).toBe(2);

  });

  it('should have QualifyingAccessorRole tabs', () => {

    activatedRoute.queryParams = of({ status: 'UNASSIGNED' });
    authenticationStore.isQualifyingAccessorRole = () => true;

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.tabs.length).toBe(7);

  });


  it('should have default values when status = UNASSIGNED', () => {

    activatedRoute.queryParams = of({ status: 'UNASSIGNED' });
    authenticationStore.isQualifyingAccessorRole = () => true;

    const expected = [
      { key: 'name', label: 'Innovation', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'submittedAt', label: 'Submitted', orderDir: 'descending', orderable: true, align: 'text-align-left' },
      { key: 'mainCategory', label: 'Main category', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'countryName', label: 'Location', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'engagingOrganisations', label: 'Engaging organisations', orderDir: 'none', orderable: false, align: 'text-align-right' }
    ];

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationsList.getHeaderColumns()).toEqual(expected);

  });

  it('should have default values when status = ENGAGING', () => {

    activatedRoute.queryParams = of({ status: 'ENGAGING' });
    authenticationStore.isQualifyingAccessorRole = () => true;

    const expected = [
      { key: 'name', label: 'Innovation', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'updatedAt', label: 'Updated', orderDir: 'descending', orderable: true, align: 'text-align-left' },
      { key: 'mainCategory', label: 'Main category', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'accessors', label: 'Accessor', orderDir: 'none', orderable: false, align: 'text-align-left' },
      { key: 'engagingOrganisations', label: 'Engaging organisations', orderDir: 'none', orderable: false, align: 'text-align-right' }
    ];

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationsList.getHeaderColumns()).toEqual(expected);

  });

  it('should have default values when status = WAITING', () => {

    activatedRoute.queryParams = of({ status: 'WAITING' });
    authenticationStore.isQualifyingAccessorRole = () => true;

    const expected = [
      { key: 'name', label: 'Innovation', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'updatedAt', label: 'Updated', orderDir: 'descending', orderable: true, align: 'text-align-left' },
      { key: 'mainCategory', label: 'Main category', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'countryName', label: 'Location', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'engagingOrganisations', label: 'Engaging organisations', orderDir: 'none', orderable: false, align: 'text-align-right' }
    ];

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationsList.getHeaderColumns()).toEqual(expected);

  });


  it('should run getInnovations() with success', () => {

    activatedRoute.queryParams = of({ status: 'UNASSIGNED' });
    authenticationStore.isQualifyingAccessorRole = () => true;

    const dataMock = {
      count: 100,
      data: [
        { id: 'id01', status: 'CREATED', name: 'Innovation 01', supportStatus: 'UNASSIGNED', createdAt: '2020-01-01T00:00:00.000Z', updatedAt: '2020-01-01T00:00:00.000Z' }
      ]
    };
    accessorService.getInnovationsList = () => of(dataMock as any);

    const expected = dataMock.data;

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationsList.getRecords()).toEqual(expected);

  });

  it('should run getInnovations() with error', () => {

    activatedRoute.queryParams = of({ status: 'UNASSIGNED' });
    authenticationStore.isQualifyingAccessorRole = () => true;

    accessorService.getInnovationsList = () => throwError(false);

    const expected = [] as any;

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationsList.getRecords()).toEqual(expected);

  });


  it('should run onFormChange()', () => {

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.form.get('assignedToMe')?.setValue(true);
    fixture.detectChanges();

    expect(component.innovationsList.filters).toEqual({ assignedToMe: true});

  });


  it('should run onTableOrder()', () => {

    const dataMock = { count: 0, data: [] };

    accessorService.getInnovationsList = () => of(dataMock as any);

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onTableOrder('name');
    expect(component.innovationsList.orderBy).toEqual('name');

  });

});
