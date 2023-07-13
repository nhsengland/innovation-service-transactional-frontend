import { Component, Input, OnChanges } from '@angular/core';

import { AccessorSuggestionModel, AssessmentSuggestionModel, OrganisationSuggestionModel } from '@modules/stores/innovation/innovation.models';

// import { NotificationsService } from '@modules/shared/services/notifications.service';

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

  accessors: {
    suggestors: string,
    organisations: string[]
  };

  showAssessmentsCard: boolean;
  showAccessorsCard: boolean;

  // hasNewSuggestions = false;

  constructor(
    // private notificationsService: NotificationsService,
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
      this.accessors = this.parseAccessors(this.suggestions.accessors ?? []);
      this.assessments = this.parseAssessments(this.suggestions.assessment);

      if (this.assessments && this.assessments.organisations.length > 0) {
        this.showAssessmentsCard = true;
      }

      if (this.accessors && this.accessors.organisations.length > 0) {
        this.showAccessorsCard = true;
      }
    }

    // this.hasNewSuggestions = this.notificationsService.notifications[NotificationContextTypeEnum.DATA_SHARING] ? true : false;
  }

  private parseAccessors(accessorsSuggestions: AccessorSuggestionModel[]): { suggestors: string, organisations: string[] } {
    const shares = new Set(this.shares?.map(s => s.organisationId) || []);
    const accessorsUnits = accessorsSuggestions.map(as => `${as.organisationUnit.name} (${as.organisationUnit.organisation.acronym})`);
    const suggestedOrganisations = accessorsSuggestions
      .flatMap(as => as.suggestedOrganisationUnits
        .map(ou => ou.organisation)
        .filter(so => !shares.has(so.id))
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

    const shares = new Set(this.shares?.map(s => s.organisationId) || []);
    const suggestedOrganisations = (assessmentsSuggestions.suggestedOrganisationUnits ?? [])
      .map(ou => ou.organisation)
      .filter(so => !shares.has(so.id))
      .map(so => `${so.name} (${so.acronym})`);

    // removes duplicate entries
    const organisations = [...new Set(suggestedOrganisations)];

    return {
      organisations,
    };
  }

}
