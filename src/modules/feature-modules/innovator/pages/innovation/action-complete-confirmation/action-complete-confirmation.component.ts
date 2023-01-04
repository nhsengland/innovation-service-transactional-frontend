import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-innovator-pages-innovation-action-complete-confirmation',
  templateUrl: './action-complete-confirmation.component.html'
})
export class InnovationActionCompleteConfirmationComponent extends CoreComponent implements OnInit {

  innovationId: string;
  sectionId: string;

  form = new FormGroup({
    actionComplete: new FormControl<boolean>(true, { validators: Validators.required, updateOn: 'change' }),
  }, { updateOn: 'blur' });


  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
  }


  ngOnInit(): void {

    this.setPageTitle('Do you want to set requested action as completed?');
    
   
    this.setBackLink('Go Back', `innovator/innovations/${this.innovationId}/record/sections/${this.sectionId}`);

    this.setPageStatus('READY');
  }


  onConfirmClick(): void {
    const actionComplete = this.form.get('actionComplete')?.value ?? true;

    actionComplete ? this.onSubmitSection() : this.onCompleteSectionLater();    
  }

  private onSubmitSection(): void {
    this.stores.innovation.submitSections$(this.innovationId, this.sectionId).subscribe({
      next: () => {
        this.setAlertSuccess('You have successfully update this section', { message: `requested for this section have neem submitted. You can update this section at any time.` });
      },
      error: () => this.setAlertUnknownError()
    });
  }

  private onCompleteSectionLater(): void {
    this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.sectionId}`);
  }
}
