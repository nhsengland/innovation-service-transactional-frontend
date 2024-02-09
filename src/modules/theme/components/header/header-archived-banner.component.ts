import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ContextInnovationType } from '@app/base/types';
import { AuthenticationStore, ContextStore } from '@modules/stores';
import { filter } from 'rxjs';

@Component({
  selector: 'theme-header-archived-banner',
  templateUrl: './header-archived-banner.component.html'
})
export class HeaderArchivedBannerComponent implements OnInit {
  showBanner: boolean = true;
  baseUrl: string = '';
  regEx: RegExp = RegExp('');

  isInnovator: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  innovation: ContextInnovationType;

  constructor(
    private router: Router,
    private authentication: AuthenticationStore,
    private context: ContextStore
  ) {
    this.isInnovator = this.authentication.isInnovatorType();
    this.isAdmin = this.authentication.isAdminRole();
    this.innovation = this.context.getInnovation();
    this.isOwner = this.innovation.loggedUser.isOwner;
    this.baseUrl = `${this.authentication.userUrlBasePath()}/innovations/${this.innovation.id}`;
    this.regEx = new RegExp(`(${this.baseUrl.replace(/\//g, '\\/')}\/)(manage\/innovation?|[a-zA-Z-]*)$`);

    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => {
      this.innovation = this.context.getInnovation();
      this.showBanner = this.innovation.status === 'ARCHIVED' && this.regEx.test(this.router.url);
    });
  }
  ngOnInit(): void {
    this.showBanner = this.regEx.test(this.router.url);
  }
}
