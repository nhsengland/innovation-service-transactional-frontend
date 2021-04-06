import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
// import { ThemeModule } from '@modules/theme/theme.module';
// import { SharedModule } from '@modules/shared/shared.module';

import { DashboardComponent } from './dashboard.component';


describe('FeatureModule/Innovator/DashboardComponent tests Suite', () => {

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponent }
        ]),
        CoreModule,
        StoresModule,
        // ThemeModule,
        // SharedModule
      ],
      declarations: [
        DashboardComponent,
      ]
    }).compileComponents();

    AppInjector.setInjector(TestBed.inject(Injector));

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
