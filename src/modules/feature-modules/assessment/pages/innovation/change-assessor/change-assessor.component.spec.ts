import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAssessorComponent } from './change-assessor.component';

describe('ChangeAssessorComponent', () => {
  let component: ChangeAssessorComponent;
  let fixture: ComponentFixture<ChangeAssessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeAssessorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeAssessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
