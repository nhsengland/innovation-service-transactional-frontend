import { Component, Input } from '@angular/core';
import { AnnouncementParamsType } from '@modules/feature-modules/admin/services/announcements.service';

export type AnnouncementCardDataType = {
  title: string;
  params: AnnouncementParamsType;
};

@Component({
  selector: 'theme-announcements-card',
  templateUrl: './announcement-card.component.html'
})
export class AnnouncementCardComponent {
  @Input() announcementCardData?: AnnouncementCardDataType;
}
