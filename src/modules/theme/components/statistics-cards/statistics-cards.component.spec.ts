import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsCardsComponent } from './statistics-cards.component';

describe('StatisticsCardsComponent', () => {
  let component: StatisticsCardsComponent;
  let fixture: ComponentFixture<StatisticsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticsCardsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
