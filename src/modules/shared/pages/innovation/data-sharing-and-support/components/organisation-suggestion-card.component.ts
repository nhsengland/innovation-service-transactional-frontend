import { Component, Input, OnChanges } from '@angular/core';

import { AccessorSuggestionModel, AssessmentSuggestionModel, OrganisationSuggestionModel } from '@modules/stores/innovation/innovation.models';
import { timingSafeEqual } from 'crypto';
import { filter } from 'lodash';
import { elementAt } from 'rxjs';

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

  accessors: AccessorSuggestionModel[] | undefined;

  showAssessments: boolean;
  showAccessors: boolean;

  // hasNewSuggestions = false;

  constructor(
    // private notificationsService: NotificationsService,
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
      this.assessments = this.parseAssessments(this.suggestions.assessment);
      if (this.assessments && this.assessments.organisations.length > 0) {
        this.showAssessments = true;
      }

      this.accessors = this.parseAccessors2(this.suggestions.accessors);
      if(this.accessors && this.accessors.length > 0){
        this.showAccessors = true
      }
    }

    // this.hasNewSuggestions = this.notificationsService.notifications[NotificationContextTypeEnum.DATA_SHARING] ? true : false;
  }

  private parseAccessors2(accessorsSuggestions: AccessorSuggestionModel[]): AccessorSuggestionModel[] {
    const shares = new Set(this.shares?.map(s => s.organisationId) || []);
    
    let filteredSuggestions: AccessorSuggestionModel[] = accessorsSuggestions.map((element) => {
      return {
      ...element, suggestedOrganisationUnits: element.suggestedOrganisationUnits.filter(org => !shares.has(org.organisation.id))
      }
    })

    return filteredSuggestions;
  }


  private parseAssessments(assessmentsSuggestions: AssessmentSuggestionModel): { organisations: string[] } {

    const shares = new Set(this.shares?.map(s => s.organisationId) || []);
    const suggestedOrganisations = (assessmentsSuggestions.suggestedOrganisationUnits ?? [])
      .map(ou => ou.organisation)
      .filter(so => !shares.has(so.id))
      .map(so => `${so.name} (${so.acronym})`);

    // removes duplicate entries
    const organisations = [...new Set(suggestedOrganisations)];

    organisations.sort((a,b)=>a.localeCompare(b));
    
    return {
      organisations,
    };
  }



}
