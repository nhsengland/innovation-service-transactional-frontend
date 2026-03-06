import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { InnovationArchiveReasonEnum } from '@modules/feature-modules/innovator/services/innovator.service';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { ContextInnovationType, CtxStore } from '@modules/stores';
import { filter } from 'rxjs';

@Component({
  selector: 'theme-header-archived-banner',
  templateUrl: './header-archived-banner.component.html'
})
export class HeaderArchivedBannerComponent implements OnInit {
  showBanner = false;
  baseUrl = '';
  regEx = RegExp('');

  isOwner = signal(false);
  statusUpdatedAt = signal<null | string>(null);

  innovation: ContextInnovationType & {
    archiveReason?: InnovationArchiveReasonEnum | null;
  };

  constructor(
    private router: Router,
    protected ctx: CtxStore,
    private innovationsService: InnovationsService
  ) {
    this.innovation = this.ctx.innovation.info();
    this.statusUpdatedAt.set(this.innovation.statusUpdatedAt);
    this.isOwner.set(this.ctx.innovation.isOwner());

    this.regEx = new RegExp(/innovations\/[\w-]+\/([\w-]+|manage\/innovation)(\?.*)?$/);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.checkShowBanner());
  }

  ngOnInit(): void {
    this.checkShowBanner();
    this.innovationsService.getInnovationInfo(this.innovation.id).subscribe(innovation => {
      this.innovation = {
        ...this.innovation,
        archiveReason: innovation.archiveReason
      };
    });
  }

  private checkShowBanner() {
    this.showBanner = this.ctx.innovation.isArchived() && this.regEx.test(this.router.url);
  }
}
