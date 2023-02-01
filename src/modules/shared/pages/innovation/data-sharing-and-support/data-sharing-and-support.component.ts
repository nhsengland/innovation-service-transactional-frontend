import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, ObservableInput } from 'rxjs';

import { CoreComponent } from '@app/base';

import { InnovationService } from '@modules/stores/innovation/innovation.service';
import { OrganisationSuggestionModel } from '@modules/stores/innovation/innovation.models';

import { InnovationSharesListDTO, InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsListDTO, OrganisationsService } from '@modules/shared/services/organisations.service';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { UserRoleEnum } from '@app/base/enums';
import { InnovationSupportsListDTO } from '@modules/shared/services/innovations.dtos';
import { ContextInnovationType } from '@modules/stores/context/context.types';


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
      id: string,
      name: string,
      acronym: string,
      status?: InnovationSupportStatusEnum,
      organisationUnits: {
        id: string,
        name: string,
        acronym: string,
        status: InnovationSupportStatusEnum
      }[]
    };
    shared?: boolean;
    showHideStatus: 'hidden' | 'opened' | 'closed';
    showHideText: null | string;
    showHideDescription: null | string;
  }[] = [];

  organisationSuggestions: OrganisationSuggestionModel | undefined;
  shares: { organisationId: string }[] = [];

  isQualifyingAccessorRole = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService,
    private innovationService: InnovationService
  ) {

    super();

    this.userType = this.stores.authentication.getUserType();
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.context.getInnovation();

    this.isQualifyingAccessorRole = this.userType === UserRoleEnum.ACCESSOR && this.stores.authentication.isQualifyingAccessorRole();

    switch (this.userType) {
      case UserRoleEnum.ASSESSMENT:
        this.setPageTitle('Support status', { hint: 'All organisations' });
        break;

      case UserRoleEnum.ADMIN:
        this.setPageTitle('Data sharing and support', { hint: `Innovation ${this.innovation.name}` });
        break;

      case UserRoleEnum.ACCESSOR:
        this.setPageTitle('Support status', { hint: 'All organisations' });
        break;

      default:
        this.setPageTitle('Data sharing and support');
    }

  }

  ngOnInit(): void {

    // this.notificationsService.dismissNotification(NotificationContextTypeEnum.DATA_SHARING, this.innovationId).subscribe();

    const subscriptions: {
      organisationsList: ObservableInput<OrganisationsListDTO[]>,
      innovationSupports: ObservableInput<InnovationSupportsListDTO>,
      innovationShares?: ObservableInput<InnovationSharesListDTO>,
      organisationSuggestions?: ObservableInput<OrganisationSuggestionModel>,

    } = {
      organisationsList: this.organisationsService.getOrganisationsList({ unitsInformation: true }),
      innovationSupports: this.innovationsService.getInnovationSupportsList(this.innovationId, false)
    };

    if (this.userType === UserRoleEnum.INNOVATOR) {
      subscriptions.innovationShares = this.innovationsService.getInnovationSharesList(this.innovationId);
      subscriptions.organisationSuggestions = this.innovationService.getInnovationOrganisationSuggestions(this.innovationId);
    }
    
    if(this.userType === UserRoleEnum.ADMIN || this.userType === UserRoleEnum.ASSESSMENT) {
      subscriptions.innovationShares = this.innovationsService.getInnovationSharesList(this.innovationId);
    }

    forkJoin(subscriptions).subscribe((results) => {

      if (this.userType === UserRoleEnum.INNOVATOR) {
        this.organisationSuggestions = results.organisationSuggestions;
        this.shares = (results.innovationShares ?? []).map(item => ({ organisationId: item.organisation.id }));
      }

      if (this.userType === UserRoleEnum.ADMIN || this.userType === UserRoleEnum.ASSESSMENT) {
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
              status: results.innovationSupports.find(item => item.organisation.id === organisation.id)?.status || InnovationSupportStatusEnum.UNASSIGNED,
            },
            ...([UserRoleEnum.ADMIN, UserRoleEnum.INNOVATOR, UserRoleEnum.ASSESSMENT].includes(this.userType as UserRoleEnum) ? { shared: ((results.innovationShares ?? []).findIndex(item => item.organisation.id === organisation.id) > -1) } : {}),
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
                status: results.innovationSupports.find(item => item.organisation.unit.id === organisationUnit.id)?.status || InnovationSupportStatusEnum.UNASSIGNED
              }))
            },
            ...([UserRoleEnum.ADMIN, UserRoleEnum.INNOVATOR, UserRoleEnum.ASSESSMENT].includes(this.userType as UserRoleEnum) ? { shared: ((results.innovationShares ?? []).findIndex(item => item.organisation.id === organisation.id) > -1) } : {}),
            showHideStatus: 'closed',
            showHideText: organisation.organisationUnits.length === 0 ? null : `Show ${organisation.organisationUnits.length} units`,
            showHideDescription: `that belong to the ${organisation.name}`
          };
        }

      });

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
