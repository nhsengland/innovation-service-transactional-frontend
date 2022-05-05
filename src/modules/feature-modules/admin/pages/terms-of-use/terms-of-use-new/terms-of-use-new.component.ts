import { Component, OnInit } from '@angular/core';
import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { AlertType } from '@app/base/models';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { response } from 'express';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidators } from '@modules/shared/forms';


@Component({
  selector: 'app-admin-pages-terms-of-use-new',
  templateUrl: './terms-of-use-new.component.html'
})
export class PageAdminTermsOfUseNewComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };
  typeItems: { value: string, label: string }[] = [
    { label: 'Support organisation', value: 'SUPPORT_ORGANISATION' },
    { label: 'Innovations', value: 'INNOVATOR' }
  ];
  module: 'New' | 'Edit';
  tou: any;
  id: string;

  form = new FormGroup({
    name: new FormControl('', [Validators.maxLength(500), CustomValidators.required('Please enter name of terms of use')]),
    touType: new FormControl('', [CustomValidators.required('Please select one of the option')]),
    summary: new FormControl('', [CustomValidators.required('Please enter summary of terms of use')]),
    notifyUser: new FormControl(0, { updateOn: 'change' })
  }, { updateOn: 'blur' });

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: ServiceUsersService
  ) {

    super();
    this.module = this.activatedRoute.snapshot.data.module;
    this.id = this.activatedRoute.snapshot.params.id;
    this.setPageTitle(`${this.module} version`);
  }

  ngOnInit(): void {

    if (this.module === 'Edit') {

      this.userService.getTermsById(this.id).subscribe(
        response => {

          this.form.setValue({
            name: response.name,
            touType: response.touType,
            summary: response.summary,
            notifyUser: (response.releasedAt) ? 1 : 0
          });

          this.setPageStatus('READY');
        },
        () => {
          this.setPageStatus('ERROR');
          this.errorResponse();
        }
     );
    }
    this.setPageStatus('READY');
  }

  onSubmit(): void {

    if (this.form.invalid) { return; }

    const body = this.form.value;

    if (this.form.value.notifyUser) { body.releasedAt = new Date(); }

    delete body.notifyUser;

    switch (this.module) {

      case 'New':
        this.userService.createVersion(body).subscribe(
          () => this.redirectTo(`admin/terms-conditions`, { alert: 'versionCreationSuccess' }),
          (error: { code: string }) => this.errorResponse(error.code)
        );
        break;

      case 'Edit':
        this.userService.updateTermsById(this.id, body).subscribe(
          () =>  this.redirectTo(`admin/terms-conditions`, { alert: 'versionUpdatedSuccess' }),
          (error: { code: string }) => this.errorResponse(error.code)
        );
        break;

      default:
        break;
    }

  }

  errorResponse(code?: string): void {
    switch (code || '') {
      case 'UniqueKeyError':
        this.alert = {
          type: 'ERROR',
          title: 'A version of the terms of use with this name already exists, please re-name this new version',
        };
        break;
      default:
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch the necessary information',
          message: 'Please try again or contact us for further help'
        };
        break;
    }
  }

}
