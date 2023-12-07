import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { HttpXsrfTokenExtractor } from '@angular/common/http';

import { CookiesService } from '@modules/core';
import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup } from '@app/base/forms';

import { COOKIES_USED } from '../../config/constants.config';

@Component({
  selector: 'app-policies-cookies-edit',
  templateUrl: './cookies-edit.component.html'
})
export class CookiesEditComponent extends CoreComponent {
  analyticsCookies = COOKIES_USED.analytics;

  form = new FormGroup({
    _csrf: new UntypedFormControl(this.tokenExtractor.getToken()),
    analytics: new UntypedFormControl('', CustomValidators.required('Choose one option'))
  });

  analyticsItems = [
    { value: 'true', label: 'Use cookies to measure my website use' },
    { value: 'false', label: 'Do not use cookies to measure my website use' }
  ];

  constructor(
    private tokenExtractor: HttpXsrfTokenExtractor,
    private cookiesService: CookiesService
  ) {
    super();
    this.setPageTitle('Choose which cookies we use');

    this.form.get('analytics')?.setValue(this.cookiesService.getConsentCookie().analytics ? 'true' : 'false');
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    switch (this.form.value.analytics) {
      case 'true':
        this.cookiesService.setConsentCookie(true);
        break;
      case 'false':
        this.cookiesService.setConsentCookie(false);
        break;
      default:
        break;
    }

    this.redirectTo('policies/cookies-policy/confirmation');
  }
}
