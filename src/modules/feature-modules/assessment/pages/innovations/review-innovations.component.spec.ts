import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';

import { ReviewInnovationsComponent } from './review-innovations.component';

import { AssessmentService } from '../../services/assessment.service';


describe('FeatureModules/Assessment/Innovations/ReviewInnovationsComponent', () => {

  let activatedRoute: ActivatedRoute;

  let component: ReviewInnovationsComponent;
  let fixture: ComponentFixture<ReviewInnovationsComponent>;

  let assessmentService: AssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AssessmentModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    assessmentService = TestBed.inject(AssessmentService);

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should redirect if no status query param exists', () => {

    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['/assessment/innovations'], { queryParams: { status: 'WAITING_NEEDS_ASSESSMENT' } });

  });

  it('should have default values when status = WAITING_NEEDS_ASSESSMENT', () => {

    activatedRoute.queryParams = of({ status: 'WAITING_NEEDS_ASSESSMENT' });

    const expected = [
      { key: 'name', label: 'Innovation', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'submittedAt', label: 'Submitted', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'location', label: 'Location', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'mainCategory', label: 'Primary category', orderDir: 'none', orderable: true, align: 'text-align-right' }
    ];

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationsList.getHeaderColumns()).toEqual(expected);

  });

  it('should have default values when status = NEEDS_ASSESSMENT', () => {

    activatedRoute.queryParams = of({ status: 'NEEDS_ASSESSMENT' });

    const expected = [
      { key: 'name', label: 'Innovation', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'assessmentStartDate', label: 'Assessment start date', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'assessedBy', label: 'Assessed by', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'mainCategory', label: 'Primary category', orderDir: 'none', orderable: true, align: 'text-align-right' }
    ];

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationsList.getHeaderColumns()).toEqual(expected);

  });

  it('should have default values when status = IN_PROGRESS', () => {

    activatedRoute.queryParams = of({ status: 'IN_PROGRESS' });

    const expected = [
      { key: 'name', label: 'Innovation', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'assessmentDate', label: 'Assessment date', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'engagingEntities', label: 'Engaging entities', orderDir: 'none', orderable: true, align: 'text-align-left' },
      { key: 'mainCategory', label: 'Primary category', orderDir: 'none', orderable: true, align: 'text-align-right' }
    ];

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationsList.getHeaderColumns()).toEqual(expected);

  });

  it('should run getInnovationsList() with success', () => {

    activatedRoute.queryParams = of({ status: 'WAITING_NEEDS_ASSESSMENT' });

    const responseMock = {
      count: 2,
      data: [
        {
          id: '01', name: 'Innovation 01', countryName: 'England', postCode: 'SW01', mainCategory: 'Medical', submittedAt: '',
          assessment: { createdAt: '2021-04-16T09:23:49.396Z', assignTo: 'User Name', finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 01']
        },
        {
          id: '02', name: 'Innovation 02', countryName: 'England', postCode: 'SW01', mainCategory: 'Medical', submittedAt: '',
          assessment: { createdAt: '2021-04-16T09:23:49.396Z', assignTo: 'User Name', finishedAt: '2021-04-16T09:23:49.396' },
          organisations: ['Org. 01']
        }
      ]
    };
    assessmentService.getInnovationsList = () => of(responseMock as any);
    const expected = responseMock.data;

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationsList.getRecords()).toEqual(expected);

  });

  it('should run getInnovationsList() with error', () => {

    activatedRoute.queryParams = of({ status: 'WAITING_NEEDS_ASSESSMENT' });

    assessmentService.getInnovationsList = () => throwError(false);

    const expected = [] as any;

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationsList.getRecords()).toEqual(expected);

  });

  it('should run onTableOrder()', () => {

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onTableOrder('name');
    expect(component.innovationsList.orderBy).toEqual('name');

  });

});
