import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { ContextInnovationType } from '@modules/stores';

import { InnovationsService } from '@modules/shared/services/innovations.service';


@Component({
  selector: 'app-innovator-pages-innovation-manage-collaborators-info',
  templateUrl: './manage-collaborators-info.component.html'
})
export class PageInnovationManageCollaboratorsInfoComponent extends CoreComponent implements OnInit {

  innovationCollaboratorId: string;
  innovation: ContextInnovationType;
  innovationCollaboration = { email: '', role: '' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationCollaboratorId = this.activatedRoute.snapshot.params.collaboratorId ?? null;
    this.innovation = this.stores.context.getInnovation();

    this.setPageTitle('Manage user');
    this.setBackLink('Go back', `/innovator/innovations/${this.innovation.id}/manage`);

  }

  ngOnInit() {

    this.innovationsService.getInnovationCollaboratorInfo(this.innovation.id, this.innovationCollaboratorId).subscribe(response => {

      this.innovationCollaboration = {
        email: response.email,
        role: response.collaboratorRole ?? ''
      };

      console.log(response);
      this.setPageStatus('READY');

    });


  }

}
