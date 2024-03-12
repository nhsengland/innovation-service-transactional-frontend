import { Pipe, PipeTransform } from '@angular/core';
import { SUPPORT_SUMMARY_MILESTONES } from '@modules/shared/pages/innovation/support/wizard-support-summary-progress-update-milestones/constants';

@Pipe({ name: 'categoryDescription' })
export class ProgressCategoriesSubcategoryDescriptionPipe implements PipeTransform {
  transform(category: string, acronym: string): string {
    return SUPPORT_SUMMARY_MILESTONES[acronym].find(cat => cat.name === category)?.description || '';
  }
}
