import { Component, OnInit } from '@angular/core';

import { CoreComponent, FormControl, FormGroup, Validators } from '@app/base';
import { AlertType } from '@app/base/models';

import { ServiceUsersService } from '../../services/service-users.service';


@Component({
  selector: 'app-admin-pages-service-users-lock',
  templateUrl: './service-users-lock.component.html'
})
export class PageServiceUsersLockComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  pageStep: 'FORM' | 'CODE_REQUEST' | 'SUCCESS' = 'FORM';

  securityConfirmation = { id: '', code: '' };

  form = new FormGroup({
    reason: new FormControl('', Validators.required),
    code: new FormControl('')
  });

  constructor(
    private serviceUsersService: ServiceUsersService
  ) {

    super();
    this.setPageTitle('Lock user');

  }

  ngOnInit(): void { }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.securityConfirmation.code = this.form.get('code')?.value;

    this.serviceUsersService.lockUser({ reason: this.form.get('reason')?.value }, this.securityConfirmation).subscribe(
      response => {

        console.log('Success', response);

        this.alert = {
          type: 'SUCCESS',
          title: 'Operation has completed successfuly',
          setFocus: true
        };

        this.pageStep = 'SUCCESS';
        console.log(this.pageStep);
      },
      error => {

        console.log('Error', error);

        if (error.objectId) {
          this.securityConfirmation.id = error.objectId;
          this.pageStep = 'CODE_REQUEST';
        }

      }
    );

  }

}
