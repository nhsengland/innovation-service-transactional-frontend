import { Component, OnInit } from '@angular/core';

import { CookiesService } from '@modules/core';
import { CoreComponent, FormControl, FormGroup, Validators } from '@app/base';

import { COOKIES_USED } from '../../config/constants.config';


@Component({
  selector: 'app-policies-cookies-edit',
  templateUrl: './cookies-edit.component.html',
})
export class CookiesEditComponent extends CoreComponent implements OnInit {

  analyticsCookies = COOKIES_USED.analytics;

  form = new FormGroup({
    analytics: new FormControl('', Validators.required)
  });

  analyticsItems = [
    { value: 'true', label: 'Use cookies to measure my website use' },
    { value: 'false', label: 'Do not use cookies to measure my website use' }
  ];

  constructor(
    private cookiesService: CookiesService
  ) {
    super();

    this.form.get('analytics')?.setValue(this.cookiesService.getConsentCookie().analytics  ? 'true' : 'false');
  }

  ngOnInit(): void { }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    switch (this.form.value.analytics) {
      case 'true':
        this.cookiesService.updateConsentCookie(true);
        break;
      case 'false':
        this.cookiesService.updateConsentCookie(false);
        break;
      default:
        break;
    }

    this.redirectTo('policies/cookies-policy/confirmation');

  }

}
