import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'theme-header-breadcrumbs-bar',
  templateUrl: './breadcrumbs-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderBreadcrumbsBarComponent implements OnInit {

  @Input() leftMenuItems: { title: string, link: string, fullReload?: boolean }[] = [];
  @Input() rightMenuItems: { title: string, link: string, fullReload?: boolean }[] = [];

  constructor() { }

  ngOnInit(): void { }

}
