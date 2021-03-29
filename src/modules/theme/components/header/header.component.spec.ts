import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientModule } from '@angular/common/http';
import { NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './header.component';

import { CoreModule } from '@modules/core/core.module';
import { StoreModule } from '@modules/stores/store.module';
// import { EnvironmentStore } from '@modules/stores/environment/environment.store';

import { AuthenticationService } from '@modules/core/services/authentication.service';

describe('HeaderComponent', () => {

  // let environmentStore: EnvironmentStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        CoreModule,
        StoreModule
      ],
      declarations: [
        HeaderComponent,
      ],
      providers: [
        AuthenticationService
        // { provide: EnvironmentStore, useValue: environmentStore }
      ]
    }).compileComponents();
  });

  it('should create the Header component', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const header = fixture.componentInstance;
    expect(header).toBeTruthy();
  });

  it('should render header contents', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('header').textContent.length).toBeGreaterThan(0);
  });

  it('should render header contents', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('header').textContent.length).toBeGreaterThan(0);
  });

  it('should render Home item link', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('a.nhsuk-header__navigation-link')[0].textContent).toEqual(' Home ');
  });


  it('should render Apply for support item link', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('a.nhsuk-header__navigation-link')[1].textContent).toEqual(' Starter innovation guide ');
  });

  it('should render Case studies item link', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('a.nhsuk-header__navigation-link')[2].textContent).toEqual(' Case studies ');
  });

  it('should render About the service item link', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('a.nhsuk-header__navigation-link')[3].textContent).toEqual(' About the service ');
  });

  it('should render Sign in item link', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('a.nhsuk-header__navigation-link')[4].textContent).toEqual(' Sign in ');
  });

  it('should show hero section', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const navEvent = new NavigationEnd(0, '/', '/');

    // act
    (fixture.componentInstance as any).subscribe(navEvent);

    expect(fixture.componentInstance.showHeroSection).toBe(true);
  });

  it('should not show hero section', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const navEvent = new NavigationEnd(0, '/test', '/test');

    // act
    (fixture.componentInstance as any).subscribe(navEvent);

    expect(fixture.componentInstance.showHeroSection).toBe(false);
  });

  it('should not show hero section when receives null event', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    // act
    (fixture.componentInstance as any).subscribe(null);

    expect(fixture.componentInstance.showHeroSection).toBe(false);
  });

  it('should not show hero section when receives undefined event', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    // act
    (fixture.componentInstance as any).subscribe(undefined);

    expect(fixture.componentInstance.showHeroSection).toBe(false);
  });

});
