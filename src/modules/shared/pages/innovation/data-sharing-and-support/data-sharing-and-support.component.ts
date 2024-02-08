import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObservableInput, forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { NotificationContextDetailEnum, UserRoleEnum } from '@app/base/enums';

import { InnovationService, InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { OrganisationSuggestionModel } from '@modules/stores/innovation/innovation.models';
import { ContextInnovationType } from '@modules/stores/context/context.types';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationSharesListDTO, InnovationSupportsListDTO } from '@modules/shared/services/innovations.dtos';
import { OrganisationsListDTO, OrganisationsService } from '@modules/shared/services/organisations.service';

@Component({
  selector: 'shared-pages-innovation-data-sharing-and-support',
  templateUrl: './data-sharing-and-support.component.html'
})
export class PageInnovationDataSharingAndSupportComponent extends CoreComponent implements OnInit {
  innovationId: string;

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  innovation: ContextInnovationType;

  userType: '' | UserRoleEnum;

  organisations: {
    info: {
      id: string;
      name: string;
      acronym: string;
      status?: InnovationSupportStatusEnum;
      organisationUnits: {
        id: string;
        name: string;
        acronym: string;
        status: InnovationSupportStatusEnum;
      }[];
    };
    shared?: boolean;
    showHideStatus: 'hidden' | 'opened' | 'closed';
    showHideText: null | string;
    showHideDescription: null | string;
  }[] = [];

  organisationSuggestions: OrganisationSuggestionModel | undefined;
  shares: { organisationId: string }[] = [];

  // Flags
  isQualifyingAccessorRole: boolean;
  isInnovatorType: boolean;
  isAssessmentType: boolean;
  isAccessorType: boolean;
  isArchived: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService,
    private innovationService: InnovationService
  ) {
    super();

    this.userType = this.stores.authentication.getUserType() ?? '';
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.context.getInnovation();

    // Flags
    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isArchived = this.innovation.status === InnovationStatusEnum.ARCHIVED;

    this.setPageTitle('Data sharing preferences', { hint: 'All organisations' });
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

    if (this.userType === UserRoleEnum.INNOVATOR) {
      subscriptions.innovationShares = this.innovationsService.getInnovationSharesList(this.innovationId);
      subscriptions.organisationSuggestions = this.innovationService.getInnovationOrganisationSuggestions(
        this.innovationId
      );
    }

    if (
      this.userType === UserRoleEnum.ADMIN ||
      this.userType === UserRoleEnum.ASSESSMENT ||
      this.userType === UserRoleEnum.ACCESSOR ||
      this.userType === UserRoleEnum.QUALIFYING_ACCESSOR
    ) {
      subscriptions.innovationShares = this.innovationsService.getInnovationSharesList(this.innovationId);
    }

    forkJoin(subscriptions).subscribe(results => {
      if (this.userType === UserRoleEnum.INNOVATOR) {
        this.organisationSuggestions = results.organisationSuggestions;
        this.shares = (results.innovationShares ?? []).map(item => ({ organisationId: item.organisation.id }));
      }

      if (
        this.userType === UserRoleEnum.ADMIN ||
        this.userType === UserRoleEnum.ASSESSMENT ||
        this.userType === UserRoleEnum.ACCESSOR ||
        this.userType === UserRoleEnum.QUALIFYING_ACCESSOR
      ) {
        this.shares = (results.innovationShares ?? []).map(item => ({ organisationId: item.organisation.id }));
      }

      this.organisations = results.organisationsList.map(organisation => {
        if (organisation.organisationUnits.length === 1) {
          return {
            info: {
              id: organisation.id,
              name: organisation.name,
              acronym: organisation.acronym,
              organisationUnits: [],
              status:
                results.innovationSupports.find(item => item.organisation.id === organisation.id)?.status ||
                InnovationSupportStatusEnum.UNASSIGNED
            },
            ...([
              UserRoleEnum.ADMIN,
              UserRoleEnum.INNOVATOR,
              UserRoleEnum.ASSESSMENT,
              UserRoleEnum.ACCESSOR,
              UserRoleEnum.QUALIFYING_ACCESSOR
            ].includes(this.userType as UserRoleEnum)
              ? {
                  shared:
                    (results.innovationShares ?? []).findIndex(item => item.organisation.id === organisation.id) > -1
                }
              : {}),
            showHideStatus: 'hidden',
            showHideText: null,
            showHideDescription: null
          };
        } else {
          return {
            info: {
              id: organisation.id,
              name: organisation.name,
              acronym: organisation.acronym,
              organisationUnits: organisation.organisationUnits.map(organisationUnit => ({
                ...organisationUnit,
                status:
                  results.innovationSupports.find(item => item.organisation.unit.id === organisationUnit.id)?.status ||
                  InnovationSupportStatusEnum.UNASSIGNED
              }))
            },
            ...([
              UserRoleEnum.ADMIN,
              UserRoleEnum.INNOVATOR,
              UserRoleEnum.ASSESSMENT,
              UserRoleEnum.ACCESSOR,
              UserRoleEnum.QUALIFYING_ACCESSOR
            ].includes(this.userType as UserRoleEnum)
              ? {
                  shared:
                    (results.innovationShares ?? []).findIndex(item => item.organisation.id === organisation.id) > -1
                }
              : {}),
            showHideStatus: 'closed',
            showHideText:
              organisation.organisationUnits.length === 0
                ? null
                : `Show ${organisation.organisationUnits.length} units`,
            showHideDescription: `that belong to the ${organisation.name}`
          };
        }
      });

      if (this.userType === UserRoleEnum.INNOVATOR) {
        this.stores.context.dismissNotification(this.innovationId, {
          contextDetails: [
            NotificationContextDetailEnum.OS02_UNITS_SUGGESTION_NOT_SHARED_TO_INNOVATOR,
            NotificationContextDetailEnum.NA04_NEEDS_ASSESSMENT_COMPLETE_TO_INNOVATOR
          ]
        });

        if (this.innovation.loggedUser.isOwner) {
          this.stores.context.dismissNotification(this.innovationId, {
            contextDetails: [NotificationContextDetailEnum.AP07_UNIT_INACTIVATED_TO_ENGAGING_INNOVATIONS]
          });
        }
      }

      this.setPageStatus('READY');
    });
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
}
