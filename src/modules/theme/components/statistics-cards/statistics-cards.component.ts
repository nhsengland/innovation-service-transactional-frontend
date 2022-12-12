import { Component, Input } from '@angular/core';
import { StatisticsCard } from '@modules/shared/services/innovations.dtos';

@Component({
  selector: 'app-statistics-cards',
  templateUrl: './statistics-cards.component.html'
})
export class StatisticsCardsComponent {
  @Input() cardsList: StatisticsCard[] = [];
  @Input() gridClass: string = '';
}
