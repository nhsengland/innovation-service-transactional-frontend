import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  userEmail: string;
  description: string;

  constructor(private activatedRoute: ActivatedRoute) {
    super();
    const isAdmin = this.stores.authentication.isAdminRole();
    this.userEmail = isAdmin
      ? this.activatedRoute.snapshot.data.user.email
      : this.stores.authentication.getUserInfo().email;
    this.description = isAdmin
      ? 'Two-step verification adds a layer of security to the account.'
      : 'Two-step verification adds a layer of security to your account. We will send you a security code to your phone or email for you to use when logging in.';
  }
  ngOnInit(): void {
    if (this.MFAInfo.type === 'phone') {
      this.currentCensoredPhoneNumber = getCensoredPhoneNumber(this.MFAInfo.phoneNumber);
    }
    this.isMFAOn = ['phone', 'email'].includes(this.MFAInfo.type);
  }
}
