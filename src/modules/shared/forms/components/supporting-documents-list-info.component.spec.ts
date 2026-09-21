import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { FormSupportingDocumentListComponent } from './supporting-documents-list-info.component';

describe('FormSupportingDocumentListComponent', () => {
  let component: FormSupportingDocumentListComponent;
  let fixture: ComponentFixture<FormSupportingDocumentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [FormSupportingDocumentListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { innovationId: 'Innovation001', evidenceId: 'Evidence001' }
            }
          }
        }
      ]
    });

    TestBed.overrideComponent(FormSupportingDocumentListComponent, { set: { template: '' } });

    fixture = TestBed.createComponent(FormSupportingDocumentListComponent);
    component = fixture.componentInstance;
  });

  it('includes the evidence id when building add document query params', () => {
    expect(component.addDocumentQueryParams).toEqual({
      entrypoint: 'EVIDENCE_OF_EFFECTIVENESS',
      evidenceId: 'Evidence001'
    });
  });
});
