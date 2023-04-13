import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup } from '@app/base/forms';
import { DatesHelper } from '@app/base/helpers';
import { DateISOType } from '@app/base/types';
import { LocalStorageHelper } from '@modules/core/helpers/local-storage.helper';

import { GetOwnedInnovations, InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { catchError, forkJoin, map, of } from 'rxjs';


@Component({
  selector: 'shared-pages-account-account-delete',
  templateUrl: './account-delete.component.html'
})
export class PageAccountDeleteComponent extends CoreComponent implements OnInit{

  stepNumber: 1 | 2 | 3 | 4 = 1;
  firstStep: 1 | 2 | 3 | 4 = 1;

  submitButton = { isActive: true, label: 'Delete account' };

  innovator: {
    email: string,
    roleId: string | undefined,
    isOwner: boolean,
    isCollaborator:  boolean,
    hasCollaborators: boolean,
    hasPendingTransfer: boolean,
    ownedInnovations: GetOwnedInnovations[],
  };

  form: FormGroup;


  constructor(
    private innovatorService: InnovatorService,
    private innovationsService: InnovationsService
  ) {

    super();

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));

    const email = this.stores.authentication.getUserInfo().email;
    const roleId = this.stores.authentication.getUserContextInfo()?.roleId;
    this.innovator = {
      email: email,
      roleId: roleId,
      isOwner: false,
      isCollaborator: false,
      hasCollaborators: false,
      hasPendingTransfer: false,
      ownedInnovations: [],
    };

    this.form = new FormGroup({
      confirm: new FormControl<boolean>(false, CustomValidators.required('You need to confirm to proceed')),
      reason: new FormControl<string>('', [CustomValidators.required('A reason is required')]),
      email: new FormControl<string>('', [CustomValidators.required('Your email is required'), CustomValidators.equalTo(this.innovator.email, 'The email is incorrect')]),
      confirmation: new FormControl<string>('', [CustomValidators.required('A confirmation text is necessary'), CustomValidators.equalTo('delete account')]),
    }, { updateOn: 'change' });

  }

  ngOnInit(): void {

    forkJoin([
      this.innovatorService.getOwnedInnovations().pipe(map(response => response), catchError(() => of(null))),
      this.innovationsService.getInnovationsList({ fields: ['groupedStatus', 'statistics'], queryParams: { filters: { hasAccessThrough: ['collaborator'] }, take: 100, skip: 0 } }).pipe(map(response => response), catchError(() => of(null))),
    ]).subscribe(([innovationsListOwner, innovationsListCollaborator]) => {

      if (!innovationsListOwner || !innovationsListCollaborator) {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
        return;
      }

      this.innovator.ownedInnovations = innovationsListOwner;
      this.innovator.isOwner = innovationsListOwner.length > 0 ? true : false;
      this.innovator.isCollaborator = innovationsListCollaborator.count > 0 ? true : false;

      this.innovator.ownedInnovations.forEach(innovation => {
        if(innovation.collaboratorsCount > 0) this.innovator.hasCollaborators = true;
        if(innovation.expirationTransferDate !== null) this.innovator.hasPendingTransfer = true;
      });

      if(this.innovator.ownedInnovations.length > 0) {
        this.setPageTitle('You have innovations linked to this account');
      } else {
        this.setPageTitle('Delete your account');
        this.stepNumber = 3;
        this.firstStep = 3;
      }

      this.setPageStatus('READY');

    });

  }

  onSubmitStep(action: 'previous' | 'next'): void {

    if (action === 'previous') {
      if (this.stepNumber === this.firstStep) {
        this.redirectTo('/innovator/account/manage-account');
        return;
      }
      else if(this.stepNumber === 3 && !this.innovator.hasPendingTransfer) {
        this.stepNumber = 1;
      }
      else {
        this.stepNumber--;
      }
    }
    else {
      if(this.stepNumber === 1 && !this.innovator.hasPendingTransfer) {
        this.stepNumber = 3;
      }
      else if (this.stepNumber === 3 && !this.form.get('reason')?.valid) {
        this.form.get('reason')?.markAsTouched();
        return;
      }
      else {
        this.stepNumber++;
      }
    }

    if (this.stepNumber === 1) {
      this.setPageTitle('You have innovations linked to this account');
    }
    else {
      this.setPageTitle('Delete your account');
    }

  }

  onSubmitForm(): void {

    if (!this.form.get('email')?.valid || !this.form.get('confirmation')?.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitButton = { isActive: false, label: 'Saving...' };

    const body: { reason: string } = {
      reason: this.form.get('reason')?.value
    };

    this.innovatorService.deleteUserAccount(body).subscribe({
      next: () => {
        LocalStorageHelper.removeItem('userContext');
        this.redirectTo('/delete-account-message', {});
    },
      error: () => {
        this.submitButton = { isActive: true, label: 'Delete account' };
        this.setAlertError('An error occured while deleting user. Please, try again or contact us for further help');
      }
    });

  }

  getDeadlineForPendingTransferInDays(date: DateISOType) {
    return DatesHelper.dateDiff(new Date().toISOString(), date)+1;
  }

}
