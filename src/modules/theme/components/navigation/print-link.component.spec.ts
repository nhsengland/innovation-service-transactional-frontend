import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PrintLinkComponent } from './print-link.component';

describe(`'PrintLinkComponent suite'`, () => {

  let component: PrintLinkComponent;
  let fixture: ComponentFixture<PrintLinkComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PrintLinkComponent],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create instance', () => {
    // Act
    expect(component).toBeTruthy();
  });

  it ('should create instance with href', () => {
    // Arrange
    component.href = '/some-path';
    fixture.detectChanges();

    // Act
    const actual = fixture.debugElement.nativeElement.innerHTML;
    expect(actual).toContain('href=\"/some-path\"');
    expect(actual).toContain('ng-reflect-router-link=\"/some-path\"');
  });
});
