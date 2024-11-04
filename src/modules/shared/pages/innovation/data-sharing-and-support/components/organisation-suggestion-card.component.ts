import { Component, Input, OnChanges } from '@angular/core';

import { AccessorSuggestionModel, OrganisationSuggestionModel } from '@modules/stores/ctx/innovation/innovation.models';

@Component({
  selector: 'app-organisation-suggestions-card',
  templateUrl: './organisation-suggestion-card.component.html',
  styleUrls: ['./organisation-suggestion-card.component.scss']
})
export class OrganisationSuggestionsCardComponent implements OnChanges {
  @Input() suggestions: OrganisationSuggestionModel | undefined;
  @Input() shares: { organisationId: string }[] | undefined;

  assessments: {
    organisations: string[];
  };

  accessors: AccessorSuggestionModel[] | undefined;

  showAssessments: boolean;
  showAccessors: boolean;

  constructor() {
    this.showAccessors = false;
    this.showAssessments = false;

    this.assessments = {
      organisations: []
    };

    this.accessors = [];
  }

  ngOnChanges(): void {
    this.showAccessors = false;
    this.showAssessments = false;
    const sharesSet = new Set(this.shares?.map(item => item.organisationId));
    if (this.suggestions) {
      this.assessments.organisations = this.suggestions.assessment.suggestedOrganisations
        .filter(i => !sharesSet.has(i.id))
        .map(i => i.name);
      if (this.assessments && this.assessments.organisations.length > 0) {
        this.showAssessments = true;
      }

      this.accessors = this.suggestions.accessors
        .map(a => ({
          organisation: a.organisation,
          suggestedOrganisations: a.suggestedOrganisations.filter(i => !sharesSet.has(i.id))
        }))
        .filter(a => a.suggestedOrganisations.length > 0);
      if (this.accessors && this.accessors.length > 0) {
        this.showAccessors = true;
      }
    }
  }
}
