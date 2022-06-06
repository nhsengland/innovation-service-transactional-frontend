import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';

import { InnovationsService } from '@modules/shared/services/innovations.service';


@Component({
  selector: 'app-innovator-pages-innovations-list',
  templateUrl: './innovations-list.component.html'
})
export class InnovationsListComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  innovations: { id: string, name: string }[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
  ) {

    super();
    this.setPageTitle('Choose innovation');

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'innovationCreationSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: `You have successfully registered the innovation '${this.activatedRoute.snapshot.queryParams.name}'`
        };
        break;
      default:
        break;
    }

  }


  ngOnInit(): void {

    this.innovationsService.getInnovationsList().subscribe(
      response => {

        this.innovations = response;

      });

  }

}
