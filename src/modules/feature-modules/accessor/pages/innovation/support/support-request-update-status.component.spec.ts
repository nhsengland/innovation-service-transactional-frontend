import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppInjector, CoreModule } from '@modules/core';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';
import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';
import { StoresModule, InnovationSupportStatusEnum, CtxStore } from '@modules/stores';
import { USER_INFO_ACCESSOR } from '@tests/data.mocks';

import { InnovationSupportRequestUpdateStatusComponent } from './support-request-update-status.component';

describe('SupportUpdateStatusComponent', () => {
  let component: InnovationSupportRequestUpdateStatusComponent;
  let fixture: ComponentFixture<InnovationSupportRequestUpdateStatusComponent>;

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let ctx: CtxStore;
  let accessorService: AccessorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InnovationSupportRequestUpdateStatusComponent],
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AccessorModule]
    }).compileComponents();

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    ctx = TestBed.inject(CtxStore);
    accessorService = TestBed.inject(AccessorService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01', supportId: 'SupportId01' };

    ctx.user.getUserInfo = signal(USER_INFO_ACCESSOR);

    fixture = TestBed.createComponent(InnovationSupportRequestUpdateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run onSubmitStep() being on STEP 1, and move to step 2 when status is ENGAGING', () => {
    component.stepNumber = 1;
    component.form.get('status')?.setValue(InnovationSupportStatusEnum.CLOSED);

    fixture.detectChanges();
    component.onSubmitStep();
    expect(component.stepNumber).toEqual(2);
  });
});
