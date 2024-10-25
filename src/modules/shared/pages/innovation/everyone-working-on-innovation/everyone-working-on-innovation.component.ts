import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { UsersService } from '@modules/shared/services/users.service';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { ContextInnovationType } from '@modules/stores';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'shared-pages-innovation-participants',
  templateUrl: './everyone-working-on-innovation.component.html'
})
export class PageEveryoneWorkingOnInnovationComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;

  innovationParticipants: {
    innovators: {
      name: string;
      role?: string;
    }[];
    accessors: {
      name: string;
      organisation: {
        name: string;
        acronym: string;
        unit: {
          name: string;
          acronym: string;
        };
      };
    }[];
    assessmentUsers: {
      name: string;
    }[];
  } = { innovators: [], accessors: [], assessmentUsers: [] };

  innovationSupportIds: string[] = [];

  constructor(
    private innovationsService: InnovationsService,
    private usersService: UsersService
  ) {
    super();
    this.setPageTitle('Everyone who is working with this innovation', { showPage: false });

    this.innovation = this.ctx.innovation.innovation();
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');

    forkJoin([
      this.innovationsService.getInnovationInfo(this.innovation.id),
      this.innovationsService.getInnovationSupportsList(this.innovation.id, true),
      this.usersService.getUsersList()
    ]).subscribe(([innovationInfo, innovationSupports, assessmentUsers]) => {
      if (innovationInfo.owner) {
        this.innovationParticipants.innovators.push({ name: innovationInfo.owner.name, role: 'Owner' });
      }

      for (const support of innovationSupports) {
        const accessors = support.engagingAccessors.map(a => ({
          name: a.name,
          organisation: {
            name: support.organisation.name,
            acronym: support.organisation.acronym,
            unit: { name: support.organisation.unit.name, acronym: support.organisation.unit.name }
          }
        }));

        this.innovationParticipants.accessors.push(...accessors);
      }

      this.innovationParticipants.assessmentUsers = assessmentUsers.data.map(u => ({ name: u.name }));

      this.setPageStatus('READY');
    });
  }
}
