import { Pipe, PipeTransform } from '@angular/core';
import { SUPPORT_SUMMARY_MILESTONES } from '../../pages/innovation/support/wizard-support-summary-progress-update-milestones/constants';

@Pipe({ name: 'subcategoryDescription' })
export class ProgressCategoriesCategoryDescriptionPipe implements PipeTransform {
  transform(subcategory: string, acronym: string, category: string): string {
    return (
      SUPPORT_SUMMARY_MILESTONES[acronym]
        .find(cat => cat.name === category)
        ?.subcategories?.find(subcat => subcat.name === subcategory)?.description || ''
    );
  }
}
