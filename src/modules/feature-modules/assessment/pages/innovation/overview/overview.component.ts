import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UtilsHelper } from '@app/base/helpers';

import { InnovationInfoDTO, StatisticsCard } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { InnovationStatusEnum } from '@modules/stores/innovation';
import { InnovationCollaboratorStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { categoriesItems } from '@modules/stores/innovation/sections/catalogs.config';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-assessment-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: null | InnovationInfoDTO = null;

  innovationSummary: { label: string; value: null | string; }[] = [];
  innovatorSummary: { label: string; value: string; }[] = [];
  cardsList: StatisticsCard[] = [];
  showChangeNeedsAssessor: boolean = false;

  innovationCollaborators: {
    id: string;
    status: InnovationCollaboratorStatusEnum;
    name: string;
    email: string;
    collaboratorRole?: string;
  }[] | null =  null;

  showCollaboratorsHideStatus: 'opened' | 'closed' = 'closed';
  isCollaboratorsLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

  }


  ngOnInit(): void {

    const qp: { statistics: InnovationStatisticsEnum[] } = { statistics: [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER, InnovationStatisticsEnum.UNREAD_MESSAGES_THREADS_INITIATED_BY_COUNTER] };

    forkJoin([
      this.innovationsService.getInnovationInfo(this.innovationId),
      this.innovationsService.getInnovationStatisticsInfo(this.innovationId, qp),
    ]).subscribe(([innovationInfo, statistics]) => {
      this.innovation = innovationInfo;
      this.setPageTitle('Overview', { hint: `Innovation ${this.innovation.name}` });
      this.showChangeNeedsAssessor = this.innovation.status === InnovationStatusEnum.NEEDS_ASSESSMENT;

      this.innovationSummary = [
        { label: 'Company', value: this.innovation.owner.organisations ? this.innovation.owner.organisations[0].name : '' },
        { label: 'Company size', value: this.innovation.owner.organisations ? this.innovation.owner.organisations[0].size : '' },
        { label: 'Location', value: `${this.innovation.countryName}${this.innovation.postCode ? ', ' + this.innovation.postCode : ''}` },
        { label: 'Description', value: this.innovation.description },
        { label: 'Categories', value: this.innovation.categories.map(v => v === 'OTHER' ? this.innovation?.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label).join('\n') }
      ];

      this.innovatorSummary = [
        { label: 'Name', value: this.innovation.owner.name },
        { label: 'Contact preference', value: UtilsHelper.getContactPreferenceValue(this.innovation.owner.contactByEmail, this.innovation.owner.contactByPhone, this.innovation.owner.contactByPhoneTimeframe) || '' },
        { label: 'Contact details', value: this.innovation.owner.contactDetails || '' },
        { label: 'Email address', value: this.innovation.owner.email || '' },
        { label: 'Phone number', value: this.innovation.owner.mobilePhone || '' }
      ];

      this.cardsList = [{
        title: 'Innovation record',
        label: `sections submitted since assessment was started`,
        link: `/assessment/innovations/${this.innovationId}/record`,
        count: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER].count,
        total: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER].total,
        lastMessage: `Last submitted section: "${this.translate('shared.catalog.innovation.innovation_sections.' + statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER].lastSubmittedSection)}"`,
        date: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER].lastSubmittedAt,
        emptyMessage: `No sections have been submitted since the assessment started`
      }, {
        title: 'Messages',
        label: `unread replies to conversations you have started`,
        link: `/assessment/innovations/${this.innovationId}/threads`,
        count: statistics[InnovationStatisticsEnum.UNREAD_MESSAGES_THREADS_INITIATED_BY_COUNTER].count,
        lastMessage: `Last received message`,
        date: statistics[InnovationStatisticsEnum.UNREAD_MESSAGES_THREADS_INITIATED_BY_COUNTER]?.lastSubmittedAt,
        emptyMessage: 'No replies to read'
      }]



      this.stores.context.dismissNotification(this.innovationId, {contextTypes: [NotificationContextTypeEnum.INNOVATION, NotificationContextTypeEnum.SUPPORT]});

      this.setPageStatus('READY');

    });

  }
  
  onShowCollaboratorsClick() {
    if (this.showCollaboratorsHideStatus === 'opened') {
      this.showCollaboratorsHideStatus = 'closed';
    } else {
      this.showCollaboratorsHideStatus = 'opened';
      if (!this.innovationCollaborators) {
        this.getInnovationCollaborators();
      }
    }
  }

  getInnovationCollaborators(): void {

    this.isCollaboratorsLoading = true
    const qp: { status: InnovationCollaboratorStatusEnum[] } = { status: [InnovationCollaboratorStatusEnum.ACTIVE] };
    
    this.innovationsService.getInnovationCollaborators(this.innovationId, qp)
      .subscribe((innovationCollaborators) => {
      this.innovationCollaborators = innovationCollaborators.data.map(collaborator => ({ email: collaborator.email || '', ...collaborator}))
      this.isCollaboratorsLoading = false;
    })

  }

}
