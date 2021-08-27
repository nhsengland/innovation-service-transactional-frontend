import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BackLinkComponent } from './back-link.component';


describe('BackLinkComponent suite', () => {

  let component: BackLinkComponent;
  let fixture: ComponentFixture<BackLinkComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BackLinkComponent],
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

  it ('should create instance with href', () => {

    component.href = '/some-path';
    fixture.detectChanges();


    const actual = fixture.debugElement.nativeElement.innerHTML;
    expect(actual).toContain('href=\"/some-path\"');
    expect(actual).toContain('ng-reflect-router-link=\"/some-path\"');

  });

});
