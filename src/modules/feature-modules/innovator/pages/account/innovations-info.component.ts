import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { getInnovationTransfersDTO, InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'shared-pages-account-innovations-info',
  templateUrl: './innovations-info.component.html'
})
export class PageAccountInnovationsInfoComponent extends CoreComponent implements OnInit {

  haveAnyActiveInnovation = false;
  innovationTransfers: getInnovationTransfersDTO[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
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

      this.haveAnyActiveInnovation = innovationsList.filter(i => !this.innovationTransfers.map(it => it.innovation.id).includes(i.id))
        .length
        > 0;

      this.setPageStatus('READY');

    }
    );
  }


  cancelInnovationTransfer(transferId: string, innovation: { id: string, name: string }): void {

    this.innovatorService.updateTransferInnovation(transferId, 'CANCELED').pipe(
      // concatMap(() => this.stores.authentication.initializeAuthentication$()), // Initialize authentication in order to update First Time SignIn information.
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
