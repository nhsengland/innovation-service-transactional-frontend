import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { AppInjector, CoreModule } from '@modules/core';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';
import { InnovationStore, StoresModule } from '@modules/stores';

import { InnovationOverviewComponent } from './overview.component';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

describe('FeatureModules/Innovator/DashboardComponent', () => {
  let activatedRoute: ActivatedRoute;

  let innovationStore: InnovationStore;
  let innovatorService: InnovatorService;

  let component: InnovationOverviewComponent;
  let fixture: ComponentFixture<InnovationOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, InnovatorModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    innovationStore = TestBed.inject(InnovationStore);
    innovatorService = TestBed.inject(InnovatorService);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should run allStepsComplete()', () => {

  //   fixture = TestBed.createComponent(InnovationOverviewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   component.sections = { progressBar: ['1:active', '1:active'], submitted: 2, draft: 0, notStarted: 0 };

  //   expect(component.allStepsComplete()).toBe(true);

  // });

  // it('should run showNeedsAssessmentCompleteCard()', () => {

  //   fixture = TestBed.createComponent(InnovationOverviewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   component.innovationStatus = 'IN_PROGRESS';

  //   expect(component.showNeedsAssessmentCompleteCard()).toBe(true);

  // });

  // it('should show "innovationCreationSuccess" success', () => {

  //   activatedRoute.snapshot.queryParams = { alert: 'innovationCreationSuccess', name: 'Innovation name' };

  //   const expected = { type: 'SUCCESS', title: `You have successfully registered the innovation 'Innovation name'` };

  //   fixture = TestBed.createComponent(InnovationOverviewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.alert).toEqual(expected);

  // });

  // it('should have innovation information loaded with payload 01', () => {

  //   const responseMock = {
  //     innovation: { status: 'CREATED' },
  //     sections: [
  //       { status: 'NOT_STARTED', isCompleted: false },
  //       { status: 'DRAFT', isCompleted: false },
  //       { status: 'SUBMITTED', isCompleted: true }
  //     ]
  //   };

  //   innovatorService.getInnovatorInnovationInfo = () => of({
  //     id: '',
  //     name: '',
  //     status: InnovationStatusEnum.CREATED,
  //     description: '',
  //     countryName: '',
  //     postcode: '',
  //     submittedAt: '',
  //     actions: { requestedCount: 1, inReviewCount: 2 },
  //     notifications: {}
  //   });

  //   innovationStore.getSectionsSummary$ = () => of({
  //     innovation: { name: '', status: 'CREATED' as keyof typeof INNOVATION_STATUS },
  //     sections: [{
  //       title: '',
  //       sections: [{
  //         id: 'INNOVATION_DESCRIPTION',
  //         title: '',
  //         status: 'NOT_STARTED' as keyof typeof INNOVATION_SECTION_STATUS,
  //         actionStatus: 'STARTED' as keyof typeof INNOVATION_SECTION_ACTION_STATUS,
  //         actionCount: 0,
  //         isCompleted: true
  //       }]
  //     }]
  //   });
  //   innovatorService.getInnovationSupports = () => of([]);

  //   const expected = responseMock.innovation.status;

  //   fixture = TestBed.createComponent(InnovationOverviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationStatus).toEqual(expected);

  // });

  // it('should have innovation information loaded with payload 02', () => {

  //   const responseMock = {
  //     innovation: { status: 'CREATED' },
  //     sections: [
  //       { status: 'NOT_STARTED', isCompleted: false },
  //       { status: 'DRAFT', isCompleted: false },
  //       { status: 'SUBMITTED', isCompleted: true }
  //     ]
  //   };

  //   innovatorService.getInnovatorInnovationInfo = () => of({
  //     id: '',
  //     name: '',
  //     status: InnovationStatusEnum.CREATED,
  //     description: '',
  //     countryName: '',
  //     postcode: '',
  //     submittedAt: '',
  //     assessment: { id: 'assessmentId01' },
  //     actions: { requestedCount: 1, inReviewCount: 2 },
  //     notifications: {}
  //   });

  //   innovationStore.getSectionsSummary$ = () => of({
  //     innovation: { name: '', status: 'CREATED' as keyof typeof INNOVATION_STATUS },
  //     sections: [{
  //       title: '',
  //       sections: [{
  //         id: 'INNOVATION_DESCRIPTION',
  //         title: '',
  //         status: 'NOT_STARTED' as keyof typeof INNOVATION_SECTION_STATUS,
  //         actionStatus: 'STARTED' as keyof typeof INNOVATION_SECTION_ACTION_STATUS,
  //         actionCount: 0,
  //         isCompleted: true
  //       }]
  //     }]
  //   });
  //   innovatorService.getInnovationSupports = () => of([
  //     {
  //       id: 'supportId01',
  //       status: 'ENGAGING' as keyof typeof INNOVATION_SUPPORT_STATUS,
  //       organisationUnit: {
  //         id: 'Unit01', name: 'Organisation unit 01',
  //         organisation: { id: 'Organisation01', name: 'Organisation 01', acronym: 'ORG' }
  //       }
  //     }
  //   ]);

  //   const expected = responseMock.innovation.status;

  //   fixture = TestBed.createComponent(InnovationOverviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationStatus).toEqual(expected);

  // });

  // it('should NOT have innovation information loaded', () => {

  //   innovationStore.getSectionsSummary$ = () => throwError('error');

  //   const expected = { type: 'ERROR', title: 'Unable to fetch innovation record information', message: 'Please try again or contact us for further help' };

  //   fixture = TestBed.createComponent(InnovationOverviewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.alert).toEqual(expected);

  // });
});
