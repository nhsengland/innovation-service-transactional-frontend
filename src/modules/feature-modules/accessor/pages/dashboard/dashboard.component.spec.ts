import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';

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
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

  it('should create the component', () => {

    spyOn(authenticationStore, 'isQualifyingAccessorRole').and.returnValue(true);
    spyOn(authenticationStore, 'getUserInfo').and.returnValue({ displayName: 'A user', organisations: [{ name: 'A organisation' }] });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.user).toEqual({ displayName: 'A user', organisation: 'A organisation' });
    expect(component.cardsList[0].title).toBe('Review innovations');

  });

});

