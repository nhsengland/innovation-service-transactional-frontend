import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationSupportOrganisationsSupportStatusSuggestComponent } from './organisations-support-status-suggest.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { FormArray, FormControl } from '@angular/forms';


describe('FeatureModules/Accessor/Innovation/Support/InnovationSupportOrganisationsSupportStatusSuggestComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jasmine.Spy;

  let accessorService: AccessorService;
  let organisationsService: OrganisationsService;

  let component: InnovationSupportOrganisationsSupportStatusSuggestComponent;
  let fixture: ComponentFixture<InnovationSupportOrganisationsSupportStatusSuggestComponent>;

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
    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

    accessorService = TestBed.inject(AccessorService);
    organisationsService = TestBed.inject(OrganisationsService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', support: { id: 'Inno01Support01', status: 'ENGAGING' }, assessment: {} } };

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should be a valid step 1', () => {

    activatedRoute.snapshot.params = { stepId: 1 };

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.isValidStepId()).toBe(true);

  });

  it('should redirected because is not a valid step', () => {

    activatedRoute.snapshot.params = { stepId: 10 }; // Invalid stepId.

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['/not-found'], {});

  });

  it('should have initial information loaded with payload 01', () => {

    activatedRoute.snapshot.params = { stepId: 1 };

    const organisationsResponseMock = [
      {
        id: 'orgId01', name: 'Org name 01', acronym: 'ORG01',
        organisationUnits: [{ id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01' }]
      },
      {
        id: 'orgId02', name: 'Org name 02', acronym: 'ORG02',
        organisationUnits: [
          { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02' },
          { id: 'orgUnitId03', name: 'Org Unit name 03', acronym: 'ORGu03' }
        ]
      }
    ];
    organisationsService.getOrganisationUnits = () => of(organisationsResponseMock);

    accessorService.getInnovationNeedsAssessment = () => of({
      innovation: { id: '01', name: 'Innovation 01' },
      assessment: {
        description: 'description',
        maturityLevel: 'DISCOVERY',
        maturityLevelComment: null,
        hasRegulatoryApprovals: 'YES',
        hasRegulatoryApprovalsComment: null,
        hasEvidence: 'YES',
        hasEvidenceComment: null,
        hasValidation: 'YES',
        hasValidationComment: null,
        hasProposition: 'YES',
        hasPropositionComment: null,
        hasCompetitionKnowledge: 'YES',
        hasCompetitionKnowledgeComment: null,
        hasImplementationPlan: 'YES',
        hasImplementationPlanComment: null,
        hasScaleResource: 'YES',
        hasScaleResourceComment: null,
        summary: null,
        organisations: [organisationsResponseMock[0]],
        assignToName: '',
        finishedAt: null
      },
      support: { id: null }
    });

    accessorService.getInnovationSupports = () => of([{
      id: 'SupportId01', status: 'ENGAGING',
      organisationUnit: {
        id: 'orgUnitId01', name: 'Org Unit name 01',
        organisation: { id: 'orgId01', name: 'Org name 01', acronym: 'ORG01' }
      }
    }]);

    const expected = [
      {
        value: 'orgId01', label: 'Org name 01', description: 'Suggested by needs assessment',
        items: [{
          value: 'orgUnitId01', label: 'Org Unit name 01 (currently engaging)', description: 'Suggested by needs assessment', isEditable: false
        }]
      },
      {
        value: 'orgId02', label: 'Org name 02', description: undefined,
        items: [
          { value: 'orgUnitId02', label: 'Org Unit name 02', description: undefined, isEditable: true },
          { value: 'orgUnitId03', label: 'Org Unit name 03', description: undefined, isEditable: true }
        ]
      }
    ];

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.groupedItems[0]).toEqual(expected[0]);
    expect(component.groupedItems[1]).toEqual(expected[1]);

  });

  it('should NOT have initial information loaded', () => {

    organisationsService.getOrganisationUnits = () => throwError('error');
    accessorService.getInnovationNeedsAssessment = () => throwError('error');
    accessorService.getInnovationSupports = () => throwError('error');

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.groupedItems.length).toBe(0);

  });

  it('should run onSubmitStep() with INVALID form', () => {

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;

    component.onSubmitStep();
    expect(component.form.valid).toEqual(false);

  });

  it('should run onSubmitStep() with VALID form and NO UNITS', () => {

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;

    component.groupedItems = [{
      value: 'orgId', label: 'Org name', description: 'Suggested by needs assessment',
      items: [{
        value: 'orgUnitId', label: 'Org Unit name (currently engaging)', description: 'Suggested by needs assessment', isEditable: false
      }]
    }];
    (component.form.get('organisationUnits') as FormArray)?.push(new FormControl('orgUnitId01'));

    component.onSubmitStep();
    expect(component.chosenUnits).toEqual({ list: [], values: [] });

  });

  it('should run onSubmitStep() with VALID form and ONE UNIT', () => {

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;

    component.groupedItems = [{
      value: 'orgId', label: 'Org name', description: 'Suggested by needs assessment',
      items: [{
        value: 'orgUnitId01', label: 'Org Unit name 01', isEditable: true
      }]
    }];
    (component.form.get('organisationUnits') as FormArray)?.push(new FormControl('orgUnitId01'));

    const expected = { list: [{ organisation: 'Org Unit name 01', units: [] }], values: ['orgUnitId01'] };

    component.onSubmitStep();
    expect(component.chosenUnits).toEqual(expected);

  });

  it('should run onSubmitStep() with VALID form and MORE THAN one UNIT', () => {

    const expected = { list: [{ organisation: 'Org name', units: ['Org Unit name 01', 'Org Unit name 02'] }], values: ['orgUnitId01', 'orgUnitId02'] };

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;

    component.groupedItems = [{
      value: 'orgId', label: 'Org name', description: 'Suggested by needs assessment',
      items: [
        { value: 'orgUnitId01', label: 'Org Unit name 01', isEditable: true },
        { value: 'orgUnitId02', label: 'Org Unit name 02', isEditable: true }
      ]
    }];
    (component.form.get('organisationUnits') as FormArray)?.push(new FormControl('orgUnitId01'));
    (component.form.get('organisationUnits') as FormArray)?.push(new FormControl('orgUnitId02'));

    component.onSubmitStep();
    expect(component.chosenUnits).toEqual(expected);

  });

  // it('should run onSubmit() with UNDEFINED "confirm" form field', () => {

  //   fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
  //   component = fixture.componentInstance;
  //   component.form.removeControl('confirm');

  //   component.onSubmit();
  //   expect(component.form.valid).toEqual(false);

  // });

  it('should run onSubmitStep() with INVALID form', () => {

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;

    component.onSubmit();
    expect(component.form.valid).toEqual(false);

  });

  it('should run onSubmit and call api with success', () => {

    accessorService.suggestNewOrganisations = () => of({ id: 'id' });

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;
    (component.form.get('organisationUnits') as FormArray)?.push(new FormControl('orgUnitId01'));
    component.form.get('comment')?.setValue('A required value');
    component.form.get('confirm')?.setValue(true);

    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['/accessor/innovations/Inno01/support'], { queryParams: { alert: 'supportOrganisationSuggestSuccess' } });

  });

  it('should run onSubmit and call api with error', () => {

    accessorService.suggestNewOrganisations = () => throwError('error');

    const expected = {
      type: 'ERROR',
      title: 'An error occurred when creating an action',
      message: 'Please try again or contact us for further help',
      setFocus: true
    };

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;
    (component.form.get('organisationUnits') as FormArray)?.push(new FormControl('orgUnitId01'));
    component.form.get('comment')?.setValue('A comment');
    component.form.get('confirm')?.setValue(true);

    component.onSubmit();
    expect(component.alert).toEqual(expected);

  });

});
