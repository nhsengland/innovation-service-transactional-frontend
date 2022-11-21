import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { InnovationGroupedStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation/innovation.enums';


@Component({
  selector: 'app-innovator-pages-innovations-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;

  innovation: {
    groupedStatus: null | InnovationGroupedStatusEnum,
    organisationsStatusDescription: null | string
  } = { groupedStatus: null, organisationsStatusDescription: null };

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Overview', { hint: 'Your innovation' });

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

  }


  ngOnInit(): void {


    console.log(this.stores.context.getInnovation());

    forkJoin([
      this.innovationsService.getInnovationInfo(this.innovationId),
      // this.stores.innovation.getSectionsSummary$(this.innovationId),
    ]).subscribe(([innovation]) => {

      this.stores.context.dismissNotification(this.innovationId, { contextTypes: [NotificationContextTypeEnum.INNOVATION, NotificationContextTypeEnum.SUPPORT] });

      this.innovation.groupedStatus = this.stores.innovation.getGroupedInnovationStatus(
        innovation.status,
        (innovation.supports ?? []).map(support => support.status),
        innovation.assessment?.reassessmentCount ?? 0
      );

      const occurrences = (innovation.supports ?? []).map(item => item.status)
        .reduce((acc, status) => (
          acc[status] ? ++acc[status].count : acc[status] = { count: 1, text: this.translate('shared.catalog.innovation.support_status.' + status + '.name').toLowerCase() }, acc),
          {} as { [a in InnovationSupportStatusEnum]: { count: number, text: string } });


      console.log(occurrences);
      this.innovation.organisationsStatusDescription = Object.entries(occurrences).map(([status, item]) => `${item.count} ${item.text}`).join(', ');
      // console.log(occurrences) // => {2: 5, 4: 1, 5: 3, 9: 1}

      this.setPageStatus('READY');

    });

  }

}
