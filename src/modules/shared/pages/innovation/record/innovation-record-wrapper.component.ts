import { Component, computed } from '@angular/core';
import { CoreComponent } from '@app/base';

@Component({
  selector: 'shared-pages-innovation-record-wrapper',
  templateUrl: './innovation-record-wrapper.component.html'
})
export class PageInnovationRecordWrapperComponent extends CoreComponent {
  // Innovators don't have access to this component, but to make sure.
  showAllSectionsInfo = computed(() => this.ctx.innovation.isArchived() && !this.ctx.user.isInnovator());

  constructor() {
    super();
  }
}
