import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
// import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';
import { InnovationSupportInfoComponent } from './support-info.component';
import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';
//
describe('FeatureModules/Accessor/Innovation/InnovationSupportInfoComponent', () => {

  let activatedRoute: ActivatedRoute;

  let authenticationStore: AuthenticationStore;
  let assessmentService: AssessmentService;

  let component: InnovationSupportInfoComponent;
  let fixture: ComponentFixture<InnovationSupportInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AssessmentModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    authenticationStore = TestBed.inject(AuthenticationStore);
    assessmentService = TestBed.inject(AssessmentService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', support: { id: 'Inno01Support01', status: 'ENGAGING' }, assessment: {} } };

    authenticationStore.getAccessorOrganisationUnitName = () => 'Organisation Unit Name';

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should show "supportUpdateSuccess" alert', () => {

  //   activatedRoute.snapshot.queryParams = { alert: 'supportUpdateSuccess' };

  //   const expected = { type: 'SUCCESS', title: 'Support status updated', message: 'You\'ve updated your support status and posted a comment to the innovator.' };

  //   fixture = TestBed.createComponent(InnovationSupportInfoComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });

  // it('should show "supportOrganisationSuggestSuccess" alert', () => {

  //   activatedRoute.snapshot.queryParams = { alert: 'supportOrganisationSuggestSuccess' };

  //   const expected = { type: 'SUCCESS', title: 'Organisation suggestions sent', message: 'Your suggestions were saved and notifications sent.' };

  //   fixture = TestBed.createComponent(InnovationSupportInfoComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });


  // it('should NOT make an API call', () => {

  //   activatedRoute.snapshot.data.innovationData.support = undefined;

  //   const expected = { organisationUnit: 'Organisation Unit Name', accessors: '', status: '' };

  //   fixture = TestBed.createComponent(InnovationSupportInfoComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationSupport).toEqual(expected);

  // });

  // it('should have support information loaded', () => {

  //   accessorService.getInnovationSupportInfo = () => of({
  //     id: 'SupportId01',
  //     status: 'ENGAGING' as keyof typeof INNOVATION_SUPPORT_STATUS,
  //     accessors: [{ id: '06E12E5C-3BA8-EB11-B566-0003FFD6549F', name: 'qaccesor_1' }],
  //   });

  //   const expected = {
  //     organisationUnit: 'Organisation Unit Name',
  //     accessors: 'qaccesor_1',
  //     status: 'ENGAGING'
  //   };

  //   fixture = TestBed.createComponent(InnovationSupportInfoComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.innovationSupport).toEqual(expected);

  // });

  // it('should NOT have support information loaded due to API error', () => {

  //   accessorService.getInnovationSupportInfo = () => throwError('error');

  //   const expected = { organisationUnit: 'Organisation Unit Name', accessors: '', status: '' };

  //   fixture = TestBed.createComponent(InnovationSupportInfoComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationSupport).toEqual(expected);

  // });

});
