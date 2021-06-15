import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationSupportUpdateComponent } from './support-update.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('FeatureModules/Accessor/Innovation/InnovationSupportUpdateComponent', () => {

  let activatedRoute: ActivatedRoute;
  let accessorService: AccessorService;
  let authenticationStore: AuthenticationStore;

  let component: InnovationSupportUpdateComponent;
  let fixture: ComponentFixture<InnovationSupportUpdateComponent>;

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
    accessorService = TestBed.inject(AccessorService);
    authenticationStore = TestBed.inject(AuthenticationStore);

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

  it('should start at step 1', () => {

    accessorService.getInnovationSupportInfo = () => throwError('error');
    const expected = 1;

    fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.stepNumber).toEqual(expected);

  });

  it('should start at step 1', () => {

    accessorService.getInnovationSupportInfo = () => throwError('error');
    const expected = 1;

    fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.stepNumber).toEqual(expected);

  });

  it('should get organisationUnit', () => {

    accessorService.getInnovationSupportInfo = () => throwError('error');
    authenticationStore.getUserInfo = () => ({
      organisations: [
        {
          id: 'org_id',
          isShadow: false,
          name: 'organisation_1',
          role: 'QUALIFYING_ACCESSOR',
          organisationUnits: [
            {
              id: '_unit_id',
              name: 'ORG_UNIT',
            }
          ]
        }
      ],
      displayName: 'Test qualifying Accessor',
      email: 'tqa@example.com',
      id: '_id',
      innovations: [],
      type: 'ACCESSOR',
    });
    const expected = 'ORG_UNIT';

    fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.organisationUnit).toEqual(expected);

  });

  it('should not have support', () => {

    accessorService.getInnovationSupportInfo = () => throwError('error');
    const expected = undefined;

    fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.supportId).toEqual(expected);

  });

  it('should have support with ENGAGING status and accessors assigned', () => {

    accessorService.getInnovationSupportInfo = () => of({
      status: 'ENGAGING',
      accessors: [{id: 'accessor_1', name: 'accessor 1'}]
    });

    const expected = 1;

    fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
    component = fixture.componentInstance;
    component.supportId = 'support_id';

    fixture.detectChanges();
    expect((component.form.get('accessors')?.value as any[]).length).toEqual(expected);
    expect(component.form.get('status')?.value).toEqual('ENGAGING');

  });

  it('should move to step 2 when status is ENGAGING', () => {

    accessorService.getInnovationSupportInfo = () => of({
      status: 'ENGAGING',
      accessors: [{id: 'accessor_1', name: 'accessor 1'}]
    });

    const expected = 2;

    fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
    component = fixture.componentInstance;
    component.supportId = 'support_id';

    fixture.detectChanges();

    component.onSubmitStep();

    expect(component.stepNumber).toEqual(expected);

  });

  it('should move to step 3 when status is NOT ENGAGING', () => {

    accessorService.getInnovationSupportInfo = () => of({
      status: 'NOT_YET',
      accessors: []
    });

    const expected = 3;

    fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
    component = fixture.componentInstance;
    component.supportId = 'support_id';

    fixture.detectChanges();

    component.onSubmitStep();

    expect(component.stepNumber).toEqual(expected);

  });

  it('should Submit when form is valid', () => {

    accessorService.getInnovationSupportInfo = () => of({
      status: 'NOT_YET',
      accessors: []
    });

    accessorService.saveSupportStatus = () => of();

    const expected = true;

    fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
    component = fixture.componentInstance;
    component.supportId = 'support_id';

    fixture.detectChanges();
    component.form.get('comment')?.setValue('TEST COMMENT');
    component.onSubmit();
    expect(component.form.valid).toEqual(expected);

  });

  it('should NOT Submit when form is invalid', () => {

    accessorService.getInnovationSupportInfo = () => of({
      status: 'NOT_YET',
      accessors: []
    });

    accessorService.saveSupportStatus = () => of();

    const expected = false;

    fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
    component = fixture.componentInstance;
    component.supportId = 'support_id';

    fixture.detectChanges();

    component.onSubmit();
    expect(component.form.valid).toEqual(expected);

  });
});
