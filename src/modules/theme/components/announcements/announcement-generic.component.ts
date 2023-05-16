import { Component, Input } from '@angular/core';

import { AnnouncementParamsType } from './announcements.types';


@Component({
  selector: 'theme-announcements-generic',
  templateUrl: './announcement-generic.component.html'
})
export class AnnouncementGenericComponent {

  @Input() params?: null | AnnouncementParamsType['GENERIC'];

}
