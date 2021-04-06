import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {

  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule,
        StoresModule
      ],
      declarations: [
        HeaderComponent
      ]
    }).compileComponents();

  });

  it('should create the Header component', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render header contents', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('header').textContent.length).toBeGreaterThan(0);
  });

  it('should render header contents', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('header').textContent.length).toBeGreaterThan(0);
  });

  it('should render Home item link', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('a.nhsuk-header__navigation-link')[0].textContent).toEqual(' Home ');
  });


  it('should render Apply for support item link', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('a.nhsuk-header__navigation-link')[1].textContent).toEqual(' Starter innovation guide ');
  });

  it('should render Case studies item link', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('a.nhsuk-header__navigation-link')[2].textContent).toEqual(' Case studies ');
  });

  it('should render About the service item link', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('a.nhsuk-header__navigation-link')[3].textContent).toEqual(' About the service ');
  });

  it('should render Sign in item link', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('a.nhsuk-header__navigation-link')[4].textContent).toEqual(' Sign in ');
  });

  it('should show hero section', () => {

    fixture = TestBed.createComponent(HeaderComponent);
    const navEvent = new NavigationEnd(0, '/', '/');
    fixture.detectChanges();

    (fixture.componentInstance as any).subscribe(navEvent);

    expect(fixture.componentInstance.showHeroSection).toBe(true);
  });

  it('should not show hero section', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const navEvent = new NavigationEnd(0, '/test', '/test');

    (fixture.componentInstance as any).subscribe(navEvent);

    expect(fixture.componentInstance.showHeroSection).toBe(false);
  });

  it('should not show hero section when receives null event', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    (fixture.componentInstance as any).subscribe(null);

    expect(fixture.componentInstance.showHeroSection).toBe(false);
  });

  it('should not show hero section when receives undefined event', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    (fixture.componentInstance as any).subscribe(undefined);

    expect(fixture.componentInstance.showHeroSection).toBe(false);
  });

});
