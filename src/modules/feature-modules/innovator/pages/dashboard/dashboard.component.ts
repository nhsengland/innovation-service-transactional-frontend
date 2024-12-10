import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { InnovationListFullDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationGroupedStatusEnum, InnovationTransferStatusEnum } from '@modules/stores';

import { DatesHelper } from '@app/base/helpers';
import { AnnouncementTypeEnum } from '@modules/feature-modules/admin/services/announcements.service';
import {
  AnnouncementType,
  AnnouncementsService
} from '@modules/feature-modules/announcements/services/announcements.service';
import {
  GetInnovationCollaboratorInvitesDTO,
  GetInnovationTransfersDTO,
  InnovatorService
} from '../../services/innovator.service';

@Component({
  selector: 'app-innovator-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class PageDashboardComponent extends CoreComponent implements OnInit {
  user: {
    displayName: string;
    innovationsOwner: {
      id: string;
      name: string;
      description: null | string;
      groupedStatus: keyof typeof InnovationGroupedStatusEnum;
    }[];
    innovationsCollaborator: {
      id: string;
      name: string;
      description: null | string;
      groupedStatus: keyof typeof InnovationGroupedStatusEnum;
    }[];
    innovationsArchived: {
      id: string;
      name: string;
      description: null | string;
      groupedStatus: keyof typeof InnovationGroupedStatusEnum;
    }[];
    passwordResetAt: string;
    firstTimeSignInAt: string | null;
  };

  innovationTransfers: GetInnovationTransfersDTO = [];
  inviteCollaborations: GetInnovationCollaboratorInvitesDTO[] = [];

  announcements: AnnouncementType[] = [];

  constructor(
    private innovationsService: InnovationsService,
    private innovatorService: InnovatorService,
    private announcementsService: AnnouncementsService
  ) {
    super();

    const user = this.ctx.user.getUserInfo();
    this.user = {
      displayName: user.displayName,
      innovationsOwner: [],
      innovationsCollaborator: [],
      innovationsArchived: [],
      passwordResetAt: user.passwordResetAt || '',
      firstTimeSignInAt: user.firstTimeSignInAt
    };

    this.setPageTitle('Home', { hint: `Hello${user.displayName ? ' ' + user.displayName : ''}` });
  }

  ngOnInit(): void {
    if (history.state?.alert === 'CHANGE_PASSWORD') {
      this.setAlertSuccess('You have successfully changed your password');
      const newState = history.state;
      delete newState.alert;
      history.replaceState(newState, '');
      this.ctx.user.updateInfo({ passwordChangeSinceLastSignIn: true });
    }

    forkJoin([
      this.innovationsService.getInnovationsList(
        ['id', 'name', 'groupedStatus', 'statistics.tasks', 'statistics.messages'],
        { hasAccessThrough: ['owner'] },
        { take: 100, skip: 0, order: { name: 'ASC' } }
      ),
      this.innovationsService.getInnovationsList(
        ['id', 'name', 'groupedStatus', 'statistics.tasks', 'statistics.messages'],
        { hasAccessThrough: ['collaborator'] },
        { take: 100, skip: 0, order: { name: 'ASC' } }
      ),
      this.innovatorService.getInnovationTransfers(true).pipe(
        map(response => response),
        catchError(() => of(null))
      ),
      this.innovatorService.getInnovationInviteCollaborations().pipe(
        map(response => response),
        catchError(() => of(null))
      ),
      this.announcementsService.getAnnouncements({ type: [AnnouncementTypeEnum.HOMEPAGE] })
    ]).subscribe(
      ([
        innovationsListOwner,
        innovationsListCollaborator,
        innovationsTransfers,
        inviteCollaborations,
        announcements
      ]) => {
        this.announcements = announcements;
        this.user.innovationsOwner = this.getInnovationsListInformation(innovationsListOwner.data).filter(
          item => item.groupedStatus !== 'ARCHIVED'
        );
        this.user.innovationsCollaborator = this.getInnovationsListInformation(innovationsListCollaborator.data).filter(
          item => item.groupedStatus !== 'ARCHIVED'
        );
        this.user.innovationsArchived = this.user.innovationsArchived = [
          ...this.getInnovationsListInformation(innovationsListOwner.data),
          ...this.getInnovationsListInformation(innovationsListCollaborator.data)
        ]
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(item => item.groupedStatus === 'ARCHIVED');

        if (innovationsTransfers) {
          this.innovationTransfers = innovationsTransfers;
        } else {
          this.setAlertUnknownError();
        }

        if (inviteCollaborations) {
          this.inviteCollaborations = inviteCollaborations.map(i => {
            return {
              ...i,
              invitedAt: DatesHelper.addDaysToDate(i.invitedAt ?? '', 30).toString()
            };
          });
        } else {
          this.setAlertUnknownError();
        }

        this.setPageStatus('READY');
      }
    );
  }

  onSubmitTransferResponse(transferId: string, innovationId: string, accept: boolean): void {
    this.innovatorService
      .updateTransferInnovation(
        transferId,
        accept ? InnovationTransferStatusEnum.COMPLETED : InnovationTransferStatusEnum.DECLINED
      )
      .pipe(
        tap(() => {
          if (this.ctx.innovation.info().id === innovationId) {
            this.ctx.innovation.clear();
          }
        }),
        concatMap(() =>
          forkJoin([
            this.innovationsService.getInnovationsList(
              ['id', 'name', 'groupedStatus', 'statistics.tasks', 'statistics.messages'],
              { hasAccessThrough: ['owner'] },
              { take: 100, skip: 0, order: { name: 'ASC' } }
            ),
            this.innovationsService.getInnovationsList(
              ['id', 'name', 'groupedStatus', 'statistics.tasks', 'statistics.messages'],
              { hasAccessThrough: ['collaborator'] },
              { take: 100, skip: 0, order: { name: 'ASC' } }
            )
          ])
        )
      )
      .subscribe(([innovationsListOwner, innovationsListCollaborator]) => {
        this.innovationTransfers = this.innovationTransfers.filter(t => t.id !== transferId);
        if (this.innovationTransfers.length === 0) {
          this.ctx.user.updateInfo({ hasInnovationTransfers: false });
        }
        this.user.innovationsOwner = this.getInnovationsListInformation(innovationsListOwner.data).filter(
          item => item.groupedStatus !== 'ARCHIVED'
        );
        this.user.innovationsCollaborator = this.getInnovationsListInformation(innovationsListCollaborator.data).filter(
          item => item.groupedStatus !== 'ARCHIVED'
        );
        this.user.innovationsArchived = [
          ...this.getInnovationsListInformation(innovationsListOwner.data),
          ...this.getInnovationsListInformation(innovationsListCollaborator.data)
        ]
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(item => item.groupedStatus === 'ARCHIVED');

        this.setAlertSuccess(
          accept ? `You have successfully accepted ownership` : `You have successfully rejected ownership`
        );
      });
  }

  onClearAnnouncement(announcementId: string) {
    this.announcements = this.announcements.filter(a => a.id !== announcementId);
  }

  private buildDescriptionString(
    statistics: Pick<InnovationListFullDTO['statistics'], 'messages' | 'tasks'>
  ): string | null {
    const { tasks, messages } = statistics;

    const tasksStr = `${tasks} ${tasks > 1 ? 'updates' : 'update'} on tasks`;
    const messagesStr = `${messages} new ${messages > 1 ? 'messages' : 'message'}`;

    const description = [];

    if (tasks !== 0) {
      description.push(tasksStr);
    }

    if (messages !== 0) {
      description.push(messagesStr);
    }

    return description.length !== 0 ? `${description.join(', ')}.` : null;
  }

  private getInnovationsListInformation(
    innovationList: {
      id: string;
      name: string;
      statistics: Pick<InnovationListFullDTO['statistics'], 'messages' | 'tasks'>;
      groupedStatus: keyof typeof InnovationGroupedStatusEnum;
    }[]
  ) {
    return innovationList.map(innovation => ({
      id: innovation.id,
      name: innovation.name,
      description: this.buildDescriptionString(innovation.statistics),
      groupedStatus: innovation.groupedStatus
    }));
  }
}
