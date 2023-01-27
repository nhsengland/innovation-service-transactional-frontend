import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { ActionsAdvancedSearchComponent } from './actions-advanced-search.component';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { AccessorService } from '../../services/accessor.service';


describe('FeatureModules/Accessor/Actions/FilterActionComponent', () => {

  let authenticationStore: AuthenticationStore;
  let accessorService: AccessorService;
  let organisationsService: OrganisationsService;
  let component: ActionsAdvancedSearchComponent;
  let fixture: ComponentFixture<ActionsAdvancedSearchComponent>;

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
    fixture = TestBed.createComponent(ActionsAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // it('should run getActionsList() with error', () => {

  //   accessorService.getAdvanceActionsList = () => throwError(false);

  //   fixture = TestBed.createComponent(ActionAdvancedFilterComponent);
  //   component = fixture.componentInstance;

  //   component.getActionsList();
  //   fixture.detectChanges();
  //   expect(component.actionsList.getRecords()).toEqual([]);

  // });

  // it('should run onTableOrder()', () => {

  //   const dataMock = { count: 0, data: [] };

  //   accessorService.getAdvanceActionsList = () => of(dataMock as any);

  //   fixture = TestBed.createComponent(ActionAdvancedFilterComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onTableOrder('name');
  //   expect(component.actionsList.orderBy).toEqual('name');

  // });

  // it('should run onOpenCloseFilter() and do nothing with an invalid key', () => {

  //   fixture = TestBed.createComponent(ActionAdvancedFilterComponent);
  //   component = fixture.componentInstance;
  //   component.filters[0].showHideStatus = 'closed' as any;

  //   component.onOpenCloseFilter('invalidKey' as any);
  //   expect(component.filters[0].showHideStatus).toBe('closed');

  // });
  // it('should run onOpenCloseFilter() and do nothing with an invalid status', () => {

  //   fixture = TestBed.createComponent(ActionAdvancedFilterComponent);
  //   component = fixture.componentInstance;
  //   component.filters[0].showHideStatus = 'invalid status' as any;

  //   component.onOpenCloseFilter('innovationStatus');
  //   expect(component.filters[0].showHideStatus).toBe('invalid status');

  // });


  // it('should run onOpenCloseFilter() and close the filter', () => {

  //   fixture = TestBed.createComponent(ActionAdvancedFilterComponent);
  //   component = fixture.componentInstance;
  //   component.filters[0].showHideStatus = 'opened';

  //   component.onOpenCloseFilter('innovationStatus');
  //   expect(component.filters[0].showHideStatus).toBe('closed');

  // });

  // it('should run onOpenCloseFilter() and open the filter', () => {

  //   fixture = TestBed.createComponent(ActionAdvancedFilterComponent);
  //   component = fixture.componentInstance;
  //   component.filters[0].showHideStatus = 'closed';

  //   component.onOpenCloseFilter('innovationStatus');
  //   expect(component.filters[0].showHideStatus).toBe('opened');

  // });

  // it('should run onTableOrder()', () => {

  //   accessorService.getActionsList = () => of({ count: 0, data: [] });

  //   fixture = TestBed.createComponent(ActionAdvancedFilterComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   component.onTableOrder('name');
  //   expect(component.actionsList.orderBy).toEqual('name');

  // });

  // it('should run onPageChange()', () => {

  //   fixture = TestBed.createComponent(ActionAdvancedFilterComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onPageChange({ pageNumber: 2 });
  //   expect(component.actionsList.page).toBe(2);

  // });

  // it('should run onFormChange()', fakeAsync(() => {

  //   fixture = TestBed.createComponent(ActionAdvancedFilterComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.form.get('search')?.setValue('A search text');
  //   (component.form.get('innovationStatus') as FormArray).push(new FormControl('IN_REVIEW'));

  //   tick(500); // Needed because of the debounce on the form.

  //   expect(component.actionsList.filters).toEqual({
  //     name: 'A search text',
  //     innovationStatus: ['IN_REVIEW'],
  //     innovationSection: []
  //   });

  // }));

  // it('should run onFormChange()', fakeAsync(() => {

  //   fixture = TestBed.createComponent(ActionAdvancedFilterComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.form.get('search')?.setValue('A search text');
  //   (component.form.get('innovationSection') as FormArray).push(new FormControl('VALUE_PROPOSITION'));

  //   tick(500); // Needed because of the debounce on the form.

  //   expect(component.actionsList.filters).toEqual({
  //     name: 'A search text',
  //     innovationStatus: [],
  //     innovationSection: ['VALUE_PROPOSITION']
  //   });

  // }));

  // it('should run onRemoveFilter() with a invalid value', () => {

  //   fixture = TestBed.createComponent(ActionAdvancedFilterComponent);
  //   component = fixture.componentInstance;
  //   (component.form.get('innovationSection') as FormArray).push(new FormControl('VALUE_PROPOSITION'));

  //   fixture.detectChanges();
  //   component.onRemoveFilter('innovationSection', 'INVALID VALUE');
  //   expect((component.form.get('innovationSection') as FormArray).length).toBe(1);

  // });

  // it('should run onRemoveFilter()', () => {

  //   fixture = TestBed.createComponent(ActionAdvancedFilterComponent);
  //   component = fixture.componentInstance;
  //   (component.form.get('innovationSection') as FormArray).push(new FormControl('VALUE_PROPOSITION'));

  //   fixture.detectChanges();
  //   component.onRemoveFilter('innovationSection', 'VALUE_PROPOSITION');
  //   expect((component.form.get('innovationSection') as FormArray).length).toBe(0);

  // });

});
