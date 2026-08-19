import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector, PLATFORM_ID } from '@angular/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { InnovationStatusEnum, StoresModule } from '@modules/stores';
import { InnovationContextStore } from '@modules/stores/ctx/innovation/innovation-context.store';
import { SchemaContextStore } from '@modules/stores/ctx/schema/schema.store';
import { innovationsSubSections } from '@modules/stores/innovation/innovation-record/ir-versions.config';

import { InnovationSectionEditComponent } from './section-edit.component';

describe('Innovator/Pages/Innovation/Record/InnovationSectionEditComponent', () => {
  let component: InnovationSectionEditComponent;
  let fixture: ComponentFixture<InnovationSectionEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), LoggerTestingModule, CoreModule, StoresModule],
      declarations: [InnovationSectionEditComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { sectionId: innovationsSubSections.EVIDENCE_OF_EFFECTIVENESS, questionId: 'summary' },
              queryParams: {}
            },
            queryParams: [],
            params: []
          }
        }
      ]
    });

    TestBed.overrideComponent(InnovationSectionEditComponent, { set: { template: '' } });

    AppInjector.setInjector(TestBed.inject(Injector));

    const innovationStore = TestBed.inject(InnovationContextStore);
    const schemaStore = TestBed.inject(SchemaContextStore);

    jest.spyOn(innovationStore, 'info').mockReturnValue({
      id: 'Innovation001',
      status: InnovationStatusEnum.CREATED
    } as any);
    jest.spyOn(innovationStore, 'isArchived').mockReturnValue(false);
    jest
      .spyOn(innovationStore, 'getInnovationRecordSectionWizard')
      .mockReturnValue({ currentStepId: 'summary' } as any);
    jest.spyOn(schemaStore, 'getSubSectionsIds').mockReturnValue([innovationsSubSections.EVIDENCE_OF_EFFECTIVENESS]);
    jest.spyOn(schemaStore, 'getIrSchemaSectionQuestionsIdsList').mockReturnValue([]);
  });

  it('resets mandatory document redirect when evidence answer changes from yes to no', () => {
    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;

    component.sectionInfo = { data: { hasEvidence: 'YES' } } as any;
    component.handleMandatoryDocumentsSections();

    component.sectionInfo = { data: { hasEvidence: 'NO' } } as any;
    component.handleMandatoryDocumentsSections();

    expect(component.allowMarkSectionAsComplete).toBe(true);
    expect(component.summaryRedirectUrl).toBe(component.baseUrl);
  });

  it('keeps the selected regulation status while moving to its certification step', () => {
    fixture = TestBed.createComponent(InnovationSectionEditComponent);
    component = fixture.componentInstance;
    component.sectionId = innovationsSubSections.REGULATIONS_AND_STANDARDS;
    component.isRegulationsSection = true;
    component.isChangeMode = true;
    component.formEngineComponent = {
      getFormValues: () => ({ valid: true, data: { hasMet_UK_MDR_CLASS_I: 'YES' } })
    } as any;
    component.wizard = {
      currentStepId: 3,
      steps: [
        {},
        {},
        { parameters: [{ id: 'hasMet_UK_MDR_CLASS_I', generatedFromAnswer: 'UK_MDR_CLASS_I' }] },
        { parameters: [{ id: 'certifications_UK_MDR_CLASS_I', generatedFromAnswer: 'UK_MDR_CLASS_I' }] }
      ],
      getAnswers: () => ({ hasMet_UK_MDR_CLASS_I: 'IN_PROGRESS' }),
      addAnswers: jest.fn().mockReturnThis(),
      runRules: jest.fn().mockReturnThis(),
      getNextStep: jest.fn().mockReturnValue('summary')
    } as any;
    const updateSectionInfo = jest
      .spyOn((component as any).ctx.innovation, 'updateSectionInfo$')
      .mockReturnValue(of({}));
    const goToStep = jest.spyOn(component, 'onGoToStep').mockImplementation();
    const location = TestBed.inject(Location);
    const replaceState = jest.spyOn(location, 'replaceState');

    component.onSubmitStep('next');

    expect(updateSectionInfo).not.toHaveBeenCalled();
    expect(goToStep).toHaveBeenCalledWith(4, true);
    expect(replaceState).toHaveBeenCalled();
  });
});
