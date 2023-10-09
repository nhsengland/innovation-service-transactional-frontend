import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingAndResourcesComponent } from './training-and-resources.component';

describe('TrainingAndResourcesComponent', () => {
  let component: TrainingAndResourcesComponent;
  let fixture: ComponentFixture<TrainingAndResourcesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingAndResourcesComponent]
    });
    fixture = TestBed.createComponent(TrainingAndResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
