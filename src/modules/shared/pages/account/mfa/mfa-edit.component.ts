import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineComponent, WizardEngineModel } from '@modules/shared/forms';
import { SelectComponentInputType } from '@modules/theme/components/search/select.component';
import { MFA_EMAIL, MFA_PHONE, MFA_SET_UP, MFA_TURN_OFF, fullCountryCodeList } from './mfa-edit.config';

@Component({
  selector: 'shared-pages-account-mfa-edit',
  templateUrl: './mfa-edit.component.html'
})
export class PageAccountMFAEditComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard = new WizardEngineModel({});

  private _turnOffItems = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ];
  public get turnOffItems() {
    return this._turnOffItems;
  }
  public set turnOffItems(value) {
    this._turnOffItems = value;
  }

  showItems: boolean = true;
  buttonLabel: string = 'Continue';
  submitButton = { isActive: true, label: 'Continue' };
  editMode: 'set-mfa' | 'turn-off' | 'phone' | 'email' = 'set-mfa';

  countryList: SelectComponentInputType[] = fullCountryCodeList.map(country => ({
    key: country.code,
    text: `${country.name} ${country.code}`
  }));

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
        this.setupWizard();
        this.setPageStatus('READY');
      })
    );
  }

  setupWizard(): void {
    if (this.editMode === 'set-mfa') {
      this.wizard = new WizardEngineModel(MFA_SET_UP);
    }
    if (this.editMode === 'turn-off') {
      this.wizard = new WizardEngineModel(MFA_TURN_OFF);
    }
    if (this.editMode === 'email') {
      this.wizard = new WizardEngineModel(MFA_EMAIL);
    }
    if (this.editMode === 'phone') {
      this.wizard = new WizardEngineModel(MFA_PHONE);
    }

    this.wizard
      .gotoStep(1)
      .setAnswers(this.wizard.runInboundParsing({ userEmail: this.userEmail, wizardMode: this.editMode }))
      .runRules();

    this.buttonLabel = this.wizard.isLastStep() ? 'Save' : 'Continue';

    this.setPageTitle(this.wizard.currentStepTitle());
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    const formData = this.formEngineComponent?.getFormValues() ?? { valid: false, data: {} };
    this.wizard.isSummaryStep;

    if (action === 'next' && !formData.valid) {
      // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();
    this.wizard.currentStepTitle;
    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) {
          return;
        } else {
          this.wizard.previousStep();
        }
        break;
      case 'next':
        if (this.wizard.isLastStep()) {
          this.onSubmitWizard();
          return;
        }
        this.wizard.nextStep();
        break;
      default: // Should NOT happen!
        break;
    }
    if (this.wizard.isLastStep()) {
      this.onSubmitWizard();
      return;
    }

    this.buttonLabel = this.wizard.isLastStep() ? 'Save' : 'Continue';

    this.setPageTitle(this.wizard.currentStepTitle());
  }

  onSubmitWizard() {
    const wizardData = this.wizard.runOutboundParsing();
    console.log(wizardData);
  }
}
