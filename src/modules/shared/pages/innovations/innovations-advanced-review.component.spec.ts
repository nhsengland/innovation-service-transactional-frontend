import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { AppInjector, CoreModule } from '@modules/core';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';
import { AuthenticationStore, StoresModule } from '@modules/stores';

import { PageInnovationsAdvancedReviewComponent } from './innovations-advanced-review.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';


describe('FeatureModules/Accessor/Innovations/ReviewInnovationsComponent', () => {

  let authenticationStore: AuthenticationStore;
  let accessorService: AccessorService;
  let organisationsService: OrganisationsService;


  let component: PageInnovationsAdvancedReviewComponent;
  let fixture: ComponentFixture<PageInnovationsAdvancedReviewComponent>;

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
    fixture = TestBed.createComponent(PageInnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('should have AccessorRole tabs', () => {

    authenticationStore.isAccessorRole = () => true;

    fixture = TestBed.createComponent(PageInnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.datasets.supportStatuses.length).toBe(2);

  });

  it('should have QualifyingAccessorRole tabs', () => {

    authenticationStore.isQualifyingAccessorRole = () => true;

    fixture = TestBed.createComponent(PageInnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.datasets.supportStatuses.length).toBe(8);

  });

  it('should have default values', () => {

    organisationsService.getOrganisationsList = () => of([
      { id: 'orgId01', name: 'Org name 01', acronym: 'OrgAcronym01', isActive: true, organisationUnits: [] }
    ]);

    fixture = TestBed.createComponent(PageInnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.datasets.engagingOrganisations).toEqual([{ value: 'orgId01', label: 'Org name 01' }]);

  });

  it('should NOT have default values', () => {

    organisationsService.getOrganisationUnitUsersList = () => throwError('error');

    fixture = TestBed.createComponent(PageInnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.datasets.engagingOrganisations).toEqual([]);

  });

  it('should run onFormChange()', fakeAsync(() => {

    fixture = TestBed.createComponent(PageInnovationsAdvancedReviewComponent);
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
      groupedStatuses: []
    });

  }));

  it('should run onOpenCloseFilter() and do nothing with an invalid key', () => {

    fixture = TestBed.createComponent(PageInnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    component.filters[0].showHideStatus = 'closed' as any;

    component.onOpenCloseFilter('invalidKey' as any);
    expect(component.filters[0].showHideStatus).toBe('closed');

  });

  it('should run onOpenCloseFilter() and do nothing with an invalid status', () => {

    fixture = TestBed.createComponent(PageInnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    component.filters[0].showHideStatus = 'invalid status' as any;

    component.onOpenCloseFilter('mainCategories');
    expect(component.filters[0].showHideStatus).toBe('invalid status');

  });

  it('should run onOpenCloseFilter() and close the filter', () => {

    fixture = TestBed.createComponent(PageInnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    component.filters[0].showHideStatus = 'opened';

    component.onOpenCloseFilter('mainCategories');
    expect(component.filters[0].showHideStatus).toBe('closed');

  });

  it('should run onOpenCloseFilter() and open the filter', () => {

    fixture = TestBed.createComponent(PageInnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    component.filters[0].showHideStatus = 'closed';

    component.onOpenCloseFilter('mainCategories');
    expect(component.filters[0].showHideStatus).toBe('opened');

  });

  it('should run onRemoveFilter() with a invalid value', () => {

    fixture = TestBed.createComponent(PageInnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    (component.form.get('mainCategories') as FormArray).push(new FormControl('MEDICAL_DEVICE'));

    fixture.detectChanges();
    component.onRemoveFilter('mainCategories', 'INVALID VALUE');
    expect((component.form.get('mainCategories') as FormArray).length).toBe(1);

  });

  it('should run onRemoveFilter()', () => {

    fixture = TestBed.createComponent(PageInnovationsAdvancedReviewComponent);
    component = fixture.componentInstance;
    (component.form.get('mainCategories') as FormArray).push(new FormControl('MEDICAL_DEVICE'));

    fixture.detectChanges();
    component.onRemoveFilter('mainCategories', 'MEDICAL_DEVICE');
    expect((component.form.get('mainCategories') as FormArray).length).toBe(0);

  });

});
