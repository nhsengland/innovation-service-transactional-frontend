import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageTermsOfUseListComponent } from './terms-of-use-list.component';

import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


describe('FeatureModules/Admin/Pages/TermsOfUse/PageTermsOfUseListComponent', () => {

  let component: PageTermsOfUseListComponent;
  let fixture: ComponentFixture<PageTermsOfUseListComponent>;
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
    fixture = TestBed.createComponent(PageTermsOfUseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT have default information loaded', () => {

    userService.getListOfTerms = () => throwError('error');

    fixture = TestBed.createComponent(PageTermsOfUseListComponent);
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

    fixture = TestBed.createComponent(PageTermsOfUseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

  });

  it('should run onPageChange()', () => {

    fixture = TestBed.createComponent(PageTermsOfUseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onPageChange({ pageNumber: 2 });
    expect(component.terms.page).toBe(2);

  });


  it('should show "versionCreationSuccess" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'versionCreationSuccess' };

    const expected = { type: 'SUCCESS', title: 'You\'ve successfully created new version.' };

    fixture = TestBed.createComponent(PageTermsOfUseListComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });
  it('should show "versionUpdatedSuccess" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'versionUpdatedSuccess' };

    const expected = { type: 'SUCCESS', title: 'You\'ve successfully updated  version.' };

    fixture = TestBed.createComponent(PageTermsOfUseListComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });


});
