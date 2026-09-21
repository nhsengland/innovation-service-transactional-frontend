import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector, PLATFORM_ID } from '@angular/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { EvidenceDraftService } from '@modules/stores/ctx/evidence/evidenceDraft.store';
import { InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';
import { IrV3TranslatePipe } from '@modules/shared/pipes/ir-v3-translate.pipe';

import { PageInnovationDocumentsNewditComponent } from './document-newdit.component';

describe('Shared/Pages/Innovation/Documents/PageInnovationDocumentsNewditComponent', () => {
  let component: PageInnovationDocumentsNewditComponent;
  let fixture: ComponentFixture<PageInnovationDocumentsNewditComponent>;
  let innovationDocumentsService: InnovationDocumentsService;
  let evidenceDraftService: EvidenceDraftService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), LoggerTestingModule, CoreModule, StoresModule],
      declarations: [PageInnovationDocumentsNewditComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        IrV3TranslatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { innovationId: 'Innovation001' },
              queryParams: { sectionId: 'EVIDENCE_OF_EFFECTIVENESS', evidenceId: 'Evidence001' }
            }
          }
        },
        InnovationDocumentsService
      ]
    });

    TestBed.overrideComponent(PageInnovationDocumentsNewditComponent, { set: { template: '' } });

    AppInjector.setInjector(TestBed.inject(Injector));
    innovationDocumentsService = TestBed.inject(InnovationDocumentsService);
    evidenceDraftService = TestBed.inject(EvidenceDraftService);
    router = TestBed.inject(Router);
  });

  it('does not add a draft document after creating a document from evidence details', () => {
    jest.spyOn(innovationDocumentsService, 'createDocument').mockReturnValue(of({ id: 'Document001' }));
    const addDocumentSpy = jest.spyOn(evidenceDraftService, 'addDocument');
    const navigateSpy = jest.spyOn(router, 'navigate');
    Object.defineProperty(router, 'url', {
      value: '/innovator/innovations/Innovation001/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/Evidence001',
      configurable: true
    });

    fixture = TestBed.createComponent(PageInnovationDocumentsNewditComponent);
    component = fixture.componentInstance;
    component.wizard.runOutboundParsing = jest.fn().mockReturnValue({
      context: { type: 'INNOVATION_EVIDENCE', id: 'Evidence001' },
      name: 'Evidence file',
      description: 'Evidence document',
      file: { id: 'File001' }
    });
    jest.spyOn(component, 'redirectTo').mockImplementation();

    component.onAddEvidenceDocument();

    expect(innovationDocumentsService.createDocument).toHaveBeenCalled();
    expect(addDocumentSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
