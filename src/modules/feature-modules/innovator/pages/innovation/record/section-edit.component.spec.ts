import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { InnovationStore, StoresModule, AuthenticationStore, ContextStore } from '@modules/stores';
import { InnovationSectionsIds, INNOVATION_SECTION_ACTION_STATUS, INNOVATION_SECTION_STATUS } from '@modules/stores/innovation/innovation.models';
import { FormEngineComponent } from '@modules/shared/forms';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationSectionEditComponent } from './section-edit.component';
import { CONTEXT_INNOVATION_INFO, USER_INFO_INNOVATOR } from '@tests/data.mocks';


describe('FeatureModules/Innovator/Pages/Innovations/Sections/InnovationSectionEditComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jasmine.Spy;

  let authenticationStore: AuthenticationStore;
  let contextStore: ContextStore;
  let innovationStore: InnovationStore;

  let component: InnovationSectionEditComponent;
  let fixture: ComponentFixture<InnovationSectionEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

    authenticationStore = TestBed.inject(AuthenticationStore);
    contextStore = TestBed.inject(ContextStore);
    innovationStore = TestBed.inject(InnovationStore);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;
    contextStore.getInnovation = () => CONTEXT_INNOVATION_INFO;


    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 1 };
    activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 1 });
    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', support: { id: 'Inno01Support01', status: 'ENGAGING' }, assessment: {} } };

    innovationStore.getSectionInfo$ = () => of({
      section: {
        id: '',
        section: InnovationSectionsIds.REGULATIONS_AND_STANDARDS,
        status: 'DRAFT' as keyof typeof INNOVATION_SECTION_STATUS,
        actionStatus: '' as keyof typeof INNOVATION_SECTION_ACTION_STATUS,
        updatedAt: '2020-01-01T00:00:00.000Z',
      },
      data: {
        hasRegulationKnowledge: 'YES_ALL',
        standards: [],
        otherRegulationDescription: null,
        files: []
      }
    });

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });


  it('should have initial information loaded', fakeAsync(() => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 3 };
    activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 3 });

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    tick(1000);

    expect(component.wizard.getAnswers()).toEqual({
      hasRegulationKnowledge: 'YES_ALL',
      standardsType: [],
      standards: [],
      otherRegulationDescription: null,
      files: [],
    });

  }));

  it('should NOT have initial information loaded', () => {

    innovationStore.getSectionInfo$ = () => throwError('error');

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('ERROR');

  });

  it('should run onSubmitStep() with UNDEFINED formEngineComponent field', () => {

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.formEngineComponent = undefined;

    component.onSubmitStep('next');
    expect(component.wizard.getAnswers()).toEqual({
      hasRegulationKnowledge: 'YES_ALL',
      standardsType: [],
      standards: [],
      otherRegulationDescription: null,
      files: [],
    });

  });

  it('should run onSubmitStep() and DO NOTHING with form NOT valid', () => {

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: false, data: { hasRegulationKnowledge: 'YES_ALL' } });

    component.onSubmitStep('next');
    expect(component.wizard.getAnswers()).toEqual({
      hasRegulationKnowledge: 'YES_ALL',
      standardsType: [],
      standards: [],
      otherRegulationDescription: null,
      files: [],
    });

  });

  it('should run onSubmitStep() and redirect to next step', () => {

    authenticationStore.initializeAuthentication$ = () => of(true);
    innovationStore.updateSectionInfo$ = () => of({ hasRegulationKnowledge: 'YES_ALL' });

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { hasRegulationKnowledge: 'YES_ALL' } });

    component.onSubmitStep('next');
    expect(component.wizard.currentStepId).toBe(2);

  });

  it('should run onSubmitSection() and call api with success', () => {

    const responseMock2 = { some: 'values' };
    innovationStore.submitSections$ = () => of(responseMock2 as any);
    authenticationStore.initializeAuthentication$ = () => of(true);

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitSection();
    expect(routerSpy).toHaveBeenCalledWith(['innovator/innovations/innovationId01/record/sections/REGULATIONS_AND_STANDARDS'], { queryParams: { alert: 'sectionUpdateSuccess' } });

  });

  it('should run onSubmitSection() and call api with error', () => {

    innovationStore.submitSections$ = () => throwError('error');

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitSection();
    expect(routerSpy).toHaveBeenCalledWith(['innovator/innovations/innovationId01/record/sections/REGULATIONS_AND_STANDARDS'], { queryParams: { alert: 'sectionUpdateError' } });

  });

});
