import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterComponent } from '@modules/theme/components/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';


describe('FooterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        FooterComponent,
      ],
    }).compileComponents();
  });

  it('should create the footer component', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    const footer = fixture.componentInstance;
    expect(footer).toBeTruthy();
  });

  it('should render 5 item links', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('a.nhsuk-footer__list-item-link').length).toEqual(5);
  });

  it('should render Accessibility item link', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('a.nhsuk-footer__list-item-link')[0].textContent).toEqual('Accessibility statement');
  });

  it('should render contact us link', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('a.nhsuk-footer__list-item-link')[1].textContent).toEqual('Contact us');
  });

  it('should render Cookies link', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('a.nhsuk-footer__list-item-link')[2].textContent).toEqual('Cookies');
  });


  it('should render Privacy Policy link', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('a.nhsuk-footer__list-item-link')[3].textContent).toEqual('Privacy policy');
  });

  it('should render Terms and conditions link', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('a.nhsuk-footer__list-item-link')[4].textContent).toEqual('Terms and conditions');
  });

  it('should render copyright', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('p.nhsuk-footer__copyright').textContent).toContain('Crown copyright');
  });

});
