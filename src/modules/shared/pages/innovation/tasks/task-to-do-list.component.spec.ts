import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { SharedModule } from '@modules/shared/shared.module';
import { PageInnovationTaskToDoListComponent } from './task-to-do-list.component';

describe('Shared/Pages/Innovation/PageInnovationTaskToDoTrackerListComponent', () => {
  let activatedRoute: ActivatedRoute;

  let innovationsService: InnovationsService;

  let component: PageInnovationTaskToDoListComponent;
  let fixture: ComponentFixture<PageInnovationTaskToDoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, SharedModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    innovationsService = TestBed.inject(InnovationsService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
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
    fixture = TestBed.createComponent(PageInnovationTaskToDoListComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
