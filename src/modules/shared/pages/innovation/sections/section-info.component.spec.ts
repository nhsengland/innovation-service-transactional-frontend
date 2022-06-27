import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, InnovationStore, EnvironmentStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { PageInnovationSectionInfoComponent } from './section-info.component';
import { InnovationSectionsIds } from '@modules/stores/innovation/innovation.models';
import { InnovationStatusEnum } from '@modules/shared/enums';

import { CONTEXT_INNOVATION_INFO } from '@tests/data.mocks';


describe('Shared/Pages/Innovation/InnovationSectionViewComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;

  let environmentStore: EnvironmentStore;
  let innovationStore: InnovationStore;

  let component: PageInnovationSectionInfoComponent;
  let fixture: ComponentFixture<PageInnovationSectionInfoComponent>;

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

    environmentStore = TestBed.inject(EnvironmentStore);
    innovationStore = TestBed.inject(InnovationStore);

    environmentStore.getInnovation = () => ({ ...CONTEXT_INNOVATION_INFO, status: InnovationStatusEnum.IN_PROGRESS });

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageInnovationSectionInfoComponent);
    component = fixture.componentInstance;
    router.navigateByUrl('/'); // Simulate router navigation.
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show "sectionUpdateSuccess" warning', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };
    activatedRoute.snapshot.queryParams = { alert: 'sectionUpdateSuccess' };

    const expected = { type: 'SUCCESS', title: 'Your answers have been confirmed for this section', message: 'Go to next section or return to the full innovation record' };

    fixture = TestBed.createComponent(PageInnovationSectionInfoComponent);
    component = fixture.componentInstance;
    component.innovation = { id: 'Inno01', name: 'Innovation name', status: InnovationStatusEnum.IN_PROGRESS, owner: { isActive: true, name: 'User name' } };
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should show "sectionUpdateError" warning', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };
    activatedRoute.snapshot.queryParams = { alert: 'sectionUpdateError' };

    const expected = { type: 'ERROR', title: 'An error occurred when saving your section', message: 'Please try again or contact us for further help.' };

    fixture = TestBed.createComponent(PageInnovationSectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should show "evidenceUpdateSuccess" warning', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };
    activatedRoute.snapshot.queryParams = { alert: 'evidenceUpdateSuccess' };

    const expected = { type: 'SUCCESS', title: 'Your evidence has been saved', message: 'You need to submit this section for review to notify your supporting accessor(s).' };

    fixture = TestBed.createComponent(PageInnovationSectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should show "evidenceDeleteSuccess" warning', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };
    activatedRoute.snapshot.queryParams = { alert: 'evidenceDeleteSuccess' };

    const expected = { type: 'WARNING', title: 'Your evidence has been deleted' };

    fixture = TestBed.createComponent(PageInnovationSectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should show "evidenceUpdateError" warning', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };
    activatedRoute.snapshot.queryParams = { alert: 'evidenceUpdateError' };

    const expected = { type: 'ERROR', title: 'An error occurred when saving your evidence', message: 'Please try again or contact us for further help.' };

    fixture = TestBed.createComponent(PageInnovationSectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should show NO warning', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.EVIDENCE_OF_EFFECTIVENESS };
    activatedRoute.snapshot.queryParams = {};

    const expected = { type: null };

    fixture = TestBed.createComponent(PageInnovationSectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });


  it('should have initial information loaded FOR an Innovator', () => {

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
    const expected = { id: 'NOT_STARTED', label: 'Not started' };

    fixture = TestBed.createComponent(PageInnovationSectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.section.status).toEqual(expected);

  });


  it('should display a message that section is in DRAFT', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };
    activatedRoute.snapshot.data = { module: 'accessor' };

    const responseMock = {
      section: {
        id: 'someId',
        section: InnovationSectionsIds,
        status: 'DRAFT',
        actionStatus: '',
        updatedAt: '2020-01-01T00:00:00.000Z'
      },
      data: { some: 'values' }
    };
    innovationStore.getSectionInfo$ = () => of(responseMock as any);

    fixture = TestBed.createComponent(PageInnovationSectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.summaryList).toEqual([]);

  });


  it('should NOT have initial information loaded', () => {

    innovationStore.getSectionInfo$ = () => throwError('error');
    const expected = { id: 'UNKNOWN', label: '' };

    fixture = TestBed.createComponent(PageInnovationSectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.section.status).toEqual(expected);

  });


  it('should submit and call api with success', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };

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

    const expected = { type: 'SUCCESS', title: 'Your answers have been confirmed for this section', message: 'Go to next section or return to the full innovation record' };

    fixture = TestBed.createComponent(PageInnovationSectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitSection();
    expect(component.alert).toEqual(expected);


  });

  it('should submit and call api with error', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', sectionId: InnovationSectionsIds.INNOVATION_DESCRIPTION };

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
      type: 'ERROR',
      title: 'An error occurred when submitting your section',
      message: 'Please try again or contact us for further help',
      setFocus: true
    };

    fixture = TestBed.createComponent(PageInnovationSectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitSection();
    expect(component.alert).toEqual(expected);

  });

});
