import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

@Component({
  selector: 'app-innovator-pages-innovation-section-submitted',
  templateUrl: './section-submitted.component.html'
})
export class InnovationSectionSubmittedComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;

  isArchived: boolean;

  section: {
    id: string;
    openTasksCount: number;
  };

  sectionLink: string;

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovation = this.ctx.innovation.info();

    this.section = {
      id: this.activatedRoute.snapshot.params.sectionId,
      openTasksCount: 0
    };

    this.sectionLink = `/innovator/innovations/${this.innovation.id}/record/sections/${this.section.id}`;

    this.setPageTitle(`Let your support organisations know you've updated your innovation record`, { size: 'l' });

    this.isArchived = this.ctx.innovation.isArchived();
  }

  ngOnInit() {
    this.isArchived && this.setPageTitle('');

    this.stores.innovation.getSectionInfo$(this.innovation.id, this.section.id).subscribe({
      next: sectionInfo => {
        this.section.openTasksCount = sectionInfo.tasksIds ? sectionInfo.tasksIds.length : 0;
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }
}
