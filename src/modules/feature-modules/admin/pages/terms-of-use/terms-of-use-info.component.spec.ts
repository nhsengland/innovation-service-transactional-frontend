import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { StoresModule } from '@modules/stores';

import { PageTermsOfUseInfoComponent } from './terms-of-use-info.component';

import { TermsOfUseTypeEnum } from '@app/base/enums';
import { AdminUsersService } from '@modules/feature-modules/admin/services/users.service';

describe('FeatureModules/Admin/Pages/TermsOfUse/PageTermsOfUseInfoComponent', () => {
  let component: PageTermsOfUseInfoComponent;
  let fixture: ComponentFixture<PageTermsOfUseInfoComponent>;
  let activatedRoute: ActivatedRoute;
  let userService: AdminUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AdminModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
    activatedRoute = TestBed.inject(ActivatedRoute);
    userService = TestBed.inject(AdminUsersService);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageTermsOfUseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT have default information loaded', () => {
    userService.getTermsById = () => throwError('error');

    fixture = TestBed.createComponent(PageTermsOfUseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus()).toBe('ERROR');
  });

  it('should have default information loaded', () => {
    userService.getTermsById = () =>
      of({
        id: 'term 01',
        name: 'term',
        touType: TermsOfUseTypeEnum.INNOVATOR,
        summary: 'TEST',
        releasedAt: '01-02-2022',
        createdAt: '12-01-2022'
      });

    fixture = TestBed.createComponent(PageTermsOfUseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus()).toBe('READY');
  });
});
