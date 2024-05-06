import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { TermsOfUseService } from '@modules/shared/services/terms-of-use.service';

import { PageTermsOfUseAcceptanceComponent } from './terms-of-use-acceptance.component';
import { RouterModule } from '@angular/router';

describe('Shared/Pages/TermsOfUse/PageTermsOfUseAcceptanceComponent', () => {
  let component: PageTermsOfUseAcceptanceComponent;
  let fixture: ComponentFixture<PageTermsOfUseAcceptanceComponent>;

  let termsOfUseService: TermsOfUseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AdminModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    termsOfUseService = TestBed.inject(TermsOfUseService);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageTermsOfUseAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // it('should have default information loaded', () => {

  //   termsOfUseService.getTermsOfUseLastVersionInfo = () => of({
  //     id: 'termId01',
  //     name: 'term',
  //     summary: 'TEST',
  //     isAccepted: true
  //   });

  //   fixture = TestBed.createComponent(PageTermsOfUseAcceptanceComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.termsOfUseVersion.id).toBe('termId01');

  // });

  // it('should NOT have default information loaded', () => {

  //   termsOfUseService.getTermsOfUseLastVersionInfo = () => throwError('error');

  //   const expected = { type: 'ERROR', title: 'Unable to retrieve information', message: 'Please try again or contact us for further help' };

  //   fixture = TestBed.createComponent(PageTermsOfUseAcceptanceComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });
});
