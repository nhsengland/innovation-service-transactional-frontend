import { Component, Input, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { InnovationNeedsAssessmentInfoDTO } from '@modules/shared/services/innovations.dtos';
import { yesNoItems } from '@modules/stores/innovation/config/innovation-catalog.config';

@Component({
  selector: 'shared-innovation-reassessment-details',
  templateUrl: './reassessment-details.component.html'
})
export class InnovationReassessmentDetailsComponent extends CoreComponent implements OnInit {
  @Input() assessment?: InnovationNeedsAssessmentInfoDTO;

  reassessmentDetails: { label?: string; value: null | string }[] = [];

  constructor() {
    super();
  }

  ngOnInit() {
    // TO DO: Set corresponding values coming from new questions in reassessment flow
    // and remove the ones not used anymore
    if (this.assessment?.reassessment) {
      this.reassessmentDetails = [
        {
          label: 'Did the innovator update the innovation record since submitting it to the previous needs assessment?',
          value:
            yesNoItems.find(item => item.value === this.assessment?.reassessment?.updatedInnovationRecord)?.label || ''
        },
        {
          label: 'Needs reassessment submitted',
          value: null
        },
        {
          label: 'Previous needs reassessment',
          value: null
        },
        {
          label: 'Reason for reassessment',
          value: this.assessment.reassessment.description
        },
        {
          label: 'Significant changes since last assessment',
          value: null
        },
        {
          label: 'Support required',
          value: null
        },
        {
          label: 'Sections updated since previous needs assessment',
          value: this.stores.schema.getGroupSectionsFromSubsections(
            this.assessment.reassessment.sectionsUpdatedSinceLastAssessment
          )
        }
      ];
    }
  }
}
