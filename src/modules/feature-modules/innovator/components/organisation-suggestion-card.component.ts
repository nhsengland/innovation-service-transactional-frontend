import { Component, Input, OnChanges } from '@angular/core';

import { AccessorSuggestionModel, AssessmentSuggestionModel, OrganisationSuggestionModel } from '@modules/stores/innovation/innovation.models';

import { NotificationContextType, NotificationsService } from '@modules/shared/services/notifications.service';

@Component({
  selector: 'organisation-suggestions-card',
  templateUrl: './organisation-suggestion-card.component.html',
  styleUrls: ['./organisation-suggestion-card.component.scss'],
})
export class OrganisationSuggestionsCardComponent implements OnChanges {

  @Input() suggestions: OrganisationSuggestionModel | undefined;
  @Input() shares: { id: string, status: string }[] | undefined;

  assessments: {
    organisations: string[]
  };

  accessors: {
    suggestors: string,
    organisations: string[]
  };

  showAssessmentsCard: boolean;
  showAccessorsCard: boolean;

  hasNewSuggestions = false;

  constructor(
    private notificationsService: NotificationsService,
  ) {
    this.showAccessorsCard = false;
    this.showAssessmentsCard = false;

    this.assessments = {
      organisations: [],
    };

    this.accessors = {
      suggestors: '',
      organisations: []
    };
  }

  ngOnChanges(): void {

    if (this.suggestions) {
      this.accessors = this.parseAccessors(this.suggestions.accessors);
      this.assessments = this.parseAssessments(this.suggestions.assessment);

      if (this.assessments && this.assessments.organisations.length > 0) {
        this.showAssessmentsCard = true;
      }

      if (this.accessors && this.accessors.organisations.length > 0) {
        this.showAccessorsCard = true;
      }
    }

    this.hasNewSuggestions = this.notificationsService.notifications[NotificationContextType.DATA_SHARING] ? true : false;
  }

  private parseAccessors(accessorsSuggestions: AccessorSuggestionModel[]): { suggestors: string, organisations: string[] } {
    const shares = this.shares?.map(s => s.id) || [];
    const accessorsUnits = accessorsSuggestions.map(as => `${as.organisationUnit.name} ${as.organisationUnit.organisation.acronym}`);
    const suggestedOrganisations = accessorsSuggestions
      .flatMap(as => as.suggestedOrganisations
        .filter(so => !shares.includes(so.id))
        .map(so => `${so.name} (${so.acronym})`)
      );

    // removes duplicate entries
    const organisations = [...new Set(suggestedOrganisations)];
    const accessors = [... new Set(accessorsUnits)];
    return {
      suggestors: accessors.join(', '),
      organisations,
    };
  }

  private parseAssessments(assessmentsSuggestions: AssessmentSuggestionModel): { organisations: string[] } {

    const shares = this.shares?.map(s => s.id) || [];
    const suggestedOrganisations = assessmentsSuggestions.suggestedOrganisations
      .filter(so => !shares.includes(so.id))
      .map(so => `${so.name} (${so.acronym})`);

    // removes duplicate entries
    const organisations = [...new Set(suggestedOrganisations)];

    return {
      organisations,
    };
  }

}
