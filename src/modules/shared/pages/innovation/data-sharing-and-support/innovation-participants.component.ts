import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { ContextInnovationType } from '@modules/stores/context/context.types';
import { throws } from 'assert';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'shared-pages-innovation-participants',
  templateUrl: './innovation-participants.component.html'
})
export class PageInnovationParticipantsComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType;

  innovationParticipants: {
    innovators: {
      name: string,
      role?: string
    }[];
    accessors: {
      name: string,
      organisation: {
        name: string,
        acronym: string,
        unit: {
          name: string,
          acronym: string
        }
      }
    }[];
    needsAssessors: {
      name: string
    }[]
  } = { innovators: [], accessors: [], needsAssessors: [] };

  innovationSupportIds: string[] = [];

  constructor(
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Everyone who is working with this innovation', { showPage: false });

    this.innovation = this.stores.context.getInnovation();

  }


  ngOnInit(): void {

    this.setPageStatus('LOADING')

    forkJoin([
      this.innovationsService.getInnovationInfo(this.innovation.id),
      this.innovationsService.getInnovationSupportsList(this.innovation.id, true)
    ]).subscribe(([innovationInfo, innovationSupports]) => {

      this.innovationParticipants.innovators.push({ name: innovationInfo.owner.name, role: 'Owner'})
      
      for (const support of innovationSupports) {
        const unitName = support.organisation.unit.name;
        const accessors = support.engagingAccessors.map(a => ({
          name: a.name,
          organisation: {
            name: support.organisation.name,
            acronym: support.organisation.acronym,
            unit: { name: support.organisation.unit.name, acronym: support.organisation.unit.name }
          }
        }));

        this.innovationParticipants.accessors.push(...accessors)
      }

    });


    this.setPageStatus('READY')
  }

}
