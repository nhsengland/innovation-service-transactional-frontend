import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { PageAdminTermsOfUseNewComponent } from './terms-of-use-new.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';
import { of, throwError } from 'rxjs';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageAdminTermsOfUseNewComponent', () => {

  let component: PageAdminTermsOfUseNewComponent;
  let fixture: ComponentFixture<PageAdminTermsOfUseNewComponent>;
  let activatedRoute: ActivatedRoute;
  let userService: ServiceUsersService;
  let router: Router;
  let routerSpy: jasmine.Spy;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AdminModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');
    activatedRoute = TestBed.inject(ActivatedRoute);
    userService = TestBed.inject(ServiceUsersService);
  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAdminTermsOfUseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default information loaded', () => {

    fixture = TestBed.createComponent(PageAdminTermsOfUseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

  });




});
