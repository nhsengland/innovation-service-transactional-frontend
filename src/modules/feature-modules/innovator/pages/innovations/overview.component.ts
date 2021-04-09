import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { InnovationsService, getInnovationInfoResponse } from '../../services/innovations.service';

@Component({
  selector: 'app-innovator-pages-innovations-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovation: Partial<getInnovationInfoResponse> = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) { super(); }

  ngOnInit(): void {

    this.innovationsService.getInnovationInfo(this.activatedRoute.snapshot.params.innovationId).subscribe(
      response => {
        this.innovation = response;
      },
      error => {
        this.logger.error(error);
      }
    );

  }

}
