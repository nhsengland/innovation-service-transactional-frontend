import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { PageTermsOfUseComponent } from './terms-of-use.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import {  UserTermsOfUseService } from '@modules/shared/services/userTermsOfuse.service';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageAdminTermsOfUseInfoComponent', () => {

  let component: PageTermsOfUseComponent;
  let fixture: ComponentFixture<PageTermsOfUseComponent>;
  let activatedRoute: ActivatedRoute;
  let userTOUService: UserTermsOfUseService;

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
    userTOUService = TestBed.inject(UserTermsOfUseService);
  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageTermsOfUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT have default information loaded', () => {

    userTOUService.userTermsOfUseInfo = () => throwError('error');

    fixture = TestBed.createComponent(PageTermsOfUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('ERROR');

  });


  it('should have default information loaded', () => {

    userTOUService.userTermsOfUseInfo = () => of(
      {
        id: 'term 01',
        name: 'term',
        touType: 'TEST',
        summary: 'TEST',
        releasedAt: '01-02-2022',
        createdAt: '12-01-2022'
      }
    );

    fixture = TestBed.createComponent(PageTermsOfUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

  });


});
