import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { getInnovationInfoResponse } from '@stores-module/innovation/innovation.models';

@Component({
  selector: 'app-innovator-pages-innovations-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovation: Partial<getInnovationInfoResponse> = {};

  constructor(
    private activatedRoute: ActivatedRoute
  ) { super(); }

  ngOnInit(): void {

    this.stores.innovation.getInnovationInfo$(this.activatedRoute.snapshot.params.innovationId).subscribe(
      response => {
        this.innovation = response;
      },
      error => {
        this.logger.error(error);
      }
    );

  }

}
