import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-pages-progress-categories-two-level-milestone',
  templateUrl: './progress-categories-two-level-milestone.component.html'
})
export class PageProgressCategoriesTwoLevelMilestoneComponent {
  @Input() twoLevelMilestone: {
    name: string;
    description: string;
    subcategories?: {
      name: string;
      description: string;
    }[];
  }[] = [];

  constructor() {}
}
