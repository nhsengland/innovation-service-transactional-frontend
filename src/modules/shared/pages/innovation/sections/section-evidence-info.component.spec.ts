import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, InnovationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { PageInnovationSectionEvidenceInfoComponent } from './section-evidence-info.component';
import { InnovationSectionsIds } from '@modules/stores/innovation/innovation.models';


describe('Shared/Pages/Innovation/PageInnovationSectionEvidenceInfoComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovationStore: InnovationStore;

  let component: PageInnovationSectionEvidenceInfoComponent;
  let fixture: ComponentFixture<PageInnovationSectionEvidenceInfoComponent>;

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

    innovationStore = TestBed.inject(InnovationStore);

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(PageInnovationSectionEvidenceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should have innovation information loaded', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.EVIDENCE_OF_EFFECTIVENESS };

    const responseMock = {
      evidenceType: 'CLINICAL',
      clinicalEvidenceType: 'UNPUBLISHED_DATA',
      description: '',
      summary: '',
      files: [{ id: 'file01', displayFileName: 'filename.pdf', url: 'http://some.url' }]
    };
    innovationStore.getSectionEvidence$ = () => of(responseMock as any);
    const expected = 'Unpublished data';

    fixture = TestBed.createComponent(PageInnovationSectionEvidenceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.evidence.title).toBe(expected);

  });

  it('should NOT have innovation information loaded', () => {

    innovationStore.getSectionEvidence$ = () => throwError('error');
    const expected = '';

    fixture = TestBed.createComponent(PageInnovationSectionEvidenceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.evidence.title).toBe(expected);

  });


  it('should run getEditUrl()', () => {

    fixture = TestBed.createComponent(PageInnovationSectionEvidenceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getEditUrl(1)).toBe('edit/1');

  });


  it('should delete evidence with success', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.EVIDENCE_OF_EFFECTIVENESS };
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    const responseMock = true;
    innovationStore.deleteEvidence$ = () => of(responseMock as any);

    fixture = TestBed.createComponent(PageInnovationSectionEvidenceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onDeleteEvidence();
    expect(routerSpy).toHaveBeenCalledWith(['innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS'], { queryParams: { alert: 'evidenceDeleteSuccess' } });

  });

  it('should NOT delete evidence with API error', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.EVIDENCE_OF_EFFECTIVENESS };
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    innovationStore.deleteEvidence$ = () => throwError('error');

    fixture = TestBed.createComponent(PageInnovationSectionEvidenceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onDeleteEvidence();
    expect(routerSpy).toHaveBeenCalledWith(['innovator/innovations/Inno01/record/sections/EVIDENCE_OF_EFFECTIVENESS'], { queryParams: { alert: 'evidenceDeleteError' } });

  });

});
