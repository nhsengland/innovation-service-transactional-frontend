import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { PageAdminTermsOfUseInfoComponent } from './terms-of-use-info.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageAdminTermsOfUseInfoComponent', () => {

  let component: PageAdminTermsOfUseInfoComponent;
  let fixture: ComponentFixture<PageAdminTermsOfUseInfoComponent>;
  let activatedRoute: ActivatedRoute;
  let userService: ServiceUsersService;

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
    activatedRoute = TestBed.inject(ActivatedRoute);
    userService = TestBed.inject(ServiceUsersService);
  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAdminTermsOfUseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT have default information loaded', () => {

    userService.getTermsById = () => throwError('error');

    fixture = TestBed.createComponent(PageAdminTermsOfUseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('ERROR');

  });


  it('should have default information loaded', () => {

    userService.getTermsById = () => of(
      {
        id: 'term 01',
        name: 'term',
        touType: 'TEST',
        summary: 'TEST',
        releasedAt: '01-02-2022',
        createdAt: '12-01-2022'
      }
    );

    fixture = TestBed.createComponent(PageAdminTermsOfUseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

  });


});
