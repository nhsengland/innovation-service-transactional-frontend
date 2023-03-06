import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { GetInnovationTransfersDTO, InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { InnovationStatusEnum, InnovationSupportStatusEnum, InnovationTransferStatusEnum } from '@modules/stores/innovation';
import { ActivatedRoute } from '@angular/router';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import { DateISOType } from '@app/base/types';
import { NotificationContextTypeEnum } from '@app/base/enums';


@Component({
  selector: 'app-innovator-pages-innovation-manage-info',
  templateUrl: './manage-info.component.html'
})
export class PageInnovationManageInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: {
    id: string,
    name: string,
    status: InnovationStatusEnum,
    owner: { name: string, isActive: boolean },
    loggedUser: { isOwner: boolean },
    assessment?: { id: string },
    assignedTo?: { id: string },
    support?: { id: string, status: InnovationSupportStatusEnum },
    notifications?: { [key in NotificationContextTypeEnum]?: number },
    export?: { canUserExport: boolean, pendingRequestsCount: number },
    updatedAt?: null | DateISOType,
  };

  isActiveInnovation = false;
  isInProgressInnovation = false;
  innovationTransfers: GetInnovationTransfersDTO = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Manage innovation');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = this.stores.context.getInnovation();

    if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS) {
      this.isInProgressInnovation = true;
    }

  }


  ngOnInit(): void {

    this.getInnovationsTransfers();

  }

  getInnovationsTransfers(): void {

    forkJoin([
      this.innovationsService.getInnovationsList(),
      this.innovatorService.getInnovationTransfers()
    ]).subscribe(([innovationsList, innovationTransfers]) => {

      this.innovationTransfers = innovationTransfers.filter(innovationTransfer => innovationTransfer.innovation.id === this.innovationId);

      this.isActiveInnovation = innovationsList.data.filter(i => !this.innovationTransfers.map(it => it.innovation.id).includes(this.innovationId))
        .length
        > 0;

      const innovation = innovationsList.data.filter(i => i.id === this.innovationId).shift();
      if (innovation) {
        this.innovation.updatedAt = innovation.updatedAt;
      }

      this.setPageStatus('READY');

    }
    );

  }


  cancelInnovationTransfer(transferId: string, innovation: { id: string, name: string }): void {

    this.innovatorService.updateTransferInnovation(transferId, InnovationTransferStatusEnum.CANCELED).pipe(
      concatMap(() => {
        this.getInnovationsTransfers();
        return of(true);
      })
    ).subscribe({
      next: () => {
        this.setAlertSuccess(`You have cancelled the request to transfer the ownership of '${innovation.name}'`);
      },
      error: () => {
        this.setAlertError('An error occurred when cancelling the transfer. Please try again or contact us for further help');
      }
    });

  }

}
