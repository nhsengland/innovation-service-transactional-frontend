import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';

import { getInnovationTransfersDTO, InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';


@Component({
  selector: 'shared-pages-account-manage-innovations-info',
  templateUrl: './manage-innovations-info.component.html'
})
export class PageAccountManageInnovationsInfoComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  haveAnyActiveInnovation = false;
  innovationTransfers: getInnovationTransfersDTO[] = [];


  constructor(
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Manage innovations');

  }


  ngOnInit(): void {

    this.getInnovationsTransfers();

  }

  getInnovationsTransfers(): void {

    this.innovatorService.getInnovationTransfers().subscribe(
      response => {

        this.innovationTransfers = response;

        this.haveAnyActiveInnovation = this.stores.authentication.getUserInfo()
          .innovations
          .filter(i => !this.innovationTransfers.map(it => it.innovation.id).includes(i.id))
          .length
          > 0;

      },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch innovations transfers',
          message: 'Please, try again or contact us for further help'
        };
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
    ).subscribe(
      () => {
        this.alert = {
          type: 'ACTION',
          title: `You have cancelled the request to transfer the ownership of '${innovation.name}'`,
          setFocus: true
        };
      },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'An error occured when cancelling the transfer',
          message: 'Please, try again or contact us for further help',
          setFocus: true
        };
      }
    );

  }

}
