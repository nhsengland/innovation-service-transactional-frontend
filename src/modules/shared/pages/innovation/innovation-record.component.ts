import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { SectionsSummaryModel } from '@stores-module/innovation/innovation.models';


@Component({
  selector: 'shared-pages-innovation-record',
  templateUrl: './innovation-record.component.html'
})
export class PageInnovationRecordComponent extends CoreComponent implements OnInit {

  baseUrl = '';

  innovationSections: SectionsSummaryModel[] = [];

  innovationSectionStatus = this.stores.innovation.INNOVATION_SECTION_STATUS;
  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {

    super();

    this.baseUrl = `/${this.activatedRoute.snapshot.data.module}/innovations/${this.activatedRoute.snapshot.params.innovationId}/record/sections`;

  }


  ngOnInit(): void {

    this.getInnovationSections();

  }


  getInnovationSections(): void {

    this.stores.innovation.getSectionsSummary$(this.activatedRoute.snapshot.params.innovationId).subscribe(
      response => this.innovationSections = response,
      error => this.logger.error(error)
    );

  }


}
