import { Component, input } from '@angular/core';
import { PluralTranslatePipe } from '@modules/shared/pipes/plural-translate.pipe';
import { ThemeModule } from '@modules/theme/theme.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'shared-innovation-record-progress',
  template: `
    <p class="d-flex nhsuk-u-margin-0">
      <theme-svg-icon type="success"></theme-svg-icon>
      <span class="nhsuk-u-margin-right-2"></span>
      {{ sectionsComplete() }} of {{ sectionsTotal() }}
      {{ 'dictionary.section' | pluralTranslate: sectionsTotal() | translate }} completed
    </p>
    @if (sectionsDraft() > 0) {
      <p class="d-flex nhsuk-u-margin-0">
        <theme-svg-icon type="edit"></theme-svg-icon>
        <span class="nhsuk-u-margin-right-2"></span>
        {{ sectionsDraft() }} {{ 'dictionary.section' | pluralTranslate: sectionsDraft() | translate }} in draft
      </p>
    }
    @if (sectionsNotStarted() > 0) {
      <p class="d-flex">
        <theme-svg-icon type="not-started" customColor="grey"></theme-svg-icon>
        <span class="nhsuk-u-margin-right-2"></span>
        {{ sectionsNotStarted() }} {{ 'dictionary.section' | pluralTranslate: sectionsNotStarted() | translate }} not
        started
      </p>
    }
  `,
  imports: [ThemeModule, PluralTranslatePipe, TranslateModule],
  standalone: true
})
export class InnovationRecordProgressComponent {
  sectionsComplete = input.required<number>();
  sectionsDraft = input.required<number>();
  sectionsTotal = input.required<number>();
  sectionsNotStarted = input.required<number>();
}
