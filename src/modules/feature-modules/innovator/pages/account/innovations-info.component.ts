import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { GetInnovationTransfersDTO, InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { InnovationStatusEnum, InnovationTransferStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'shared-pages-account-innovations-info',
  templateUrl: './innovations-info.component.html'
})
export class PageAccountInnovationsInfoComponent extends CoreComponent implements OnInit {

  haveAnyActiveInnovation = false;
  haveAnyInProgressInnovation = false;
  innovationTransfers: GetInnovationTransfersDTO = [];
  pausedInnovationsCounter = 0;
  


  constructor(
    private innovationsService: InnovationsService,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Manage innovations');

  }


  ngOnInit(): void {

    this.getInnovationsTransfers();

  }

  getInnovationsTransfers(): void {

    forkJoin([
      this.innovationsService.getInnovationsList(),
      this.innovatorService.getInnovationTransfers()
    ]).subscribe(([innovationsList, innovationTransfers]) => {

      this.innovationTransfers = innovationTransfers;

      for(const innovation of innovationsList.data) {
        
        if(innovation.status === InnovationStatusEnum.PAUSED) {
          this.pausedInnovationsCounter++;
        }

        if(innovation.status === InnovationStatusEnum.IN_PROGRESS) {
          this.haveAnyInProgressInnovation = true;
        }

      }

      this.haveAnyActiveInnovation = innovationsList.data.filter(i => !this.innovationTransfers.map(it => it.innovation.id).includes(i.id))
        .length
        > 0;

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
