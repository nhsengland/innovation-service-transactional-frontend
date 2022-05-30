import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import {  UserTermsOfUseService } from '@modules/shared/services/userTermsOfuse.service';

@Component({
  selector: 'app-pages-terms-of-use',
  templateUrl: './terms-of-use.component.html'
})
export class PageTermsOfUseComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };
  id: string;
  title = 'Account terms of use update';
  signOutURL: string;
  policyURL: string;
  userType: string;
  isAgree = true;
  tou: {
    id: string,
    summary: string,
    name: string
  } = { id: '', summary: '', name: '' };

  navigationMenuBar: {
    rightItems: { title: string, link: string, fullReload?: boolean }[]
  } = {  rightItems: [] };

  constructor(
    private userTOUService: UserTermsOfUseService,
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.id = this.activatedRoute.snapshot.params.id;
    this.signOutURL = `${this.stores.environment.APP_URL}/signout`;
    this.navigationMenuBar = {
        rightItems: [
        { title: 'Sign out', link: this.signOutURL, fullReload: true }
      ]
    };
    this.userType = this.stores.authentication.getUserType();
    this.policyURL = `${this.stores.environment.APP_URL}` + this.userType === 'INNOVATOR' ? `/terms-of-use/data-inputter` : `/terms-of-use/accessors`;
  }

  ngOnInit(): void {
    this.setPageStatus('READY');
    this.userTOUService.userTermsOfUseInfo().subscribe(response => {
      this.tou = {
          id: response.id,
          summary: response.summary,
          name: response.name
        };
    },
    () => {
        this.setPageStatus('ERROR');
        this.logger.error('Error fetching organisations list');
    });
  }

  notAgree(): void{
    this.alert = { type: null };
    this.isAgree = !this.isAgree;
    if (this.isAgree) {
      this.title = 'Account terms of use update';
    }
    else {
      this.title = 'Agree to the updated terms of use to continue';
    }
  }

  onAgree(): void{
    this.alert = { type: null };

    const dashboardPath = '/transactional/' + this.userType.toLocaleLowerCase() + '/dashboard';
    this.userTOUService.agreeTermsById(this.tou.id).subscribe(response => {
      window.location.assign(dashboardPath);
    },
    () => {
        this.alert = {
          type: 'ERROR',
          title: 'Unable to save terms of use',
          message: 'Please try again or contact us for further help'
        };
        this.logger.error('Error saving terms of use');
    });
  }
}
