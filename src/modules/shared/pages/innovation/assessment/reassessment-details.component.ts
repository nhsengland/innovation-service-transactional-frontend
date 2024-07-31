import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { locale } from '@app/config/translations/en';
import { InnovationNeedsAssessmentInfoDTO } from '@modules/shared/services/innovations.dtos';
import { yesNoItems } from '@modules/stores/innovation/config/innovation-catalog.config';

@Component({
  selector: 'shared-innovation-reassessment-details',
  templateUrl: './reassessment-details.component.html'
})
export class InnovationReassessmentDetailsComponent extends CoreComponent implements OnInit {
  @Input() assessment?: InnovationNeedsAssessmentInfoDTO;

  reassessmentDetails: { label?: string; value: null | string }[] = [];

  constructor(private datePipe: DatePipe) {
    super();
  }

  ngOnInit() {
    // TO DO: Set corresponding values coming from new questions in reassessment flow
    // and remove the ones not used anymore
    if (this.assessment?.reassessment) {
      this.reassessmentDetails = [
        {
          label: 'Needs reassessment submitted',
          value: this.datePipe.transform(this.assessment.reassessment.createdAt, locale.data.app.date_formats.long_date)
        },
        {
          label: 'Previous needs reassessment',
          value: null
        },
        {
          label: 'Reason for reassessment',
          value: this.assessment.reassessment.reassessmentReason
            .map(i =>
              this.translate(
                i === 'OTHER' && this.assessment?.reassessment?.otherReassessmentReason
                  ? this.assessment.reassessment.otherReassessmentReason
                  : `shared.catalog.innovation.reassessment.reassessmentReason.${i}`
              )
            )
            .join('\n')
        },
        {
          label: 'Significant changes since last assessment',
          value: this.assessment.reassessment.description
        },
        {
          label: 'Support required',
          value: this.assessment.reassessment.whatSupportDoYouNeed
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
