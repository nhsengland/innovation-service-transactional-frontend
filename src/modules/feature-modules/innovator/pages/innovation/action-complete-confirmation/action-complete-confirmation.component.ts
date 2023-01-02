import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { time } from 'console';


@Component({
  selector: 'app-innovator-pages-innovation-action-complete-confirmation',
  templateUrl: './action-complete-confirmation.component.html'
})
export class InnovationActionCompleteConfirmationComponent extends CoreComponent implements OnInit {

  innovationId: string;
  sectionId: string;
  


  constructor(
    private activatedRoute: ActivatedRoute,
    private InnovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
  }


  ngOnInit(): void {

    this.setPageTitle('Do you want to set requested action as completed?');
    
   
    this.setBackLink('Innovation Record', `innovator/innovations/${this.innovationId}/record/record/sections/$${this.sectionId}`);

    this.setPageStatus('READY');
  }


  onConfirmClick(): void {
    this.stores.innovation.submitSections$(this.innovationId, this.sectionId).subscribe({
      next: () => {
        this.setAlertSuccess('You have successfully update this section', { message: `requested for this section have neem submitted. You can update this section at any time.` });
      },
      error: () => this.setAlertUnknownError()
    });
  }
}
