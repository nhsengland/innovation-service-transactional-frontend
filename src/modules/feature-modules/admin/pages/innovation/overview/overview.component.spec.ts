import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { InnovationOverviewComponent } from './overview.component';

import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { InnovationsService } from '@modules/shared/services/innovations.service';

describe('FeatureModules/Admin/Innovation/InnovationOverviewComponent', () => {
  let activatedRoute: ActivatedRoute;

  let innovationsService: InnovationsService;

  let component: InnovationOverviewComponent;
  let fixture: ComponentFixture<InnovationOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AdminModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    innovationsService = TestBed.inject(InnovationsService);

    activatedRoute.snapshot.data = {
      innovationData: {
        id: 'Inno01',
        name: 'Innovation 01',
        support: { id: 'Inno01Support01', status: 'ENGAGING' },
        assessment: {}
      }
    };
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
