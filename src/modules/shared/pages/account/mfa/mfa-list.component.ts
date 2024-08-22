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

  constructor(private activatedRoute: ActivatedRoute) {
    super();
    this.userEmail = this.stores.authentication.isAdminRole()
      ? this.activatedRoute.snapshot.data.user.email
      : this.stores.authentication.getUserInfo().email;
  }
  ngOnInit(): void {
    if (this.MFAInfo.type === 'phone') {
      this.currentCensoredPhoneNumber = getCensoredPhoneNumber(this.MFAInfo.phoneNumber);
    }
    this.isMFAOn = ['phone', 'email'].includes(this.MFAInfo.type);
  }
}
