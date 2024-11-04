import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationDataSharingChangeComponent } from './data-sharing-change.component';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

describe('FeatureModules/Innovator/Pages/Innovation/DataSharingChangeComponent', () => {
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let innovatorService: InnovatorService;
  let organisationsService: OrganisationsService;

  let component: InnovationDataSharingChangeComponent;
  let fixture: ComponentFixture<InnovationDataSharingChangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, InnovatorModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    innovatorService = TestBed.inject(InnovatorService);
    organisationsService = TestBed.inject(OrganisationsService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationDataSharingChangeComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should load initial data', () => {

  //   organisationsService.getAccessorsOrganisations = () => of([
  //     { id: 'orgId01', name: 'Org name 01' },
  //     { id: 'org_id', name: 'Org name 02' }
  //   ]);

  //   innovatorService.getInnovationShares = () => of([
  //     { id: 'orgId01', status: 'Org name 01' as keyof typeof INNOVATION_SUPPORT_STATUS },
  //     { id: 'org_id', status: 'Org name 02' as keyof typeof INNOVATION_SUPPORT_STATUS }
  //   ]);

  //   const expected = [
  //     { value: 'orgId01', label: 'Org name 01' },
  //     { value: 'org_id', label: 'Org name 02' }
  //   ];

  //   fixture = TestBed.createComponent(InnovationDataSharingChangeComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.organisationsList).toEqual(expected);

  // });

  // it('should NOT load initial data', () => {

  //   organisationsService.getAccessorsOrganisations = () => throwError(false);
  //   innovatorService.getInnovationShares = () => throwError(false);

  //   const expected = {
  //     type: 'ERROR',
  //     title: 'Unable to fetch data sharing information',
  //     message: 'Please try again or contact us for further help'
  //   };

  //   fixture = TestBed.createComponent(InnovationDataSharingChangeComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });

  // it('should run onSubmit and call api with success', () => {

  //   innovatorService.submitOrganisationSharing = () => of({ id: 'DataSharingId01' });

  //   fixture = TestBed.createComponent(InnovationDataSharingChangeComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmit();
  //   expect(routerSpy).toHaveBeenCalledWith(['/innovator/innovations/Inno01/support'], { queryParams: { alert: 'sharingUpdateSuccess' } });

  // });

  // it('should run onSubmit() and call api with error', () => {

  //   innovatorService.submitOrganisationSharing = () => throwError(false);

  //   fixture = TestBed.createComponent(InnovationDataSharingChangeComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmit();
  //   expect(routerSpy).toHaveBeenCalledWith(['/innovator/innovations/Inno01/support'], { queryParams: { alert: 'sharingUpdateError' } });

  // });

  // it('should run dataSharingValidation() and show warning', () => {

  //   organisationsService.getAccessorsOrganisations = () => of([
  //     { id: 'orgId01', name: 'Org name 01' },
  //     { id: 'org_id', name: 'Org name 02' }
  //   ]);

  //   innovatorService.getInnovationShares = () => of([
  //     { id: 'orgId01', status: 'Org name 01' as keyof typeof INNOVATION_SUPPORT_STATUS },
  //     { id: 'org_id', status: 'Org name 02' as keyof typeof INNOVATION_SUPPORT_STATUS }
  //   ]);

  //   fixture = TestBed.createComponent(InnovationDataSharingChangeComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   (component.form.get('organisations') as FormArray).removeAt(1);

  //   component.dataSharingValidation();
  //   expect(component.showDataSharingValidationWarning).toBe(true);

  // });
});
