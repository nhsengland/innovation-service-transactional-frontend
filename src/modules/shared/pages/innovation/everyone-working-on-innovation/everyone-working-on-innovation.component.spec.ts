import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { PageEveryoneWorkingOnInnovationComponent } from './everyone-working-on-innovation.component';

describe('Shared/Pages/Innovation/Messages/PageInnovationThreadMessagesListComponent', () => {
  let activatedRoute: ActivatedRoute;

  let component: PageEveryoneWorkingOnInnovationComponent;
  let fixture: ComponentFixture<PageEveryoneWorkingOnInnovationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, SharedModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', assessment: {} } };
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageEveryoneWorkingOnInnovationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
