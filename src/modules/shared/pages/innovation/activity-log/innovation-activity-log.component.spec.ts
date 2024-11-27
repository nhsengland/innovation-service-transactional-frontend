import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { PageInnovationActivityLogComponent } from './innovation-activity-log.component';

describe('Shared/Pages/Innovation/PageInnovationActivityLogComponent', () => {
  let activatedRoute: ActivatedRoute;

  let organisationsService: OrganisationsService;

  let component: PageInnovationActivityLogComponent;
  let fixture: ComponentFixture<PageInnovationActivityLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, SharedModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    organisationsService = TestBed.inject(OrganisationsService);

    // activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', assessment: {} } };
    //     activatedRoute.snapshot.queryParams = { alert: 'actionCreationSuccess' };
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // it('should have AccessorRole tabs', () => {

  //   authenticationStore.isAccessorRole = () => true;

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.datasets.supportStatuses.length).toBe(2);

  // });

  // it('should have QualifyingAccessorRole tabs', () => {

  //   authenticationStore.isQualifyingAccessorRole = () => true;

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.datasets.supportStatuses.length).toBe(8);

  // });

  // it('should have default values', () => {

  //   organisationsService.getAccessorsOrganisations = () => of([
  //     { id: 'orgId01', name: 'Org name 01' },
  //     { id: 'org_id', name: 'Org name 02' }
  //   ]);

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.datasets.engagingOrganisations).toEqual([{ value: 'orgId01', label: 'Org name 01' }]);

  // });

  // it('should NOT have default values', () => {

  //   organisationsService.getAccessorsOrganisations = () => throwError('error');

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.datasets.engagingOrganisations).toEqual([]);

  // });

  // it('should run getInnovationsList() with success', () => {

  //   const responseMock = {
  //     count: 100,
  //     data: [{
  //       id: 'id01',
  //       name: 'Innovation Name',
  //       mainCategory: '',
  //       countryName: '',
  //       submittedAt: '2020-01-01T00:00:00.000Z',
  //       supportStatus: 'UNASSIGNED' as keyof typeof INNOVATION_SUPPORT_STATUS
  //     }]
  //   };
  //   accessorService.getAdvancedInnovationsList = () => of(responseMock);

  //   const expected = responseMock.data;

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;

  //   component.getInnovationsList();
  //   fixture.detectChanges();
  //   expect(component.innovationsList.getRecords()).toEqual(expected);

  // });

  // it('should run getInnovationsList() with error', () => {

  //   accessorService.getAdvancedInnovationsList = () => throwError(false);

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;

  //   component.getInnovationsList();
  //   fixture.detectChanges();
  //   expect(component.innovationsList.getRecords()).toEqual([]);

  // });

  // it('should run onFormChange()', fakeAsync(() => {

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.form.get('search')?.setValue('A search text');
  //   (component.form.get('mainCategories') as FormArray).push(new FormControl('MEDICAL_DEVICE'));

  //   tick(500); // Needed because of the debounce on the form.

  //   expect(component.innovationsList.filters).toEqual({
  //     name: 'A search text',
  //     mainCategories: ['MEDICAL_DEVICE'],
  //     locations: [],
  //     engagingOrganisations: [],
  //     supportStatuses: [],
  //     assignedToMe: false,
  //     suggestedOnly: true,
  //   });

  // }));

  // it('should run onTableOrder()', () => {

  //   const dataMock = { count: 0, data: [] };

  //   accessorService.getAdvancedInnovationsList = () => of(dataMock as any);

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onTableOrder('name');
  //   expect(component.innovationsList.orderBy).toEqual('name');

  // });

  // it('should run onOpenCloseFilter() and do nothing with an invalid key', () => {

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;
  //   component.filters[0].showHideStatus = 'closed' as any;

  //   component.onOpenCloseFilter('invalidKey' as any);
  //   expect(component.filters[0].showHideStatus).toBe('closed');

  // });

  // it('should run onOpenCloseFilter() and do nothing with an invalid status', () => {

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;
  //   component.filters[0].showHideStatus = 'invalid status' as any;

  //   component.onOpenCloseFilter('mainCategories');
  //   expect(component.filters[0].showHideStatus).toBe('invalid status');

  // });

  // it('should run onOpenCloseFilter() and close the filter', () => {

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;
  //   component.filters[0].showHideStatus = 'opened';

  //   component.onOpenCloseFilter('mainCategories');
  //   expect(component.filters[0].showHideStatus).toBe('closed');

  // });

  // it('should run onOpenCloseFilter() and open the filter', () => {

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;
  //   component.filters[0].showHideStatus = 'closed';

  //   component.onOpenCloseFilter('mainCategories');
  //   expect(component.filters[0].showHideStatus).toBe('opened');

  // });

  // it('should run onRemoveFilter() with a invalid value', () => {

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;
  //   (component.form.get('mainCategories') as FormArray).push(new FormControl('MEDICAL_DEVICE'));

  //   fixture.detectChanges();
  //   component.onRemoveFilter('mainCategories', 'INVALID VALUE');
  //   expect((component.form.get('mainCategories') as FormArray).length).toBe(1);

  // });

  // it('should run onRemoveFilter()', () => {

  //   fixture = TestBed.createComponent(PageInnovationActivityLogComponent);
  //   component = fixture.componentInstance;
  //   (component.form.get('mainCategories') as FormArray).push(new FormControl('MEDICAL_DEVICE'));

  //   fixture.detectChanges();
  //   component.onRemoveFilter('mainCategories', 'MEDICAL_DEVICE');
  //   expect((component.form.get('mainCategories') as FormArray).length).toBe(0);

  // });
});
