import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-pages-progress-categories-one-level-milestone',
  templateUrl: './progress-categories-one-level-milestone.component.html'
})
export class PageProgressCategoriesOneLevelMilestoneComponent {
  @Input() oneLevelMilestone: {
    name: string;
    description: string;
  }[] = [];

  constructor() {}
}
