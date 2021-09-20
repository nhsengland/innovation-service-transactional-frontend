import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovationSectionsIds, INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation/innovation.models';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationActionTrackerInfoComponent } from './action-tracker-info.component';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


describe('FeatureModules/Innovator/Innovation/InnovationActionTrackerInfoComponent', () => {

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
    expect(component).toBeTruthy();
  });

  it('should show "actionDeclined" information summary', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', actionId: 'Action01' };
    activatedRoute.snapshot.queryParams = { alert: 'actionDeclined' };

    const expected = { type: 'INFORMATION', title: 'Action declined', message: 'The accessor will be notified.' };

    fixture = TestBed.createComponent(InnovationActionTrackerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should have initial information loaded', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', actionId: 'Action01' };

    const responseMock = {
      id: 'ID01',
      displayId: 'ID01_display',
      status: 'REQUESTED' as keyof typeof INNOVATION_SECTION_ACTION_STATUS,
      name: `Submit section name`,
      description: '',
      section: InnovationSectionsIds.COST_OF_INNOVATION,
      createdAt: '2021-04-16T09:23:49.396Z',
      createdBy: 'Accessor user'
    };

    innovatorService.getInnovationActionInfo = () => of(responseMock);

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
