import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import * as common from '@angular/common';

import { ActivityTimeoutComponent } from './activity-timeout.component';


describe('Theme/Components/ActivityTimeout/ActivityTimeoutComponent', () => {

  let component: ActivityTimeoutComponent;
  let fixture: ComponentFixture<ActivityTimeoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        ActivityTimeoutComponent
      ],
    });

    spyOn(common, 'isPlatformBrowser').and.returnValue(true);

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(ActivityTimeoutComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });


  it('should run check() when on "WARNING"', () => {

    fixture = TestBed.createComponent(ActivityTimeoutComponent);
    component = fixture.componentInstance;

    component.state = 'WARNING';
    component.check();
    fixture.detectChanges();

    expect(component.state).toBe('WARNING');

  });

  it('should run check() when on "IDLE" and change to "WARNING"', () => {

    fixture = TestBed.createComponent(ActivityTimeoutComponent);
    component = fixture.componentInstance;

    component.state = 'IDLE';
    component.minutesToLogout = 0.9;
    component.check();
    fixture.detectChanges();

    expect(component.state).toBe('WARNING');

  });


  it('should run reset() when on "WARNING"', () => {

    fixture = TestBed.createComponent(ActivityTimeoutComponent);
    component = fixture.componentInstance;

    component.state = 'WARNING';
    component.reset();
    fixture.detectChanges();

    expect(component.lastActivityTimestamp).toBeLessThan(Date.now());

  });


  it('should run reset() when on "IDLE"', () => {

    fixture = TestBed.createComponent(ActivityTimeoutComponent);
    component = fixture.componentInstance;

    component.state = 'IDLE';
    component.reset();
    fixture.detectChanges();

    expect(component.lastActivityTimestamp).toBeLessThanOrEqual(Date.now());

  });

  it('should run keepSignedIn()', () => {

    fixture = TestBed.createComponent(ActivityTimeoutComponent);
    component = fixture.componentInstance;

    component.keepSignedIn();
    fixture.detectChanges();

    expect(component.state).toBe('IDLE');

  });

  it('should run decreaseWarningCounter()', () => {

    fixture = TestBed.createComponent(ActivityTimeoutComponent);
    component = fixture.componentInstance;

    component.state = 'WARNING';
    component.decreaseWarningCounter();
    fixture.detectChanges();

    expect(component.warningCounter).toBe(59);

  });

});
