import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { SvgIconComponent } from './svg-icon.component';
import { RouterModule } from '@angular/router';

describe(`'SvgIconComponent suite'`, () => {
  let component: SvgIconComponent;
  let fixture: ComponentFixture<SvgIconComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
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
