import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageOrganisationUnitInfoComponent } from './organisation-unit-info.component';

describe('PageOrganisationUnitInfoComponent', () => {
  let component: PageOrganisationUnitInfoComponent;
  let fixture: ComponentFixture<PageOrganisationUnitInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageOrganisationUnitInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageOrganisationUnitInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
