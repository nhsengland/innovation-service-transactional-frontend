import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { InnovationStore, StoresModule } from '@modules/stores';
import { InnovationSectionEnum } from '@modules/stores/innovation';
import { FormEngineComponent } from '@modules/shared/forms';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationSectionEvidenceEditComponent } from './evidence-edit.component';


describe('FeatureModules/Innovator/Pages/Innovations/Sections/InnovationsSectionEvidenceEditComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let innovationStore: InnovationStore;

  let component: InnovationSectionEvidenceEditComponent;
  let fixture: ComponentFixture<InnovationSectionEvidenceEditComponent>;

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
    routerSpy = jest.spyOn(router, 'navigate');

    innovationStore = TestBed.inject(InnovationStore);


    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 1 };
    activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 1 }); // Simulate activatedRoute.params subscription.

    innovationStore.getSectionEvidence$ = () => of({
      evidenceType: 'CLINICAL',
      clinicalEvidenceType: 'Evidence Type',
      description: 'Evidence description',
      summary: 'Evidence Summary',
      files: [{ id: 'fileId01', displayFileName: 'File 01', url: 'http://filerepository/file01' }]
    });

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });


  // it('should run isCreation()', () => {

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.isCreation()).toBe(true);

  // });

  // it('should run isEdition()', () => {

  //   activatedRoute.snapshot.params = { sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 1 };
  //   activatedRoute.params = of({ sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 1 }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.isEdition()).toBe(true);

  // });
  // it('should run isQuestionStep()', () => {

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.isQuestionStep()).toBe(true);

  // });

  // it('should run isSummaryStep()', () => {

  //   activatedRoute.snapshot.params = { sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 'summary' };
  //   activatedRoute.params = of({ sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 'summary' }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.isSummaryStep()).toBe(true);

  // });

  // it('should have initial information when is a NEW evidence', () => {

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.currentAnswers).toEqual({});

  // });

  // it('should have initial information when EDITING a evidence', () => {

  //   activatedRoute.snapshot.params = { sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 4 };
  //   activatedRoute.params = of({ sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 4 }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.currentAnswers).toEqual({
  //     evidenceType: 'CLINICAL',
  //     clinicalEvidenceType: 'Evidence Type',
  //     description: 'Evidence description',
  //     summary: 'Evidence Summary',
  //     files: [{ id: 'fileId01', name: 'File 01', url: 'http://filerepository/file01' }]
  //   });

  // });

  // it('should NOT have initial information when EDITING a evidence with API error', () => {

  //   activatedRoute.snapshot.params = { sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 1 };
  //   activatedRoute.params = of({ sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 1 }); // Simulate activatedRoute.params subscription.

  //   innovationStore.getSectionEvidence$ = () => throwError('error');

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.pageStatus).toBe('ERROR');

  // });

  // it('should run onSubmitStep() with UNDEFINED formEngineComponent field', () => {

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   component.formEngineComponent = undefined;

  //   component.onSubmitStep('next', new Event(''));
  //   expect(component.currentAnswers).toEqual({});

  // });

  // it('should run onSubmitStep() and DO NOTHING with form NOT valid', () => {

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
  //   component.formEngineComponent.getFormValues = () => ({ valid: false, data: { evidenceType: 'CLINICAL', clinicalEvidenceType: 'Evidence Type' } });

  //   component.onSubmitStep('next', new Event(''));
  //   expect(component.currentAnswers).toEqual({});

  // });

  // it('should run onSubmitStep() and redirect to next step', () => {

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
  //   component.formEngineComponent.getFormValues = () => ({ valid: true, data: { evidenceType: 'CLINICAL', clinicalEvidenceType: 'Evidence Type' } });

  //   component.onSubmitStep('next', new Event(''));
  //   expect(routerSpy).toHaveBeenCalledWith(['/innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/new/2'], {});

  // });

  // it('should run onSubmitSurvey() and call api with success', () => {

  //   innovationStore.upsertSectionEvidenceInfo$ = () => of({ evidenceType: 'CLINICAL' });

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onSubmitSurvey();
  //   expect(routerSpy).toHaveBeenCalledWith(['innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS'], { queryParams: { alert: 'evidenceUpdateSuccess' } });

  // });

  // it('should run onSubmitSurvey() and call api with error', () => {

  //   innovationStore.upsertSectionEvidenceInfo$ = () => throwError('error');

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onSubmitSurvey();
  //   expect(routerSpy).toHaveBeenCalledWith(['innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS'], { queryParams: { alert: 'evidenceUpdateError' } });

  // });


  // it('should run getNavigationUrl() for first step when pressing PREVIOUS and evidence CREATION', () => {

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.getNavigationUrl('previous')).toBe('/innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS');

  // });

  // it('should run getNavigationUrl() for first step when pressing PREVIOUS and evidence EDITING', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 1 };
  //   activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 1 }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getNavigationUrl('previous')).toBe('/innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidencse/evidenceId01');

  // });


  // it('should run getNavigationUrl() for summary step when pressing PREVIOUS', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 'summary' };
  //   activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 'summary' }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getNavigationUrl('previous')).toBe(`/innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/new/3`);

  // });

  // it('should run getNavigationUrl() for a question step when pressiong PREVIOUS', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 2 };
  //   activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 2 }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getNavigationUrl('previous')).toBe('/innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/new/1');

  // });

  // it('should run getNavigationUrl() for summary step when pressing NEXT and evidence CREATION', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 'summary' };
  //   activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 'summary' }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getNavigationUrl('next')).toBe('/innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/new/summary');

  // });

  // it('should run getNavigationUrl() for summary step when pressing NEXT and evidence EDITING', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 'summary' };
  //   activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 'summary' }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getNavigationUrl('next')).toBe('/innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/evidenceId01/edit/summary');

  // });

  // it('should run getNavigationUrl() for last step when pressing NEXT and evidence CREATION', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 3 };
  //   activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 3 }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getNavigationUrl('next')).toBe('/innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/new/summary');

  // });

  // it('should run getNavigationUrl() for last step when pressing NEXT and evidence EDITING', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 4 };
  //   activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 4 }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getNavigationUrl('next')).toBe('/innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/evidenceId01/edit/summary');

  // });

  // it('should run getNavigationUrl() for a question step when pressiong NEXT and evidence CREATION', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 2 };
  //   activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, questionId: 2 }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getNavigationUrl('next')).toBe('/innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/new/3');

  // });

  // it('should run getNavigationUrl() for a question step when pressiong NEXT and evidence EDITING', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 2 };
  //   activatedRoute.params = of({ innovationId: 'Inno01', sectionId: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS, evidenceId: 'evidenceId01', questionId: 2 }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getNavigationUrl('next')).toBe('/innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/evidenceId01/edit/3');

  // });

  // it('should run getNavigationUrl() and return initial URL with INVALID action', () => {

  //   fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.getNavigationUrl('invalidAction' as any)).toBe('/innovator/innovations/Inno01/record');

  // });

});
