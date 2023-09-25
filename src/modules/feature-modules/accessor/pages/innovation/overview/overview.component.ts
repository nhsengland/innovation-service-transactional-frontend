import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { ContextInnovationType, StatisticsCardType } from '@app/base/types';

import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { irVersionsMainCategoryItems } from '@modules/stores/innovation/innovation-record/ir-versions.config';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation/innovation.enums';

import { InnovationCollaboratorsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';


@Component({
  selector: 'app-accessor-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: ContextInnovationType;
  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  isQualifyingAccessorRole = false;

  innovationSummary: { label: string; value: null | string; }[] = [];
  innovatorSummary: { label: string; value: string; }[] = [];
  cardsList: StatisticsCardType[] = [];
  innovationSupport: {
    organisationUnit: string,
    status: InnovationSupportStatusEnum,
  } = { organisationUnit: '', status: InnovationSupportStatusEnum.UNASSIGNED };

  showCards: boolean = false;

  innovationCollaborators: InnovationCollaboratorsListDTO['data'] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private statisticsService: StatisticsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.context.getInnovation();
    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

    this.setPageTitle('Overview', { hint: `Innovation ${this.innovation.name}` });

  }

  ngOnInit(): void {

    const qp: { statistics: InnovationStatisticsEnum[] } = { statistics: [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER, InnovationStatisticsEnum.TASKS_OPEN_COUNTER] };

    this.innovationsService.getInnovationCollaboratorsList(this.innovationId, ['active']).subscribe(innovationCollaborators => {
      this.innovationCollaborators = innovationCollaborators.data
    });

    forkJoin([
      this.innovationsService.getInnovationInfo(this.innovationId),
      this.statisticsService.getInnovationStatisticsInfo(this.innovationId, qp),
    ]).subscribe(([innovationInfo, statistics]) => {

      this.innovationSupport = {
        organisationUnit: this.stores.authentication.getAccessorOrganisationUnitName(),
        status: this.innovation.support?.status ?? InnovationSupportStatusEnum.UNASSIGNED
      };

      this.innovationSummary = [
        { label: 'Company', value: innovationInfo.owner?.organisations ? innovationInfo.owner.organisations[0].name : '' },
        { label: 'Location', value: `${innovationInfo.countryName}${innovationInfo.postCode ? ', ' + innovationInfo.postCode : ''}` },
        { label: 'Description', value: innovationInfo.description },
        { label: 'Categories', value: innovationInfo.categories.map(v => v === 'OTHER' ? innovationInfo.otherCategoryDescription : irVersionsMainCategoryItems.find(item => item.value === v)?.label).join('\n') }
      ];

      this.innovatorSummary = [
        { label: 'Owner', value: this.innovation.owner?.name ?? '[deleted account]' },
      ];

      this.showCards = [InnovationSupportStatusEnum.ENGAGING, InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED].includes(this.innovationSupport.status);

      this.stores.context.dismissNotification(this.innovationId, { contextTypes: [NotificationContextTypeEnum.INNOVATION] });

      if (this.innovation.support?.id) {
        this.stores.context.dismissNotification(this.innovationId, { contextTypes: [NotificationContextTypeEnum.SUPPORT], contextIds: [this.innovation.support.id] });
      }

      this.cardsList = [
        {
          title: 'Innovation record',
          label: `sections submitted since your organisation unit started support`,
          link: `/accessor/innovations/${this.innovationId}/record`,
          count: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER].count,
          total: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER].total,
          lastMessage: `Last submitted section: "${this.translate('shared.catalog.innovation.innovation_sections.' + statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER].lastSubmittedSection)}"`,
          date: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER].lastSubmittedAt,
          emptyMessage: `No sections have been submitted since support started.`
        },
        {
          title: 'Tasks',
          label: `tasks assigned by your organisation have been done or declined by the innovator`,
          link: `/accessor/innovations/${this.innovationId}/tasks`,
          count: statistics[InnovationStatisticsEnum.TASKS_OPEN_COUNTER].count,
          lastMessage: `Last updated task: "${this.translate('shared.catalog.innovation.innovation_sections.' + statistics[InnovationStatisticsEnum.TASKS_OPEN_COUNTER].lastSubmittedSection)}"`,
          date: statistics[InnovationStatisticsEnum.TASKS_OPEN_COUNTER]?.lastSubmittedAt,
          emptyMessage: 'No tasks to review'
        }
      ];

      this.setPageStatus('READY');

    });

  }

}
