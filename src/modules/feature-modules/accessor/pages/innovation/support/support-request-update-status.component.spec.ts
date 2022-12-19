import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnovationSupportRequestUpdateStatusComponent } from './support-request-update-status.component';

describe('SupportUpdateStatusComponent', () => {
  let component: InnovationSupportRequestUpdateStatusComponent;
  let fixture: ComponentFixture<InnovationSupportRequestUpdateStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnovationSupportRequestUpdateStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnovationSupportRequestUpdateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
