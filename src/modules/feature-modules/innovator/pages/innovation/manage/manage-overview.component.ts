import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { ContextInnovationType } from '@modules/stores';
import { InnovationStatusEnum, InnovationTransferStatusEnum } from '@modules/stores/innovation';

import {
  GetInnovationTransfersDTO,
  InnovatorService
} from '@modules/feature-modules/innovator/services/innovator.service';
import { NotificationContextDetailEnum } from '@modules/stores/context/context.enums';

@Component({
  selector: 'app-innovator-pages-innovation-manage-overview',
  templateUrl: './manage-overview.component.html'
})
export class PageInnovationManageOverviewComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;

  isActiveInnovation = false;
  isArchived = false;
  innovationTransfers: GetInnovationTransfersDTO = [];

  constructor(private innovatorService: InnovatorService) {
    super();
    this.setPageTitle('Manage innovation');

    this.innovation = this.ctx.innovation.innovation();
    this.isArchived = this.ctx.innovation.isArchived();
  }

  ngOnInit(): void {
    this.getInnovationsTransfers();
  }

  getInnovationsTransfers(): void {
    this.innovatorService.getInnovationTransfers().subscribe(response => {
      this.innovationTransfers = response.filter(
        innovationTransfer => innovationTransfer.innovation.id === this.innovation.id
      );

      this.isActiveInnovation = this.innovationTransfers.length === 0;

      // Throw notification read dismiss.
      this.stores.context.dismissUserNotification({
        contextDetails: [
          NotificationContextDetailEnum.AU09_TRANSFER_EXPIRED,
          NotificationContextDetailEnum.TO08_TRANSFER_OWNERSHIP_DECLINES_PREVIOUS_OWNER
        ]
      });

      this.setPageStatus('READY');
    });
  }

  cancelInnovationTransfer(transferId: string, innovation: { id: string; name: string }): void {
    this.innovatorService
      .updateTransferInnovation(transferId, InnovationTransferStatusEnum.CANCELED)
      .pipe(
        concatMap(() => {
          this.getInnovationsTransfers();
          return of(true);
        })
      )
      .subscribe({
        next: () => {
          this.setAlertSuccess(`You have cancelled the request to transfer the ownership of '${innovation.name}'`);
        },
        error: () => {
          this.setAlertError(
            'An error occurred when cancelling the transfer. Please try again or contact us for further help'
          );
        }
      });
  }
}
