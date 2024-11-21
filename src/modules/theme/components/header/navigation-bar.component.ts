import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export type HeaderNavigationBarItemType = { key: string; label: string; link: string; fullReload?: boolean }[];

@Component({
  selector: 'theme-header-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNavigationBarComponent {
  @Input() leftMenuItems: HeaderNavigationBarItemType = [];
  @Input() rightMenuItems: HeaderNavigationBarItemType = [];
  @Input() notifications: Record<string, number> = {};
}
