import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';

import { InnovationsAdvancedReviewComponent } from './innovations-advanced-review.component';

import { OrganisationsService } from '@shared-module/services/organisations.service';
import { AccessorService } from '../../services/accessor.service';



describe('FeatureModules/Accessor/Innovations/ReviewInnovationsComponent', () => {

  let authenticationStore: AuthenticationStore;
  let accessorService: AccessorService;
  let organisationsService: OrganisationsService;


  let component: InnovationsAdvancedReviewComponent;
  let fixture: ComponentFixture<InnovationsAdvancedReviewComponent>;

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

    authenticationStore = TestBed.inject(AuthenticationStore);
    accessorService = TestBed.inject(AccessorService);
    organisationsService = TestBed.inject(OrganisationsService);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('should have AccessorRole tabs', () => {

    authenticationStore.isAccessorRole = () => true;

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.datasets.supportStatuses.length).toBe(2);

  });

  it('should have QualifyingAccessorRole tabs', () => {

    authenticationStore.isQualifyingAccessorRole = () => true;

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.datasets.supportStatuses.length).toBe(8);

  });

  it('should have default values', () => {

    organisationsService.getAccessorsOrganisations = () => of([
      { id: 'orgId01', name: 'Org name 01' },
      { id: 'org_id', name: 'Org name 02' }
    ]);

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.datasets.engagingOrganisations).toEqual([{ value: 'orgId01', label: 'Org name 01' },
    { value: 'org_id', label: 'Org name 02' }]);

  });

  it('should NOT have default values', () => {

    organisationsService.getAccessorsOrganisations = () => throwError('error');

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.datasets.engagingOrganisations).toEqual([]);

  });

  it('should run getInnovationsList() with success', () => {

    const responseMock = {
      count: 100,
      data: [{
        id: 'id01',
        name: 'Innovation Name',
        mainCategory: '',
        countryName: '',
        submittedAt: '2020-01-01T00:00:00.000Z',
        supportStatus: 'UNASSIGNED' as keyof typeof INNOVATION_SUPPORT_STATUS
      }]
    };
    accessorService.getAdvancedInnovationsList = () => of(responseMock);

    const expected = responseMock.data;

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;

    component.getInnovationsList();
    fixture.detectChanges();
    expect(component.innovationsList.getRecords()).toEqual(expected);

  });

  it('should run getInnovationsList() with error', () => {

    accessorService.getAdvancedInnovationsList = () => throwError(false);

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;

    component.getInnovationsList();
    fixture.detectChanges();
    expect(component.innovationsList.getRecords()).toEqual([]);

  });

  it('should run onFormChange()', fakeAsync(() => {

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.form.get('search')?.setValue('A search text');
    (component.form.get('mainCategories') as FormArray).push(new FormControl('MEDICAL_DEVICE'));

    tick(500); // Needed because of the debounce on the form.

    expect(component.innovationsList.filters).toEqual({
      name: 'A search text',
      mainCategories: ['MEDICAL_DEVICE'],
      locations: [],
      engagingOrganisations: [],
      supportStatuses: [],
      assignedToMe: false,
      suggestedOnly: true,
    });

  }));

  it('should run onTableOrder()', () => {

    const dataMock = { count: 0, data: [] };

    accessorService.getAdvancedInnovationsList = () => of(dataMock as any);

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onTableOrder('name');
    expect(component.innovationsList.orderBy).toEqual('name');

  });

  it('should run onOpenCloseFilter() and do nothing with an invalid key', () => {

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    component.filters[0].showHideStatus = 'closed' as any;

    component.onOpenCloseFilter('invalidKey' as any);
    expect(component.filters[0].showHideStatus).toBe('closed');

  });

  it('should run onOpenCloseFilter() and do nothing with an invalid status', () => {

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    component.filters[0].showHideStatus = 'invalid status' as any;

    component.onOpenCloseFilter('mainCategories');
    expect(component.filters[0].showHideStatus).toBe('invalid status');

  });

  it('should run onOpenCloseFilter() and close the filter', () => {

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    component.filters[0].showHideStatus = 'opened';

    component.onOpenCloseFilter('mainCategories');
    expect(component.filters[0].showHideStatus).toBe('closed');

  });

  it('should run onOpenCloseFilter() and open the filter', () => {

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    component.filters[0].showHideStatus = 'closed';

    component.onOpenCloseFilter('mainCategories');
    expect(component.filters[0].showHideStatus).toBe('opened');

  });

  it('should run onRemoveFilter() with a invalid value', () => {

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    (component.form.get('mainCategories') as FormArray).push(new FormControl('MEDICAL_DEVICE'));

    fixture.detectChanges();
    component.onRemoveFilter('mainCategories', 'INVALID VALUE');
    expect((component.form.get('mainCategories') as FormArray).length).toBe(1);

  });

  it('should run onRemoveFilter()', () => {

    fixture = TestBed.createComponent(InnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    (component.form.get('mainCategories') as FormArray).push(new FormControl('MEDICAL_DEVICE'));

    fixture.detectChanges();
    component.onRemoveFilter('mainCategories', 'MEDICAL_DEVICE');
    expect((component.form.get('mainCategories') as FormArray).length).toBe(0);

  });

});
