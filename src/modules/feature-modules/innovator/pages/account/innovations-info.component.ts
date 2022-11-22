import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { GetInnovationTransfersDTO, InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { InnovationTransferStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'shared-pages-account-innovations-info',
  templateUrl: './innovations-info.component.html'
})
export class PageAccountInnovationsInfoComponent extends CoreComponent implements OnInit {

  haveAnyActiveInnovation = false;
  innovationTransfers: GetInnovationTransfersDTO = [];


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
