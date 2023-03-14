/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PageInnovationManageAccessOverviewComponent } from './manage-access-overview.component';

describe('PageInnovationManageAccessOverviewComponent', () => {
  let component: PageInnovationManageAccessOverviewComponent;
  let fixture: ComponentFixture<PageInnovationManageAccessOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageInnovationManageAccessOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageInnovationManageAccessOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
