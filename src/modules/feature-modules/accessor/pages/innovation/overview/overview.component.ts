import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import { categoriesItems } from '@modules/stores/innovation/sections/catalogs.config';

import { StatisticsCard } from '@modules/shared/services/innovations.dtos';
import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { forkJoin } from 'rxjs';
import { InnovationCollaboratorStatusEnum } from '@modules/stores/innovation/innovation.enums';


@Component({
  selector: 'app-accessor-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: ContextInnovationType;

  isQualifyingAccessorRole = false;

  innovationSupport: {
    organisationUnit: string,
    status: InnovationSupportStatusEnum,
  } = { organisationUnit: '', status: InnovationSupportStatusEnum.UNASSIGNED };

  innovationSummary: { label: string; value: null | string; }[] = [];
  innovatorSummary: { label: string; value: string; }[] = [];

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  cardsList: StatisticsCard[] = [];
  showCards: boolean = false;

  innovationCollaborators: {
    id: string;
    status: InnovationCollaboratorStatusEnum;
    name?: string;
    role?: string;
  }[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.context.getInnovation();
    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

    this.setPageTitle('Overview', { hint: `Innovation ${this.innovation.name}` });

  }

  ngOnInit(): void {

    const qp: { statistics: InnovationStatisticsEnum[] } = { statistics: [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER, InnovationStatisticsEnum.ACTIONS_TO_REVIEW_COUNTER] };
    
    forkJoin([
      this.innovationsService.getInnovationInfo(this.innovationId),
      this.innovationsService.getInnovationStatisticsInfo(this.innovationId, qp),
    ]).subscribe(([innovationInfo, statistics]) => {
      this.innovationSupport = {
        organisationUnit: this.stores.authentication.getAccessorOrganisationUnitName(),
        status: this.innovation.support?.status || InnovationSupportStatusEnum.UNASSIGNED
      };
      this.innovationSummary = [
        { label: 'Company', value: innovationInfo.owner && innovationInfo.owner.organisations ? innovationInfo.owner.organisations[0].name : '' },
        { label: 'Location', value: `${innovationInfo.countryName}${innovationInfo.postCode ? ', ' + innovationInfo.postCode : ''}` },
        { label: 'Description', value: innovationInfo.description },
        { label: 'Categories', value: innovationInfo.categories.map(v => v === 'OTHER' ? innovationInfo.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label).join('\n') }
      ];

      this.innovatorSummary = [
        { label: 'Owner', value: this.innovation.owner.name },
      ];

      this.showCards = [InnovationSupportStatusEnum.ENGAGING, InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED].includes(this.innovationSupport.status);

      this.stores.context.dismissNotification(this.innovationId, {contextTypes: [NotificationContextTypeEnum.INNOVATION]});

      if (this.innovation.support?.id) {
        this.stores.context.dismissNotification(this.innovationId, {contextTypes: [NotificationContextTypeEnum.SUPPORT], contextIds: [this.innovation.support.id]});
      }

      this.cardsList = [{
        title: 'Innovation record',
        label: `sections submitted since your organisation unit started support`,
        link: `/accessor/innovations/${this.innovationId}/record`,
        count: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER].count,
        total: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER].total,
        lastMessage: `Last submitted section: "${this.translate('shared.catalog.innovation.innovation_sections.' + statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER].lastSubmittedSection)}"`,
        date: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER].lastSubmittedAt,
        emptyMessage: `No sections have been submitted since support started.`
      }, {
        title: 'Actions to review',
        label: `actions responded to by the innovator awaiting your review`,
        link: `/accessor/innovations/${this.innovationId}/action-tracker`,
        count: statistics[InnovationStatisticsEnum.ACTIONS_TO_REVIEW_COUNTER].count,
        lastMessage: `Last submitted section: "${this.translate('shared.catalog.innovation.innovation_sections.' + statistics[InnovationStatisticsEnum.ACTIONS_TO_REVIEW_COUNTER].lastSubmittedSection)}"`,
        date: statistics[InnovationStatisticsEnum.ACTIONS_TO_REVIEW_COUNTER]?.lastSubmittedAt,
        emptyMessage: 'No actions to review'
      }]

      this.setPageStatus('READY');

    });
    
    this.innovationsService.getInnovationCollaboratorsList(this.innovationId, ["active"])
      .subscribe((innovationCollaborators) => {
      this.innovationCollaborators = innovationCollaborators.data
    });

  }
}
