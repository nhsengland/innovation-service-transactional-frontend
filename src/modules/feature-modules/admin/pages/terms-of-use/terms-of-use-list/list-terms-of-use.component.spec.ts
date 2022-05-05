import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { PageAdminTermsOfUseListComponent } from './list-terms-of-use.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageAdminTermsOfUseListComponent', () => {

  let component: PageAdminTermsOfUseListComponent;
  let fixture: ComponentFixture<PageAdminTermsOfUseListComponent>;
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
    fixture = TestBed.createComponent(PageAdminTermsOfUseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT have default information loaded', () => {

    userService.getListOfTerms = () => throwError('error');

    fixture = TestBed.createComponent(PageAdminTermsOfUseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('ERROR');

  });


  it('should have default information loaded', () => {

    userService.getListOfTerms = () => of(
      {
        count: 1,
        data: [{
          id: 'term 01',
          name: 'term',
          touType: 'TEST',
          summary: 'TEST',
          releasedAt: '01-02-2022',
          createdAt: '12-01-2022'
        }]
     }
    );

    fixture = TestBed.createComponent(PageAdminTermsOfUseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

  });

  it('should run onPageChange()', () => {

    fixture = TestBed.createComponent(PageAdminTermsOfUseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onPageChange({ pageNumber: 2 });
    expect(component.terms.page).toBe(2);

  });


  it('should show "versionCreationSuccess" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'versionCreationSuccess' };

    const expected = { type: 'SUCCESS', title: 'You\'ve successfully created new version.' };

    fixture = TestBed.createComponent(PageAdminTermsOfUseListComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });
  it('should show "versionUpdatedSuccess" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'versionUpdatedSuccess' };

    const expected = { type: 'SUCCESS', title: 'You\'ve successfully updated  version.' };

    fixture = TestBed.createComponent(PageAdminTermsOfUseListComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });


});
