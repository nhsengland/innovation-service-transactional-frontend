import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { sortBy } from 'lodash';

import { CoreComponent } from '@app/base';

import { SectionsSummaryModel } from '@stores-module/innovation/innovation.models';


@Component({
  selector: 'shared-pages-innovation-record',
  templateUrl: './innovation-record.component.html',
  styleUrls: ['./innovation-record.component.scss']
})
export class PageInnovationRecordComponent extends CoreComponent implements OnInit {

  baseUrl = '';

  innovationSections: SectionsSummaryModel[] = [];
  progressBar: {
    blocks: boolean[];
    completed: string;
    uncompleted: string;
  };

  innovationSectionStatus = this.stores.innovation.INNOVATION_SECTION_STATUS;
  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.baseUrl = `/${this.activatedRoute.snapshot.data.module}/innovations/${this.activatedRoute.snapshot.params.innovationId}/record/sections`;

    this.progressBar = { blocks: [], completed: '', uncompleted: '' };

  }


  ngOnInit(): void {

    this.getInnovationSections();

  }


  getInnovationSections(): void {

    this.stores.innovation.getSectionsSummary$(this.activatedRoute.snapshot.params.innovationId).subscribe(
      response => {

        this.innovationSections = response;

        this.progressBar.blocks = [...this.innovationSections].reduce((acc: boolean[], item) => {
          return [...acc, ...item.sections.map(section => section.isCompleted)];
        }, []).sort().reverse();

        this.progressBar.completed = `${this.progressBar.blocks.filter(s => s).length} sections submitted`;
        this.progressBar.uncompleted = `${this.progressBar.blocks.filter(s => !s).length} sections not yet submitted`;

      },
      error => this.logger.error(error)
    );

  }


  getSectionsArray(): SectionsSummaryModel['sections'] {

    const toReturn = [...this.innovationSections].reduce((acc: SectionsSummaryModel['sections'], item) => {
      return [...acc, ...item.sections];
    }, []);

    return sortBy(toReturn, 'isCompleted');

  }

}
