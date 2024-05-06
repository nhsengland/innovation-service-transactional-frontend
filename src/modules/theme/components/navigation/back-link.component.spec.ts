import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { BackLinkComponent } from './back-link.component';
import { RouterModule } from '@angular/router';

describe('BackLinkComponent suite', () => {
  let component: BackLinkComponent;
  let fixture: ComponentFixture<BackLinkComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [BackLinkComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create instance', () => {
    const actual = fixture.debugElement.nativeElement.innerHTML;

    expect(component).toBeTruthy();
    expect(actual).toContain('Go back');
  });

  it('should create instance with href', () => {
    component.href = '/some-path';
    fixture.detectChanges();

    const actual = fixture.debugElement.nativeElement.innerHTML;
    expect(actual).toContain('href="/some-path"');
    expect(actual).toContain('ng-reflect-router-link="/some-path"');
  });
});
