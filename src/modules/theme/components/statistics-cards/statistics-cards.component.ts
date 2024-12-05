import { Component, Input } from '@angular/core';

import { DateISOType } from '@modules/core/interfaces/base.interfaces';

export type StatisticsCardType = {
  title: string;
  label?: string;
  link: string;
  queryParams?: Record<string, any>;

  count?: number;
  total?: number;
  lastMessage?: string;
  overdue?: string;
  date?: DateISOType | null;
  emptyMessageTitle?: string;
  emptyMessage?: string;
};

@Component({
  selector: 'app-statistics-cards',
  templateUrl: './statistics-cards.component.html'
})
export class StatisticsCardsComponent {
  @Input() cardsList: StatisticsCardType[] = [];
  @Input() gridClass = '';
}
