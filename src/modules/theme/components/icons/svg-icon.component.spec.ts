import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SvgIconComponent } from './svg-icon.component';

describe(`'SvgIconComponent suite'`, () => {
  let component: SvgIconComponent;
  let fixture: ComponentFixture<SvgIconComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SvgIconComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });
});
