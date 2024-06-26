import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { PrintLinkComponent } from './print-link.component';
import { RouterModule } from '@angular/router';

describe('PrintLinkComponent suite', () => {
  let component: PrintLinkComponent;
  let fixture: ComponentFixture<PrintLinkComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [PrintLinkComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });

  it('should create instance with href', () => {
    component.href = '/some-path';
    fixture.detectChanges();

    const actual = fixture.debugElement.nativeElement.innerHTML;
    expect(actual).toContain('href="/some-path"');
    expect(actual).toContain('ng-reflect-router-link="/some-path"');
  });
});
