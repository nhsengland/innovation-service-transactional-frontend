import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppInjector, CoreModule } from '@modules/core';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';
import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';
import { StoresModule } from '@modules/stores';

import { InnovationChangeAssessorComponent } from './change-assessor.component';

describe('InnovationChangeAssessorComponent', () => {
  let component: InnovationChangeAssessorComponent;
  let fixture: ComponentFixture<InnovationChangeAssessorComponent>;

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let assessmentService: AssessmentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InnovationChangeAssessorComponent],
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AssessmentModule]
    }).compileComponents();

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    assessmentService = TestBed.inject(AssessmentService);

    fixture = TestBed.createComponent(InnovationChangeAssessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
