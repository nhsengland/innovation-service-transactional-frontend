import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';

describe('FeatureModules/Accessor/Dashboard/DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, CoreModule, StoresModule, AccessorModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should create the component', () => {

  //   authenticationStore.isQualifyingAccessorRole = () => true;
  //   authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

  //   const expected = {
  //     displayName: USER_INFO_INNOVATOR.displayName,
  //     organisation: USER_INFO_INNOVATOR.organisations[0].name,
  //     passwordResetOn: '2020-01-01T00:00:00.000Z'
  //   };

  //   fixture = TestBed.createComponent(DashboardComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.user).toEqual(expected);
  //   expect(component.cardsList[0].title).toBe('Review innovations');

  // });
});
