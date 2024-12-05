import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationsReviewComponent } from './innovations-review.component';

import { AccessorService } from '../../services/accessor.service';
import { NotificationsService } from '@modules/shared/services/notifications.service';

describe('FeatureModules/Accessor/Innovations/ReviewInnovationsComponent', () => {
  let activatedRoute: ActivatedRoute;

  let accessorService: AccessorService;
  let notificationsService: NotificationsService;

  let component: InnovationsReviewComponent;
  let fixture: ComponentFixture<InnovationsReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AccessorModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    accessorService = TestBed.inject(AccessorService);
    notificationsService = TestBed.inject(NotificationsService);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationsReviewComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should have AccessorRole tabs', () => {

  //   activatedRoute.queryParams = of({ status: 'ENGAGING' });
  //   authenticationStore.isAccessorRole = () => true;

  //   fixture = TestBed.createComponent(InnovationsReviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.tabs.length).toBe(2);

  // });

  // it('should have QualifyingAccessorRole tabs', () => {

  //   activatedRoute.queryParams = of({ status: 'UNASSIGNED' });
  //   authenticationStore.isQualifyingAccessorRole = () => true;

  //   fixture = TestBed.createComponent(InnovationsReviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.tabs.length).toBe(7);

  // });

  // it('should have default values when status = UNASSIGNED', () => {

  //   activatedRoute.queryParams = of({ status: 'UNASSIGNED' });
  //   authenticationStore.isQualifyingAccessorRole = () => true;

  //   const expected = [
  //     { key: 'name', label: 'Innovation', orderDir: 'none', orderable: true, align: 'text-align-left' },
  //     { key: 'submittedAt', label: 'Submitted', orderDir: 'descending', orderable: true, align: 'text-align-left' },
  //     { key: 'mainCategory', label: 'Main category', orderDir: 'none', orderable: true, align: 'text-align-left' },
  //     { key: 'countryName', label: 'Location', orderDir: 'none', orderable: true, align: 'text-align-left' },
  //     { key: 'engagingOrganisations', label: 'Engaging organisations', orderDir: 'none', orderable: false, align: 'text-align-right' }
  //   ];

  //   fixture = TestBed.createComponent(InnovationsReviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationsList.getHeaderColumns()).toEqual(expected);

  // });

  // it('should have default values when status = ENGAGING', () => {

  //   activatedRoute.queryParams = of({ status: 'ENGAGING' });
  //   authenticationStore.isQualifyingAccessorRole = () => true;

  //   const expected = [
  //     { key: 'name', label: 'Innovation', orderDir: 'none', orderable: true, align: 'text-align-left' },
  //     { key: 'updatedAt', label: 'Updated', orderDir: 'descending', orderable: true, align: 'text-align-left' },
  //     { key: 'mainCategory', label: 'Main category', orderDir: 'none', orderable: true, align: 'text-align-left' },
  //     { key: 'accessors', label: 'Accessor', orderDir: 'none', orderable: false, align: 'text-align-left' },
  //     { key: 'engagingOrganisations', label: 'Engaging organisations', orderDir: 'none', orderable: false, align: 'text-align-right' }
  //   ];

  //   fixture = TestBed.createComponent(InnovationsReviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationsList.getHeaderColumns()).toEqual(expected);

  // });

  // it('should have default values when status = WAITING', () => {

  //   activatedRoute.queryParams = of({ status: 'WAITING' });
  //   authenticationStore.isQualifyingAccessorRole = () => true;

  //   const expected = [
  //     { key: 'name', label: 'Innovation', orderDir: 'none', orderable: true, align: 'text-align-left' },
  //     { key: 'updatedAt', label: 'Updated', orderDir: 'descending', orderable: true, align: 'text-align-left' },
  //     { key: 'mainCategory', label: 'Main category', orderDir: 'none', orderable: true, align: 'text-align-left' },
  //     { key: 'countryName', label: 'Location', orderDir: 'none', orderable: true, align: 'text-align-left' },
  //     { key: 'engagingOrganisations', label: 'Engaging organisations', orderDir: 'none', orderable: false, align: 'text-align-right' }
  //   ];

  //   fixture = TestBed.createComponent(InnovationsReviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationsList.getHeaderColumns()).toEqual(expected);

  // });

  // it('should run getInnovationsList() with success', () => {

  //   activatedRoute.queryParams = of({ status: 'UNASSIGNED' });

  //   authenticationStore.isQualifyingAccessorRole = () => true;

  //   const responseMock = {
  //     count: 100,
  //     data: [{
  //       id: 'id01',
  //       name: 'Innovation Name',
  //       mainCategory: '',
  //       countryName: '',
  //       submittedAt: '2020-01-01T00:00:00.000Z',
  //       support: {
  //         id: 'string',
  //         status: 'UNASSIGNED' as keyof typeof INNOVATION_SUPPORT_STATUS,
  //         createdAt: '2020-01-01T00:00:00.000Z',
  //         updatedAt: '2020-01-01T00:00:00.000Z',
  //         accessors: []
  //       },
  //       organisations: [],
  //       assessment: { id: null }
  //     }]
  //   };
  //   accessorService.getInnovationsList = () => of(responseMock);

  //   const expected = responseMock.data;

  //   fixture = TestBed.createComponent(InnovationsReviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationsList.getRecords()).toEqual(expected);

  // });

  // it('should run getInnovationsList() with error', () => {

  //   activatedRoute.queryParams = of({ status: 'UNASSIGNED' });
  //   authenticationStore.isQualifyingAccessorRole = () => true;

  //   accessorService.getInnovationsList = () => throwError(false);

  //   fixture = TestBed.createComponent(InnovationsReviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationsList.getRecords()).toEqual([]);

  // });

  // it('should run onFormChange()', () => {

  //   fixture = TestBed.createComponent(InnovationsReviewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.form.get('assignedToMe')?.setValue(false);
  //   component.form.get('suggestedOnly')?.setValue(true);
  //   fixture.detectChanges();

  //   expect(component.innovationsList.filters).toEqual({ status: 'UNASSIGNED', assignedToMe: false, suggestedOnly: true });

  // });

  // it('should run onTableOrder()', () => {

  //   const dataMock = { count: 0, data: [] };

  //   accessorService.getInnovationsList = () => of(dataMock as any);

  //   fixture = TestBed.createComponent(InnovationsReviewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onTableOrder('name');
  //   expect(component.innovationsList.orderBy).toEqual('name');

  // });

  // it('should run onPageChange()', () => {

  //   fixture = TestBed.createComponent(InnovationsReviewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onPageChange({ pageNumber: 2 });
  //   expect(component.innovationsList.page).toBe(2);

  // });
});
