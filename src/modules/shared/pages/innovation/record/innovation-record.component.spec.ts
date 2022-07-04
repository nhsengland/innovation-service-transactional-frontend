import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, InnovationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { PageInnovationRecordComponent } from './innovation-record.component';


describe('Shared/Pages/Innovation/PageInnovationRecordComponent', () => {

  let component: PageInnovationRecordComponent;
  let fixture: ComponentFixture<PageInnovationRecordComponent>;
  let activatedRoute: ActivatedRoute;
  let innovationStore: InnovationStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule,
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
    activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', assessment: {} } };
    innovationStore = TestBed.inject(InnovationStore);
  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(PageInnovationRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

  it('should run isInnovationInCreatedStatus', () => {

    fixture = TestBed.createComponent(PageInnovationRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.innovationStatus = 'CREATED';

    component.isInnovationInCreatedStatus();
    expect(component.innovationStatus).toBe('CREATED');

  });

  it('should run allSectionsSubmitted', () => {

    fixture = TestBed.createComponent(PageInnovationRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.sections.submitted = 1;

    component.allSectionsSubmitted();
    expect(component.sections.submitted).toBe(1);

  });

  it('should run isInAssessmentStatus', () => {

    fixture = TestBed.createComponent(PageInnovationRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.sections.submitted = 1;

    expect(innovationStore.isAssessmentStatus('CREATED')).toBe(false);

  });

});
