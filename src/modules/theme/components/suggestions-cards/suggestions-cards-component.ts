import { Component, Input } from '@angular/core';
import { AuthenticationStore } from '@modules/stores';
import { InnovationQASuggestionType } from '@modules/stores/innovation/innovation.models';

@Component({
  selector: 'app-suggestions-cards',
  templateUrl: './suggestions-cards.component.html'
})
export class SuggestionsCardsComponent {
  baseUrl: string;
  constructor(authenticationStore: AuthenticationStore) {
    this.baseUrl = `${authenticationStore.userUrlBasePath()}`;
  }
  @Input({ required: true }) innovationId: string = '';
  @Input({ required: true }) suggestions: InnovationQASuggestionType = [];
}
