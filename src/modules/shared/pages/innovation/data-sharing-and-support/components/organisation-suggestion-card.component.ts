import { Component, Input, OnChanges } from '@angular/core';

import { AccessorSuggestionModel, OrganisationSuggestionModel } from '@modules/stores/innovation/innovation.models';

@Component({
  selector: 'app-organisation-suggestions-card',
  templateUrl: './organisation-suggestion-card.component.html',
  styleUrls: ['./organisation-suggestion-card.component.scss'],
})
export class OrganisationSuggestionsCardComponent implements OnChanges {

  @Input() suggestions: OrganisationSuggestionModel | undefined;
  @Input() shares: { organisationId: string }[] | undefined;

  assessments: {
    organisations: string[]
  };

  accessors: AccessorSuggestionModel[] | undefined;

  showAssessments: boolean;
  showAccessors: boolean;

  constructor(
  ) {
    this.showAccessors = false;
    this.showAssessments = false;

    this.assessments = {
      organisations: [],
    };

    this.accessors = [];
    ;
  }

  ngOnChanges(): void {
    if (this.suggestions) {
      this.assessments.organisations = this.suggestions.assessment.suggestedOrganisations.map(i => i.name);
      if (this.assessments && this.assessments.organisations.length > 0) {
        this.showAssessments = true;
      };

      this.accessors = this.suggestions.accessors;
      if(this.accessors && this.accessors.length > 0){
        this.showAccessors = true
      };
    }
  }
}
