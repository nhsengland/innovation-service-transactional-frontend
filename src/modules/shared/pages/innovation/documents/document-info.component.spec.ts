import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector, PLATFORM_ID } from '@angular/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';
import { UserRoleEnum } from '@app/base/enums';

import { PageInnovationDocumentInfoComponent } from './document-info.component';

describe('Shared/Pages/Innovation/Documents/PageInnovationDocumentInfoComponent', () => {
  let component: PageInnovationDocumentInfoComponent;
  let fixture: ComponentFixture<PageInnovationDocumentInfoComponent>;
  let innovationDocumentsService: InnovationDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, LoggerTestingModule, CoreModule, StoresModule],
      declarations: [PageInnovationDocumentInfoComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { innovationId: 'Innovation001', documentId: 'Document001' },
              queryParams: {}
            }
          }
        },
        InnovationDocumentsService
      ]
    });

    TestBed.overrideComponent(PageInnovationDocumentInfoComponent, { set: { template: '' } });

    AppInjector.setInjector(TestBed.inject(Injector));
    innovationDocumentsService = TestBed.inject(InnovationDocumentsService);
  });

  it('redirects to the regulation details page after deleting a regulation document', () => {
    innovationDocumentsService.deleteDocument = () => of(void 0);

    fixture = TestBed.createComponent(PageInnovationDocumentInfoComponent);
    component = fixture.componentInstance;
    component.documentInfo = {
      id: 'Document001',
      context: {
        type: 'INNOVATION_REGULATIONS',
        id: 'CE_UKCA_CLASS_I',
        label: 'Regulations'
      },
      name: 'Class I certificate',
      createdAt: '2026-07-04T00:00:00.000Z',
      createdBy: { name: 'User', role: UserRoleEnum.INNOVATOR, description: 'User, Innovator' },
      file: { id: 'File001', name: 'file.pdf', extension: 'pdf', size: 1000, url: 'https://example.com/file.pdf' },
      canDelete: true,
      locationLink: null
    };
    const redirectSpy = jest.spyOn(component, 'redirectTo').mockImplementation();

    component.onDelete();

    expect(redirectSpy).toHaveBeenCalledWith(
      `${component.baseUrl}/record/sections/REGULATIONS_AND_STANDARDS/regulations/CE_UKCA_CLASS_I`,
      { action: 'deleted' }
    );
  });
});
