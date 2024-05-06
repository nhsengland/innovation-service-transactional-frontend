import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { FooterComponent } from './footer.component';
import { ActivityTimeoutComponent } from '../activity-timeout/activity-timeout.component';
import { RouterModule } from '@angular/router';

describe('Theme/Components/Footer/FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, HttpClientTestingModule, CoreModule, StoresModule],
      declarations: [FooterComponent, ActivityTimeoutComponent]
    });
  });

  it('should create the footer component', () => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render 5 item links', () => {
    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;

    expect(element.querySelectorAll('a.nhsuk-footer__list-item-link').length).toEqual(5);
  });

  it('should render Accessibility item link', () => {
    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;

    expect(element.querySelectorAll('a.nhsuk-footer__list-item-link')[0].textContent).toEqual(
      'Accessibility statement'
    );
  });

  it('should render contact us link', () => {
    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;

    expect(element.querySelectorAll('a.nhsuk-footer__list-item-link')[1].textContent).toEqual('Contact us');
  });

  it('should render Cookies link', () => {
    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;

    expect(element.querySelectorAll('a.nhsuk-footer__list-item-link')[2].textContent).toEqual('Cookies');
  });

  it('should render Privacy Policy link', () => {
    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;

    expect(element.querySelectorAll('a.nhsuk-footer__list-item-link')[3].textContent).toEqual('Privacy policy');
  });

  it('should render Terms and conditions link', () => {
    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;

    expect(element.querySelectorAll('a.nhsuk-footer__list-item-link')[4].textContent).toEqual('Terms of use');
  });

  it('should render copyright', () => {
    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;

    expect(element.querySelector('p.nhsuk-footer__copyright').textContent).toContain('Crown copyright');
  });
});
