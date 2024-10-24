import { Component } from '@angular/core';
import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation';

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

    this.innovation = this.stores.other.innovation();

    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isInnovationInArchivedStatus = this.stores.other.isArchived();
    // Innovators don't have access to this component, but to make sure.
    this.showAllSectionsInfo = this.isInnovationInArchivedStatus && !this.isInnovatorType;
  }
}
