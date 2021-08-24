import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'theme-header-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNavigationBarComponent implements OnInit {

  @Input() leftMenuItems: { title: string, link: string, fullReload?: boolean }[] = [];
  @Input() rightMenuItems: { title: string, link: string, fullReload?: boolean }[] = [];
  @Input() notifications: { [key: string]: number } = {};

  constructor() { }

  ngOnInit(): void { }

}
