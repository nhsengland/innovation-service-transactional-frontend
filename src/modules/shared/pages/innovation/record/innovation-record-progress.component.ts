import { Component, computed, input } from '@angular/core';
import { PluralTranslatePipe } from '@modules/shared/pipes/plural-translate.pipe';
import { SectionsSummaryModel } from '@modules/stores/ctx/innovation/innovation.models';
import { ThemeModule } from '@modules/theme/theme.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'shared-innovation-record-progress',
  templateUrl: './innovation-record-progress.component.html',
  imports: [ThemeModule, PluralTranslatePipe, TranslateModule],
  standalone: true,
  styles: [':host { display: block; }'] // allow host element to be styled
})
export class InnovationRecordProgressComponent {
  sections = input.required<SectionsSummaryModel>();

  flatSections = computed(() => this.sections().flatMap(s => s.sections));
  sectionsComplete = computed(() => this.flatSections().filter(s => s.status === 'SUBMITTED').length);
  sectionsDraft = computed(() => this.flatSections().filter(s => s.status === 'DRAFT').length);
  sectionsTotal = computed(() => this.flatSections().length);
  sectionsNotStarted = computed(() => this.flatSections().filter(s => s.status === 'NOT_STARTED').length);
}
