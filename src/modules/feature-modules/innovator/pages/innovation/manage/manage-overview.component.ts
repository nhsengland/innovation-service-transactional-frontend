import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { ContextInnovationType } from '@modules/stores';
import { InnovationStatusEnum, InnovationTransferStatusEnum } from '@modules/stores/innovation';

import { GetInnovationTransfersDTO, InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'app-innovator-pages-innovation-manage-overview',
  templateUrl: './manage-overview.component.html'
})
export class PageInnovationManageOverviewComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType;

  isActiveInnovation = false;
  isInProgressInnovation = false;
  isInPause = false;
  innovationTransfers: GetInnovationTransfersDTO = [];

  constructor(
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Manage innovation');

    this.innovation = this.stores.context.getInnovation();

    if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS) {
      this.isInProgressInnovation = true;
    } else if (this.innovation.status === InnovationStatusEnum.PAUSED) {
      this.isInPause = true;
    }

  }


  ngOnInit(): void {

    this.getInnovationsTransfers();

  }


  getInnovationsTransfers(): void {

    this.innovatorService.getInnovationTransfers().subscribe((response) => {

      this.innovationTransfers = response.filter(innovationTransfer => innovationTransfer.innovation.id === this.innovation.id);

      this.isActiveInnovation = this.innovationTransfers.length === 0;

      this.setPageStatus('READY');

    });

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
