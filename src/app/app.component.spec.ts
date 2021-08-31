import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { AppComponent } from './app.component';
import { HeaderComponent } from '@modules/theme/components/header/header.component';
import { FooterComponent } from '@modules/theme/components/footer/footer.component';
import { ActivityTimeoutComponent } from '@modules/theme/components/activity-timeout/activity-timeout.component';


describe('AppComponent running SERVER side', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        ActivityTimeoutComponent
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();

  });

});





describe('AppComponent running CLIENT side', () => {

  let router: Router;

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        ActivityTimeoutComponent
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    router = TestBed.inject(Router);

  });

  it('should create the component and execute navigation code', () => {

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    router.navigateByUrl('/'); // Simulate router navigation.

    expect(component).toBeTruthy();

  });

});
