import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { ActionLinkComponent } from './action-link.component';
import { RouterModule } from '@angular/router';

describe(`'ActionLinkComponent suite'`, () => {
  let component: ActionLinkComponent;
  let fixture: ComponentFixture<ActionLinkComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [ActionLinkComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionLinkComponent);
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
