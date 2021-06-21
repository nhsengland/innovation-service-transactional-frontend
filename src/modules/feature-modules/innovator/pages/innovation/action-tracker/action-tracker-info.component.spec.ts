import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovationSectionsIds } from '@modules/stores/innovation/innovation.models';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationActionTrackerInfoComponent } from './action-tracker-info.component';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


describe('FeatureModules/Accessor/Innovation/InnovationActionTrackerInfoComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovatorService: InnovatorService;

  let component: InnovationActionTrackerInfoComponent;
  let fixture: ComponentFixture<InnovationActionTrackerInfoComponent>;

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

    innovatorService = TestBed.inject(InnovatorService);

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationActionTrackerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

  it('should have initial information loaded', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', actionId: 'Action01' };

    const responseMock = {
      id: 'ID01',
      status: 'REQUESTED',
      name: 'Submit section X',
      description: 'some description',
      section: InnovationSectionsIds.COST_OF_INNOVATION,
      createdAt: '2021-04-16T09:23:49.396Z',
      createdBy: 'one guy'    };
    innovatorService.getInnovationActionInfo = () => of(responseMock as any);
    const expected = responseMock;

    fixture = TestBed.createComponent(InnovationActionTrackerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.action).toBe(expected);

  });

  it('should NOT have initial information loaded', () => {

    innovatorService.getInnovationActionInfo = () => throwError('error');

    fixture = TestBed.createComponent(InnovationActionTrackerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.action).toBe(undefined);

  });

});
