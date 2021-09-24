import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { InnovationStore, StoresModule } from '@modules/stores';
import { InnovationSectionsIds, INNOVATION_SECTION_ACTION_STATUS, INNOVATION_SECTION_STATUS } from '@modules/stores/innovation/innovation.models';
import { FormEngineComponent } from '@modules/shared/forms';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationSectionEditComponent } from './section-edit.component';


describe('FeatureModules/Innovator/Pages/Innovations/Sections/InnovationSectionEditComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jasmine.Spy;

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

    innovationStore = TestBed.inject(InnovationStore);


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

  it('should run isQuestionStep()', (() => {

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;

    expect(component.isQuestionStep()).toBe(true);

  }));

  it('should run isSummaryStep()', () => {

    activatedRoute.snapshot.params = { sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 'summary' };
    activatedRoute.params = of({ sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 'summary' }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.isSummaryStep()).toBe(true);

  });

  it('should have initial information loaded', fakeAsync(() => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 3 };
    activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 3 });

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    tick(1000);

    expect(component.currentAnswers).toEqual({
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

    component.onSubmitStep('next', new Event(''));
    expect(component.currentAnswers).toEqual({
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

    component.onSubmitStep('next', new Event(''));
    expect(component.currentAnswers).toEqual({
      hasRegulationKnowledge: 'YES_ALL',
      standardsType: [],
      standards: [],
      otherRegulationDescription: null,
      files: [],
    });

  });

  it('should run onSubmitStep() and redirect to next step', () => {

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { hasRegulationKnowledge: 'YES_ALL' } });

    component.onSubmitStep('next', new Event(''));
    expect(routerSpy).toHaveBeenCalledWith(['/innovator/innovations/Inno01/record/sections/REGULATIONS_AND_STANDARDS/edit/2'], {});

  });

  it('should run onSubmitSurvey() and call api with success', () => {

    innovationStore.updateSectionInfo$ = () => of({ hasRegulationKnowledge: 'YES_ALL' });

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitSurvey();
    expect(routerSpy).toHaveBeenCalledWith(['innovator/innovations/Inno01/record/sections/REGULATIONS_AND_STANDARDS'], { queryParams: { alert: 'sectionUpdateSuccess' } });

  });

  it('should run onSubmitSurvey() and call api with error', () => {

    innovationStore.updateSectionInfo$ = () => throwError('error');

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitSurvey();
    expect(routerSpy).toHaveBeenCalledWith(['innovator/innovations/Inno01/record/sections/REGULATIONS_AND_STANDARDS'], { queryParams: { alert: 'sectionUpdateError' } });

  });

  it('should run getNavigationUrl() for summary step when pressing PREVIOUS', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 'summary' };
    activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 'summary' }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getNavigationUrl('previous')).toBe(`/innovator/innovations/Inno01/record/sections/REGULATIONS_AND_STANDARDS/edit/3`);

  });

  it('should run getNavigationUrl() for first step when pressing PREVIOUS', () => {

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.getNavigationUrl('previous')).toBe('/innovator/innovations/Inno01/record/sections/REGULATIONS_AND_STANDARDS');

  });

  it('should run getNavigationUrl() for a question step when pressiong PREVIOUS', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 2 };
    activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 2 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getNavigationUrl('previous')).toBe('/innovator/innovations/Inno01/record/sections/REGULATIONS_AND_STANDARDS/edit/1');

  });

  it('should run getNavigationUrl() for summary step when pressing NEXT', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 'summary' };
    activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 'summary' });

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getNavigationUrl('next')).toBe('/innovator/innovations/Inno01/record/sections/REGULATIONS_AND_STANDARDS/edit/summary');

  });

  it('should run getNavigationUrl() for last step when pressing NEXT', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 3 };
    activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 3 });

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getNavigationUrl('next')).toBe('/innovator/innovations/Inno01/record/sections/REGULATIONS_AND_STANDARDS/edit/summary');

  });

  it('should run getNavigationUrl() for a question step when pressiong NEXT', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 2 };
    activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, questionId: 2 });

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getNavigationUrl('next')).toBe('/innovator/innovations/Inno01/record/sections/REGULATIONS_AND_STANDARDS/edit/3');

  });

  it('should run getNavigationUrl() and return initial URL with INVALID action', () => {

    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.getNavigationUrl('invalidAction' as any)).toBe('/innovator/innovations/Inno01/record');

  });

});
