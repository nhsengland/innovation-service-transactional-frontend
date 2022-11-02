import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormControl, Validators } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup } from '@app/base/forms';

import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


@Component({
  selector: 'app-admin-pages-terms-of-use-terms-of-use-new',
  templateUrl: './terms-of-use-new.component.html'
})
export class PageTermsOfUseNewComponent extends CoreComponent implements OnInit {

  typeItems: { value: string, label: string }[] = [
    { label: 'Support organisation', value: 'SUPPORT_ORGANISATION' },
    { label: 'Innovations', value: 'INNOVATOR' }
  ];
  module: 'New' | 'Edit';
  id: string;

  form = new FormGroup({
    name: new UntypedFormControl('', [Validators.maxLength(500), CustomValidators.required('Please enter the name of terms of use')]),
    touType: new UntypedFormControl('', [CustomValidators.required('Please select one of the options')]),
    summary: new UntypedFormControl(''),
    notifyUser: new UntypedFormControl(0, { updateOn: 'change' })
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

    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const body = this.form.value as any;

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
          () => this.redirectTo(`admin/terms-conditions`, { alert: 'versionUpdatedSuccess' }),
          (error: { code: string }) => this.errorResponse(error.code)
        );
        break;

      default:
        this.errorResponse();
        break;
    }

  }

  errorResponse(code?: string): void {
    switch (code || '') {
      case 'UniqueKeyError':
        this.alert = {
          type: 'ERROR',
          title: 'A version of the terms of use with this name already exists, please re-name this new version',
          setFocus: true
        };
        break;
      default:
        this.alert = {
          type: 'ERROR',
          title: 'Unable to perform the necessary action',
          message: 'Please try again or contact us for further help',
          setFocus: true
        };
        break;
    }
  }

}
