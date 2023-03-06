import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { GetInnovationTransfersDTO, InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { InnovationStatusEnum, InnovationSupportStatusEnum, InnovationTransferStatusEnum } from '@modules/stores/innovation';
import { ActivatedRoute } from '@angular/router';
import { ContextInnovationType } from '@modules/stores/context/context.types';


@Component({
  selector: 'app-innovator-pages-innovation-manage-info',
  templateUrl: './manage-info.component.html'
})
export class PageInnovationManageInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: ContextInnovationType;

  isActiveInnovation = false;
  isInProgressInnovation = false;
  isInPause = false;
  innovationTransfers: GetInnovationTransfersDTO = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Manage innovation');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = this.stores.context.getInnovation();

    if (this.innovation.status === InnovationStatusEnum.IN_PROGRESS) {
      this.isInProgressInnovation = true;
    }
    else if(this.innovation.status === InnovationStatusEnum.PAUSED) {
      this.isInPause = true;
    }

  }


  ngOnInit(): void {

    this.getInnovationsTransfers();

  }

  getInnovationsTransfers(): void {

    forkJoin([
      this.innovatorService.getInnovationTransfers()
    ]).subscribe(([innovationTransfers]) => {

      this.innovationTransfers = innovationTransfers.filter(innovationTransfer => innovationTransfer.innovation.id === this.innovationId);

      this.isActiveInnovation = this.innovationTransfers.length === 0;

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
