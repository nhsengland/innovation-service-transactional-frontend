import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { fullCountryCodeList } from './mfa-edit.config';

@Component({
  selector: 'app-account-mfa-list',
  templateUrl: './mfa-list.component.html'
})
export class AccountMFAListComponent extends CoreComponent implements OnInit {
  isMFAOn: boolean;
  MFAMode: 'PHONE' | 'EMAIL' | null = 'PHONE';

  constructor() {
    super();

    this.isMFAOn = true;
  }
  ngOnInit(): void {}
}
