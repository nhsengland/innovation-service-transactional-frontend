import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObservableInput, forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';

import {
  ContextInnovationType,
  InnovationContextService,
  InnovationStatusEnum,
  InnovationSupportStatusEnum
} from '@modules/stores';
import { OrganisationSuggestionModel } from '@modules/stores/ctx/innovation/innovation.models';

import { UtilsHelper } from '@app/base/helpers';
import { InnovationSharesListDTO, InnovationSupportsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsListDTO, OrganisationsService } from '@modules/shared/services/organisations.service';

@Component({
  selector: 'shared-pages-innovation-data-sharing-and-support',
  templateUrl: './data-sharing-and-support.component.html'
})
export class PageInnovationDataSharingAndSupportComponent extends CoreComponent implements OnInit {
  innovationId: string;

  innovation: ContextInnovationType;

  NHSE_ORG_ACRONYM = 'NHSE';

  organisations: {
    info: {
      id: string;
      name: string;
      acronym: string;
      status?: InnovationSupportStatusEnum;
      suggestedByPhrase: string | null;
      organisationUnits: {
        id: string;
        name: string;
        acronym: string;
        status: InnovationSupportStatusEnum;
        suggestedByPhrase: string | null;
      }[];
    };
    shared?: boolean;
    showHideStatus: 'hidden' | 'opened' | 'closed';
    showHideText: null | string;
    showHideDescription: null | string;
  }[] = [];

  organisationSuggestions: OrganisationSuggestionModel | undefined;
  shares: { organisationId: string }[] = [];

  showSuggestOrganisationsToSupportLink = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService,
    private innovationService: InnovationContextService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.ctx.innovation.info();

    // Flags

    if (this.ctx.user.isQualifyingAccessor()) {
      this.setPageTitle('Suggest organisations to support');
    } else {
      this.setPageTitle('Data sharing preferences', { hint: 'All organisations' });
    }
  }

  ngOnInit(): void {
    const subscriptions: {
      organisationsList: ObservableInput<OrganisationsListDTO[]>;
      innovationSupports: ObservableInput<InnovationSupportsListDTO>;
      innovationShares?: ObservableInput<InnovationSharesListDTO>;
      organisationSuggestions?: ObservableInput<OrganisationSuggestionModel>;
    } = {
      organisationsList: this.organisationsService.getOrganisationsList({ unitsInformation: true }),
      innovationSupports: this.innovationsService.getInnovationSupportsList(this.innovationId, false)
    };

    if (this.ctx.user.isInnovator()) {
      subscriptions.innovationShares = this.innovationsService.getInnovationSharesList(this.innovationId);
      subscriptions.organisationSuggestions = this.innovationService.getInnovationOrganisationSuggestions(
        this.innovationId,
        {
          ...(this.innovation.assessment?.currentMajorAssessmentId && {
            majorAssessmentId: this.innovation.assessment?.currentMajorAssessmentId
          })
        }
      );
    }

    if (this.ctx.user.isAccessorType()) {
      // TODO: Make sure we want this here
      subscriptions.organisationSuggestions = this.innovationService.getInnovationOrganisationSuggestions(
        this.innovationId,
        {
          ...(this.innovation.assessment?.currentMajorAssessmentId && {
            majorAssessmentId: this.innovation.assessment?.currentMajorAssessmentId
          })
        }
      );
    }

    if (!this.ctx.user.isInnovator()) {
      subscriptions.innovationShares = this.innovationsService.getInnovationSharesList(this.innovationId);
    }

    forkJoin(subscriptions).subscribe(results => {
      if (this.ctx.user.isInnovator()) {
        this.organisationSuggestions = results.organisationSuggestions;
        this.shares = (results.innovationShares ?? []).map(item => ({ organisationId: item.organisation.id }));
      }

      if (!this.ctx.user.isInnovator()) {
        this.shares = (results.innovationShares ?? []).map(item => ({ organisationId: item.organisation.id }));
      }

      this.organisations = results.organisationsList.map(organisation => {
        if (organisation.organisationUnits.length === 1) {
          // filter accessors who suggested the current organisation
          const accessorsWhoSuggestedOrg = results.organisationSuggestions?.accessors.filter(
            accessor => !!accessor.suggestedOrganisations.find(so => so.id === organisation.id)
          );

          // check if current organisation was suggested by needs assessment team
          const isOrgSuggestedByAssessmentTeam =
            !!results.organisationSuggestions?.assessment.suggestedOrganisations.find(so => so.id === organisation.id);

          const suggestedBy = [
            ...(isOrgSuggestedByAssessmentTeam ? ['the needs assessment team'] : []),
            ...(accessorsWhoSuggestedOrg?.map(ac => ac.organisation.acronym) || [])
          ];

          return {
            info: {
              id: organisation.id,
              name: this.formatOrganizationLabel(organisation.name, organisation.acronym),
              acronym: organisation.acronym,
              organisationUnits: [],
              status:
                results.innovationSupports.find(item => item.organisation.id === organisation.id)?.status ||
                InnovationSupportStatusEnum.UNASSIGNED,
              suggestedByPhrase: this.createSubmittedByPhrase(suggestedBy)
            },
            shared: (results.innovationShares ?? []).findIndex(item => item.organisation.id === organisation.id) > -1,
            showHideStatus: 'hidden',
            showHideText: null,
            showHideDescription: null
          };
        } else {
          const organisationUnits = organisation.organisationUnits.map(organisationUnit => {
            // filter accessors who suggested the current unit
            const accessorsWhoSuggestedUnit = results.organisationSuggestions?.accessors.filter(
              accessor =>
                !!accessor.suggestedOrganisations
                  .find(so => so.id === organisation.id)
                  ?.organisationUnits?.find(ou => ou.id === organisationUnit.id)
            );

            // check if current unit was suggested by needs assessment team
            const isUnitSuggestedByAssessmentTeam = !!results.organisationSuggestions?.assessment.suggestedOrganisations
              .find(so => so.id === organisation.id)
              ?.organisationUnits?.find(ou => ou.id === organisationUnit.id);

            const suggestedBy = [
              ...(isUnitSuggestedByAssessmentTeam ? ['the needs assessment team'] : []),
              ...(accessorsWhoSuggestedUnit?.map(ac => ac.organisation.acronym) || [])
            ];

            return {
              ...organisationUnit,
              status:
                results.innovationSupports.find(item => item.organisation.unit.id === organisationUnit.id)?.status ||
                InnovationSupportStatusEnum.UNASSIGNED,
              suggestedByPhrase: this.createSubmittedByPhrase(suggestedBy)
            };
          });

          return {
            info: {
              id: organisation.id,
              name: this.formatOrganizationLabel(organisation.name, organisation.acronym),
              acronym: organisation.acronym,
              suggestedByPhrase: null,
              organisationUnits
            },
            shared: (results.innovationShares ?? []).findIndex(item => item.organisation.id === organisation.id) > -1,
            showHideStatus: 'closed',
            showHideText:
              organisation.organisationUnits.length === 0
                ? null
                : `Show ${organisation.organisationUnits.length} units`,
            showHideDescription: `that belong to the ${organisation.name}`
          };
        }
      });

      // Check if there are organisations to be suggested by the qualifying accessor
      if (this.ctx.user.isQualifyingAccessor()) {
        const userUnitId = this.ctx.user.getUserContext()?.organisationUnit?.id ?? '';

        const engagingUnitsIds = results.innovationSupports
          .filter(support => support.status === InnovationSupportStatusEnum.ENGAGING)
          .map(support => support.organisation.unit.id);

        this.showSuggestOrganisationsToSupportLink =
          this.innovation.status === InnovationStatusEnum.IN_PROGRESS &&
          !!UtilsHelper.getAvailableOrganisationsToSuggest(
            this.innovation.id,
            userUnitId,
            results.organisationsList,
            engagingUnitsIds
          ).length;
      }

      this.setPageStatus('READY');
    });
  }

  private formatOrganizationLabel(name: string, acronym: string): string {
    if (acronym === this.NHSE_ORG_ACRONYM && !name.includes('(necessary)')) {
      return `${name} (necessary)`;
    }
    return name;
  }

  onShowHideClicked(organisationId: string): void {
    const organisation = this.organisations.find(i => i.info.id === organisationId);

    switch (organisation?.showHideStatus) {
      case 'opened':
        organisation.showHideStatus = 'closed';
        organisation.showHideText = `Show ${organisation.info.organisationUnits.length} units`;
        organisation.showHideDescription = `that belong to the ${organisation.info.name}`;
        break;
      case 'closed':
        organisation.showHideStatus = 'opened';
        organisation.showHideText = `Hide ${organisation.info.organisationUnits.length} units`;
        organisation.showHideDescription = `that belong to the ${organisation.info.name}`;
        break;
      default:
        break;
    }
  }

  createSubmittedByPhrase(submittedBy: string[]): string | null {
    if (submittedBy.length === 0) {
      return null;
    }

    if (submittedBy.length === 1) {
      return `Suggested by ${submittedBy[0]}.`;
    }

    return `Suggested by ${submittedBy.slice(0, -1).join(', ')} and ${submittedBy.pop()}.`;
  }
}
