import { Component, Input } from '@angular/core';

import { CoreComponent } from '@app/base';
import { AnnouncementParamsType } from '../../enums/announcement.enum';

@Component({
  selector: 'app-announcements-announcement-generic',
  templateUrl: './announcement-generic.component.html'
})
export class AnnouncementGenericComponent extends CoreComponent {
  @Input() params?: AnnouncementParamsType["GENERIC"] | null;

  constructor() {
    super();
    this.setPageStatus('READY');
  }

}
