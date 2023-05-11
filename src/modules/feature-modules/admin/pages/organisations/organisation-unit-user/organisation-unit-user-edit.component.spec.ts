/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { PageOrganisationUnitUserEditComponent } from './organisation-unit-user-edit.component';


describe('PageOrganisationUnitUserEditComponent', () => {
  let component: PageOrganisationUnitUserEditComponent;
  let fixture: ComponentFixture<PageOrganisationUnitUserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageOrganisationUnitUserEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageOrganisationUnitUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
