import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { CoreModule, AppInjector } from '@modules/core';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';
import { CtxStore, StoresModule } from '@modules/stores';
import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { PageDashboardComponent } from './dashboard.component';

describe('FeatureModules/Innovator/Dashboard/PageDashboardComponent', () => {
  let component: PageDashboardComponent;
  let fixture: ComponentFixture<PageDashboardComponent>;
  let ctx: CtxStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, InnovatorModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
    ctx = TestBed.inject(CtxStore);
  });

  it('should prefer givenName and surname over a conflicting legacy displayName', () => {
    ctx.user.getUserInfo = signal({
      ...USER_INFO_INNOVATOR,
      givenName: 'Elizabeth',
      surname: 'Jones',
      displayName: 'Liz Jones'
    });

    fixture = TestBed.createComponent(PageDashboardComponent);
    component = fixture.componentInstance;

    expect(component.user.displayName).toBe('Elizabeth Jones');
  });

  it('should fall back to displayName when either split name is missing', () => {
    ctx.user.getUserInfo = signal({
      ...USER_INFO_INNOVATOR,
      givenName: '',
      surname: 'Jones',
      displayName: 'Liz Jones'
    });

    fixture = TestBed.createComponent(PageDashboardComponent);
    component = fixture.componentInstance;

    expect(component.user.displayName).toBe('Liz Jones');
  });
});
