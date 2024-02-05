import { Component, Input, OnInit } from '@angular/core';
import { DateISOType } from '@app/base/types';

@Component({
  selector: 'theme-header-archived-banner',
  templateUrl: './header-archived-banner.component.html'
})
export class HeaderArchivedBannerComponent implements OnInit {
  @Input() statusUpdatedAt: DateISOType;

  constructor() {}
}
