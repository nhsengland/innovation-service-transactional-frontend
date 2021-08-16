import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, InnovationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationSectionViewComponent } from './section-view.component';
import { InnovationSectionsIds } from '@modules/stores/innovation/innovation.models';


describe('Shared/Pages/Innovation/InnovationSectionViewComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovationStore: InnovationStore;

  let component: InnovationSectionViewComponent;
  let fixture: ComponentFixture<InnovationSectionViewComponent>;

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

    fixture = TestBed.createComponent(InnovationSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

  it('should show "sectionUpdateSuccess" warning', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };
    activatedRoute.snapshot.queryParams = { alert: 'sectionUpdateSuccess' };

    const expected = { type: 'warning', title: 'Your section has been saved', message: 'You need to submit this section before you can submit your Innovation Record for needs assessment.' };

    fixture = TestBed.createComponent(InnovationSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.summaryAlert).toEqual(expected);

  });

  it('should show "sectionUpdateError" warning', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };
    activatedRoute.snapshot.queryParams = { alert: 'sectionUpdateError' };

    const expected = { type: 'error', title: 'An error occured when saving your section', message: 'Please, try again or contact us for further help' };

    fixture = TestBed.createComponent(InnovationSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.summaryAlert).toEqual(expected);

  });

  it('should show "evidenceUpdateSuccess" warning', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };
    activatedRoute.snapshot.queryParams = { alert: 'evidenceUpdateSuccess' };

    const expected = { type: 'warning', title: 'Your evidence has been saved', message: 'You need to submit this section for review to notify your supporting accessor(s)' };

    fixture = TestBed.createComponent(InnovationSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.summaryAlert).toEqual(expected);

  });

  it('should show "evidenceDeleteSuccess" warning', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };
    activatedRoute.snapshot.queryParams = { alert: 'evidenceDeleteSuccess' };

    const expected = { type: 'warning', title: 'Your evidence has been deleted', message: '' };

    fixture = TestBed.createComponent(InnovationSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.summaryAlert).toEqual(expected);

  });

  it('should show "evidenceUpdateError" warning', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };
    activatedRoute.snapshot.queryParams = { alert: 'evidenceUpdateError' };

    const expected = { type: 'error', title: 'An error occured when saving your evidence', message: 'Please, try again or contact us for further help' };

    fixture = TestBed.createComponent(InnovationSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.summaryAlert).toEqual(expected);

  });

  it('should show NO warning', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.EVIDENCE_OF_EFFECTIVENESS };
    activatedRoute.snapshot.queryParams = {};

    const expected = { type: '', title: '', message: '' };

    fixture = TestBed.createComponent(InnovationSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.summaryAlert).toEqual(expected);

  });


  it('should have initial information loaded', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };

    const responseMock = {
      section: {
        id: 'someId',
        section: InnovationSectionsIds,
        status: 'NOT_STARTED',
        actionStatus: '',
        updatedAt: '2020-01-01T00:00:00.000Z'
      },
      data: { some: 'values' }
    };
    innovationStore.getSectionInfo$ = () => of(responseMock as any);
    const expected = 'NOT_STARTED';

    fixture = TestBed.createComponent(InnovationSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.section.status).toBe(expected);

  });

  it('should NOT have initial information loaded', () => {

    innovationStore.getSectionInfo$ = () => throwError('error');
    const expected = 'UNKNOWN';

    fixture = TestBed.createComponent(InnovationSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.section.status).toBe(expected);

  });


  it('should run getEditUrl()', () => {

    fixture = TestBed.createComponent(InnovationSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getEditUrl(1)).toBe('edit/1');

  });


  it('should submit and call api with success', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };

    const responseMock1 = {
      section: {
        id: 'someId',
        section: InnovationSectionsIds,
        status: 'NOT_STARTED',
        actionStatus: '',
        updatedAt: '2020-01-01T00:00:00.000Z'
      },
      data: { some: 'values' }
    };
    innovationStore.getSectionInfo$ = () => of(responseMock1 as any);

    const responseMock2 = { some: 'values' };
    innovationStore.submitSections$ = () => of(responseMock2 as any);

    const expected = {
      type: 'warning',
      title: 'Your section has been submitted',
      message: ''
    };

    fixture = TestBed.createComponent(InnovationSectionViewComponent);
    component = fixture.componentInstance;

    component.onSubmitSection();
    fixture.detectChanges();
    expect(component.summaryAlert).toEqual(expected);


  });

  it('should submit and call api with error', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', assessmentId: 'Assess01', stepId: 1 };

    const responseMock1 = {
      section: {
        id: 'someId',
        section: InnovationSectionsIds,
        status: 'NOT_STARTED',
        actionStatus: '',
        updatedAt: '2020-01-01T00:00:00.000Z'
      },
      data: { some: 'values' }
    };
    innovationStore.getSectionInfo$ = () => of(responseMock1 as any);

    innovationStore.submitSections$ = () => throwError('error');

    const expected = {
      type: 'error',
      title: 'An error occured when submitting your section',
      message: 'Please, try again or contact us for further help'
    };

    fixture = TestBed.createComponent(InnovationSectionViewComponent);
    component = fixture.componentInstance;

    component.onSubmitSection();
    fixture.detectChanges();

    expect(component.summaryAlert).toEqual(expected);

  });

});
