import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppInjector, CoreModule } from '@modules/core';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';
import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';
import { AuthenticationStore, StoresModule, InnovationSupportStatusEnum } from '@modules/stores';
import { USER_INFO_ACCESSOR } from '@tests/data.mocks';

import { InnovationSupportRequestUpdateStatusComponent } from './support-request-update-status.component';

describe('SupportUpdateStatusComponent', () => {
  let component: InnovationSupportRequestUpdateStatusComponent;
  let fixture: ComponentFixture<InnovationSupportRequestUpdateStatusComponent>;

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let authenticationStore: AuthenticationStore;
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

    authenticationStore = TestBed.inject(AuthenticationStore);
    accessorService = TestBed.inject(AccessorService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01', supportId: 'SupportId01' };

    authenticationStore.getUserInfo = () => USER_INFO_ACCESSOR;

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
