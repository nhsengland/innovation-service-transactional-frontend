import { Component } from '@angular/core';
import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@modules/stores';

@Component({
  selector: 'shared-pages-innovation-record-wrapper',
  templateUrl: './innovation-record-wrapper.component.html'
})
export class PageInnovationRecordWrapperComponent extends CoreComponent {
  innovation: ContextInnovationType;

  // Flags
  isInnovatorType: boolean;
  isInnovationInArchivedStatus: boolean;
  showAllSectionsInfo: boolean;

  constructor() {
    super();

    this.innovation = this.ctx.innovation.info();

    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isInnovationInArchivedStatus = this.ctx.innovation.isArchived();
    // Innovators don't have access to this component, but to make sure.
    this.showAllSectionsInfo = this.isInnovationInArchivedStatus && !this.isInnovatorType;
  }
}
