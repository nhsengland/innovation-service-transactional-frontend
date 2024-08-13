import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { locale } from '@app/config/translations/en';
import { InnovationNeedsAssessmentInfoDTO } from '@modules/shared/services/innovations.dtos';

@Component({
  selector: 'shared-innovation-assessment-details',
  templateUrl: './assessment-details.component.html'
})
export class InnovationAssessmentDetailsComponent extends CoreComponent implements OnInit {
  @Input() assessment?: InnovationNeedsAssessmentInfoDTO;

  assessmentDetails: { label?: string; value: null | string }[] = [];

  isReassessment = false;
  assessmentType = '';

  constructor(private datePipe: DatePipe) {
    super();
  }

  ngOnInit() {
    if (this.assessment) {
      this.isReassessment = this.assessment.majorVersion > 1;
      this.assessmentType = this.isReassessment ? 'reassessment' : 'assessment';

      if (this.assessment.minorVersion) {
        this.assessmentDetails = [
          // Assessment details: info displayed when an assessment/reassessment is edited
          {
            label: `Why are you editing this needs ${this.assessmentType}?`,
            value: this.assessment.editReason
          }
        ];
      } else if (this.assessment.reassessment && this.isReassessment && this.assessment.minorVersion === 0) {
        this.assessmentDetails = [
          // Reassessment details: info displayed when a reassessment is requested by an Innovator
          {
            label: 'Needs reassessment submitted',
            value: this.datePipe.transform(
              this.assessment.reassessment.createdAt,
              locale.data.app.date_formats.long_date
            )
          },
          {
            label: this.assessment.majorVersion === 2 ? 'Previous needs assessment' : 'Previous needs reassessment',
            value: this.datePipe.transform(
              this.assessment.reassessment.previousCreatedAt,
              locale.data.app.date_formats.long_date
            )
          },
          {
            ...(this.assessment.reassessment.reassessmentReason && {
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
            })
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
}
