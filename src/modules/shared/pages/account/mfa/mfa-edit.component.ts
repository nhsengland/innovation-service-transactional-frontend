import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { CustomValidators } from '@modules/shared/forms';

@Component({
  selector: 'shared-pages-account-mfa-edit',
  templateUrl: './mfa-edit.component.html'
})
export class PageAccountMFAEditComponent extends CoreComponent implements OnInit {
  turnOffItems = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ];

  showItems: boolean = true;
  submitButton = { isActive: true, label: 'Continue' };
  editMode: 'set-mfa' | 'turn-off' | 'phone' | 'email' = 'set-mfa';

  userEmail: string = this.stores.authentication.getUserInfo().email;

  verificationMethodItems = [
    {
      value: 'true',
      label: 'Email me',
      description: "We'll send a security code to the email address linked with your account."
    },
    {
      value: 'false',
      label: 'Send me a text message or phone me',
      description: 'Receive a security code by text message or phone call.'
    }
  ];

  form = new FormGroup({
    turnOffItems: new UntypedFormControl('', CustomValidators.required('Choose one option')),
    verificationMethodItems: new UntypedFormControl('', CustomValidators.required('Choose one option')),
    email: new FormControl<string>('', [
      CustomValidators.required('Your email is required'),
      CustomValidators.equalTo(this.userEmail, 'The email is incorrect')
    ]),
    countryCode: new FormControl<string>(''),
    phone: new FormControl<number | null>(null, [CustomValidators.required('Your phone number is required')]),
    phoneConfirmation: new FormControl<number | null>(null, [
      CustomValidators.required('Phone confirmation is required'),
      CustomValidators.equalToField('phone', 'Phone numbers do not match')
    ])
  });

  constructor(private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(queryParams => {
        this.editMode = queryParams.mode;

        switch (this.editMode) {
          case 'phone':
            this.setPageTitle('Set two-step verification method to phone');
            break;
          case 'email':
            this.setPageTitle('Set two-step verification method to email');
            break;
          case 'set-mfa':
            this.setPageTitle('Set two-step verification');
            break;
          case 'turn-off':
            this.setPageTitle('Turn off two-step verification?');
            break;
        }

        this.setPageStatus('READY');
      })
    );
  }

  onSubmitStep() {}

  onSortByChange(selectKey: string): void {
    this.form.get('countryCode')?.setValue(selectKey);
  }
}
