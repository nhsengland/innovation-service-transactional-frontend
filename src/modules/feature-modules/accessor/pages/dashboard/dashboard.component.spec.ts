import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';

import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { DashboardComponent } from './dashboard.component';


describe('FeatureModules/Accessor/Dashboard/DashboardComponent', () => {

  let authenticationStore: AuthenticationStore;

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AccessorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();

  });

  it('should create the component', () => {

    authenticationStore.isQualifyingAccessorRole = () => true;
    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

    const expected = {
      displayName: USER_INFO_INNOVATOR.displayName,
      organisation: USER_INFO_INNOVATOR.organisations[0].name,
      passwordResetOn: '2020-01-01T00:00:00.000Z'
    };

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.user).toEqual(expected);
    expect(component.cardsList[0].title).toBe('Review innovations');

  });

});

