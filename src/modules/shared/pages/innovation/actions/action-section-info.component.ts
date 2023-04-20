import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { InnovationActionInfoDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { InnovationSectionEnum } from '@modules/stores/innovation';


@Component({
  selector: 'shared-pages-innovation-action-section-info',
  templateUrl: './action-section-info.component.html'
})
export class PageInnovationActionSectionInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  sectionId: InnovationSectionEnum;
  actionId: string;

  action?: InnovationActionInfoDTO;
  sectionTitle = '';

  actionsIds: string[] = [];

  actionNumber: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;

  }


  ngOnInit(): void {

    if (this.sectionId) {

      this.innovationsService.getSectionInfo(this.innovationId, this.sectionId, { fields: ['actions'] }).subscribe(sectionInfo => {

        this.actionsIds = sectionInfo.actionsIds ?? [];

        if (this.actionsIds.length === 0) {
          this.redirectTo(`${this.userUrlBasePath}/innovations/${this.innovationId}/action-tracker`);
        }

        this.actionNumber = 0;

        this.getActionInfo();

      });

      this.setBackLink('Go back', `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/record`);

    } else if (this.actionId) {

      this.getActionInfo();

      this.setBackLink('Go back', `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/action-tracker`);

    }

  }

  handlePagination(action: 'previous' | 'next') {

    switch (action) {
      case 'previous':
        if (this.actionNumber === 0) { return; }
        this.actionNumber--;
        break;
      case 'next':
        if (this.actionNumber === this.actionsIds.length - 1) { return; }
        this.actionNumber++;
        break;
      default:
    }

    this.getActionInfo();

  }

  private getActionInfo() {

    this.setPageStatus('LOADING');

    if (this.sectionId) {
      this.actionId = this.actionsIds[this.actionNumber];
    }

    this.innovationsService.getActionInfo(this.innovationId, this.actionId).subscribe(response => {

      this.action = response;

      const section = this.stores.innovation.getInnovationRecordSectionIdentification(response.section);
      this.sectionTitle = section ? `${section.group.number}.${section.section.number} ${section.section.title}` : 'Section no longer available';

      if (this.actionsIds.length > 1) {
        this.setPageTitle('Requested action', { hint: `${this.actionNumber + 1} of ${this.actionsIds.length}` });
      } else {
        this.setPageTitle('Requested action', { hint: this.action.displayId });
      }

      this.stores.context.dismissNotification(this.innovationId, { contextTypes: [NotificationContextTypeEnum.ACTION], contextIds: [this.actionId] });

      this.setPageStatus('READY');

    });

  }

}
