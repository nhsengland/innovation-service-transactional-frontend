import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationStore, CtxStore } from '@modules/stores';
import { filter } from 'rxjs';

@Component({
  selector: 'theme-header-archived-banner',
  templateUrl: './header-archived-banner.component.html'
})
export class HeaderArchivedBannerComponent implements OnInit {
  showBanner: boolean = false;
  baseUrl: string = '';
  regEx: RegExp = RegExp('');

  isOwner = signal(false);
  isAdmin = signal(false);
  isInnovator = signal(false);
  statusUpdatedAt = signal<null | string>(null);

  constructor(
    private router: Router,
    private authentication: AuthenticationStore,
    private ctx: CtxStore
  ) {
    this.isInnovator.set(this.authentication.isInnovatorType());
    this.isAdmin.set(this.authentication.isAdminRole());
    const innovation = this.ctx.innovation.innovation();
    this.statusUpdatedAt.set(innovation.statusUpdatedAt);
    this.isOwner.set(this.ctx.innovation.isOwner());

    this.regEx = new RegExp(/innovations\/[\w\-]+\/([\w\-]+|manage\/innovation)(\?.*)?$/);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.checkShowBanner());
  }

  ngOnInit(): void {
    this.checkShowBanner();
  }

  private checkShowBanner() {
    this.showBanner = this.ctx.innovation.isArchived() && this.regEx.test(this.router.url);
  }
}
