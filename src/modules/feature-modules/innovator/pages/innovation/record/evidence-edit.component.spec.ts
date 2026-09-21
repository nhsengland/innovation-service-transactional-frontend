import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector, PLATFORM_ID } from '@angular/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { throwError, of } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { EvidenceDraftService } from '@modules/stores/ctx/evidence/evidenceDraft.store';
import { InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';

import { InnovationSectionEvidenceEditComponent } from './evidence-edit.component';

describe('InnovationSectionEvidenceEditComponent', () => {
  let component: InnovationSectionEvidenceEditComponent;
  let fixture: ComponentFixture<InnovationSectionEvidenceEditComponent>;
  let evidenceDraftService: EvidenceDraftService;
  let innovationDocumentsService: InnovationDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), LoggerTestingModule, CoreModule, StoresModule],
      declarations: [InnovationSectionEvidenceEditComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { innovationId: 'Innovation001', sectionId: 'EVIDENCE_OF_EFFECTIVENESS' },
              queryParams: { entrypoint: 'newDocumentWizard' }
            }
          }
        },
        InnovationDocumentsService
      ]
    });

    TestBed.overrideComponent(InnovationSectionEvidenceEditComponent, { set: { template: '' } });

    AppInjector.setInjector(TestBed.inject(Injector));
    evidenceDraftService = TestBed.inject(EvidenceDraftService);
    innovationDocumentsService = TestBed.inject(InnovationDocumentsService);
  });

  it('restores the save button and shows an error when draft document creation fails', () => {
    fixture = TestBed.createComponent(InnovationSectionEvidenceEditComponent);
    component = fixture.componentInstance;
    component.innovation = { id: 'Innovation001' } as any;
    component.wizard.runOutboundParsing = jest.fn().mockReturnValue({});
    (component as any).ctx.innovation.upsertSectionEvidenceInfo$ = jest.fn().mockReturnValue(of({ id: 'Evidence001' }));
    jest.spyOn(evidenceDraftService, 'documents').mockReturnValue([
      {
        context: { type: 'INNOVATION_EVIDENCE', id: 'Evidence001' },
        name: 'Evidence file',
        description: 'Evidence document',
        file: { id: 'File001', name: 'file.pdf', extension: 'pdf' }
      }
    ]);
    jest.spyOn(evidenceDraftService, 'clearDraft');
    jest.spyOn(innovationDocumentsService, 'createDocument').mockReturnValue(throwError(() => new Error('Failed')));
    const alertSpy = jest.spyOn(component, 'setAlertError');

    component.onSubmitEvidence();

    expect(component.submitButton).toEqual({ isActive: true, label: 'Save' });
    expect(alertSpy).toHaveBeenCalledWith(
      'Your evidence was saved, but we could not save one or more supporting documents. Please try again or contact us for further help.',
      { width: '2.thirds' }
    );
    expect(evidenceDraftService.clearDraft).not.toHaveBeenCalled();
  });
});
