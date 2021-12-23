import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';


interface Breadcrumb {
  label: string;
  url: string;
}


@Component({
  selector: 'theme-header-breadcrumbs-bar',
  templateUrl: './breadcrumbs-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderBreadcrumbsBarComponent implements OnInit, OnDestroy {

  protected subscriptions: Subscription[] = [];

  breadcrumbs: Breadcrumb[] = [];
  backToItem: Breadcrumb = { label: '', url: '' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {

    this.subscriptions.push(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.onRouteChange())
    );

    this.onRouteChange();

  }


  private onRouteChange(): void {
    this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    this.backToItem = this.breadcrumbs.length > 1 ? this.breadcrumbs[this.breadcrumbs.length - 2] : { label: '', url: '' };
    this.cdr.detectChanges();
  }


  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {

    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    if (route.firstChild) {

      const firstChildSnapshot = route.firstChild.snapshot;

      const routeURL = firstChildSnapshot.url.map(segment => segment.path).join('/');
      const routeData = firstChildSnapshot.data;

      url += routeURL ? `/${routeURL}` : '';

      if (routeData.breadcrumb) {
        breadcrumbs.push({
          label: typeof routeData.breadcrumb === 'function' ? routeData.breadcrumb(routeData) : routeData.breadcrumb,
          url
        });
      }

      return this.createBreadcrumbs(route.firstChild, url, breadcrumbs);

    }

    return []; // Code never reaches here!

  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
