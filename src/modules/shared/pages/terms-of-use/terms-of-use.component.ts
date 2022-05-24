import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
// import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


@Component({
  selector: 'app-pages-terms-of-use',
  templateUrl: './terms-of-use.component.html'
})
export class PageTermsOfUseComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };
  id: string;
  signOutURL: string = `${this.stores.environment.APP_URL}/signout`;
  summaryInfo: boolean = false;
  isAgree: boolean = true;
  tou: {
    summary: string,
    name: string
  } = { summary: '', name: '' };

  navigationMenuBar: {    
    rightItems: { title: string, link: string, fullReload?: boolean }[]
  } = {  rightItems: [] };

  constructor(
    // private userService: ServiceUsersService,
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.id = this.activatedRoute.snapshot.params.id;
    this.navigationMenuBar = {
        rightItems: [        
        { title: 'Sign out', link: this.signOutURL, fullReload: true }
      ]
    };
  }

  ngOnInit(): void {
    this.setPageTitle('Account terms of use update');
    this.setPageStatus('READY');        
  }

  termsOfUse(): void{
      this.summaryInfo = !this.summaryInfo;
  }

  notAgree(): void{
    this.isAgree = !this.isAgree;
}
}
