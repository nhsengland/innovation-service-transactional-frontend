/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PageInnovationManageAccessLeaveInnovationComponent } from './manage-access-leave-innovation.component';

describe('PageInnovationManageAccessLeaveInnovationComponent', () => {
  let component: PageInnovationManageAccessLeaveInnovationComponent;
  let fixture: ComponentFixture<PageInnovationManageAccessLeaveInnovationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageInnovationManageAccessLeaveInnovationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageInnovationManageAccessLeaveInnovationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
