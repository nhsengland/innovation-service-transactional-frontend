import { Component, Input, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { MFAInfoDTO } from '@modules/stores/authentication/authentication.service';
import { getCensoredPhoneNumber } from './mfa-edit.component';

@Component({
  selector: 'app-account-mfa-list',
  templateUrl: './mfa-list.component.html'
})
export class AccountMFAListComponent extends CoreComponent implements OnInit {
  @Input({ required: true }) MFAInfo!: MFAInfoDTO;
  isMFAOn: boolean = false;
  currentCensoredPhoneNumber: string = '';
  userEmail: string = this.stores.authentication.getUserInfo().email;

  constructor() {
    super();
  }
  ngOnInit(): void {
    if (this.MFAInfo.type === 'phone') {
      this.currentCensoredPhoneNumber = getCensoredPhoneNumber(this.MFAInfo.phoneNumber);
    }
    this.isMFAOn = ['phone', 'email'].includes(this.MFAInfo.type);
  }
}
