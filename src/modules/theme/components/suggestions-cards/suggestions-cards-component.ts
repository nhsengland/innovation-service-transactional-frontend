import { Component, Input } from '@angular/core';
import { CtxStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores';
import { InnovationUnitSuggestionsType } from '@modules/stores/ctx/innovation/innovation.models';

@Component({
  selector: 'app-suggestions-cards',
  templateUrl: './suggestions-cards.component.html'
})
export class SuggestionsCardsComponent {
  @Input({ required: true }) innovationId!: string;
  @Input({ required: true }) innovationStatus!: InnovationStatusEnum;
  @Input({ required: true }) suggestions!: InnovationUnitSuggestionsType;

  constructor(protected ctx: CtxStore) {}
}
