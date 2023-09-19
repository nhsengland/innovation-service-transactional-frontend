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
  requestedActionsCounter: string = '';
  actionsCounter: number = 0;

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
    this.stores.innovation.getSectionInfo$(this.innovationId, this.sectionId).subscribe({
      next: response => {

        this.setPageTitle('Have you completed all actions for this section?');
        this.requestedActionsCounter = response.tasksIds?.length === 1 ? `${response.tasksIds.length} requested action` : `${response.tasksIds?.length} requested actions`;
        this.actionsCounter = response.tasksIds?.length ?? 0;
        this.setBackLink('Go Back', `innovator/innovations/${this.innovationId}/record/sections/${this.sectionId}`);

        this.setPageStatus('READY');
      }
    })


  }


  onConfirmClick(): void {
    const actionComplete = this.form.get('actionComplete')?.value ?? true;

    actionComplete ? this.onSubmitSection() : this.onCompleteSectionLater();
  }

  private onSubmitSection(): void {
    this.stores.innovation.submitSections$(this.innovationId, this.sectionId).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('You have successfully updated this section', { message: `Actions requested for this section have been submitted. You can update this section at any time.` });

        this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.sectionId}`);
      },
      error: () => this.setAlertUnknownError()
    });
  }

  private onCompleteSectionLater(): void {
    this.setRedirectAlertInformation('Your section will be in draft until you complete all actions requested for this section')
    this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.sectionId}`);
  }
}
