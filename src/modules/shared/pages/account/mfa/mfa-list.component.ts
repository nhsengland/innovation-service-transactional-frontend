import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { getCensoredPhoneNumber } from './mfa-edit.component';
import { MFAInfo } from '@modules/stores/ctx/user/user.service';

@Component({
  selector: 'app-account-mfa-list',
  templateUrl: './mfa-list.component.html'
})
export class AccountMFAListComponent extends CoreComponent implements OnInit {
  @Input({ required: true }) MFAInfo!: MFAInfo;
  isMFAOn = false;
  currentCensoredPhoneNumber = '';
  userEmail: string;
  description: string;

  constructor(private activatedRoute: ActivatedRoute) {
    super();
    const isAdmin = this.ctx.user.isAdmin();
    this.userEmail = isAdmin ? this.activatedRoute.snapshot.data.user.email : this.ctx.user.getUserInfo().email;
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
