import { Component, Input } from '@angular/core';
import { AuthenticationStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation';
import { InnovationQASuggestionType as InnovationUnitSuggestionsType } from '@modules/stores/innovation/innovation.models';

@Component({
  selector: 'app-suggestions-cards',
  templateUrl: './suggestions-cards.component.html'
})
export class SuggestionsCardsComponent {
  @Input({ required: true }) innovationId!: string;
  @Input({ required: true }) innovationStatus!: InnovationStatusEnum;
  @Input({ required: true }) suggestions!: InnovationUnitSuggestionsType;

  baseUrl: string;

  constructor(authenticationStore: AuthenticationStore) {
    this.baseUrl = `${authenticationStore.userUrlBasePath()}`;
  }
}
