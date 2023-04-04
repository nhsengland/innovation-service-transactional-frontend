import { Component, Input } from '@angular/core';

import { AnnouncementParamsType } from '../../enums/announcement.enum';

@Component({
  selector: 'app-announcements-announcement-generic',
  templateUrl: './announcement-generic.component.html'
})
export class AnnouncementGenericComponent {
  @Input() params?: AnnouncementParamsType["GENERIC"] | null;
}
