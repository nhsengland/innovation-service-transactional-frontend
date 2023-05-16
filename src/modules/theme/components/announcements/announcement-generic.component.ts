import { Component, Input } from '@angular/core';

import { CoreComponent } from '@app/base';
import { AnnouncementParamsType } from './announcements.types';


@Component({
  selector: 'theme-announcements-generic',
  templateUrl: './announcement-generic.component.html'
})
export class AnnouncementGenericComponent extends CoreComponent {

  @Input() params?: null | AnnouncementParamsType['GENERIC'];

  constructor() {
    super();
    this.setPageStatus('READY');
  }
}
